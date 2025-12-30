import { useState, useEffect, startTransition } from "react";
import { z } from "zod";
import { storage, safeParseJSON } from "../utils/storage";

interface CacheOptions {
  ttl?: number;
  key: string;
  schema?: z.ZodSchema<unknown>;
}

export const useCachedData = <T>(
  fetchFn: () => Promise<T>,
  options: CacheOptions,
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cached = storage.getString(options.key);
    const cachedTime = storage.getString(`${options.key}_time`);

    if (cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      if (!options.ttl || age < options.ttl) {
        try {
          let parsedData: T;

          if (options.schema) {
            parsedData = safeParseJSON(
              cached,
              options.schema as z.ZodSchema<T>,
              null as T,
            ) as T;
            if (parsedData !== null) {
              startTransition(() => {
                setData(parsedData);
                setLoading(false);
              });
              return;
            }
          } else {
            parsedData = JSON.parse(cached) as T;
            startTransition(() => {
              setData(parsedData);
              setLoading(false);
            });
            return;
          }
        } catch {
          // Если парсинг не удался, загружаем заново
        }
      }
    }

    fetchFn()
      .then((result) => {
        startTransition(() => {
          setData(result);
          setError(null);
        });
        storage.set(options.key, result);
        storage.set(`${options.key}_time`, Date.now().toString());
      })
      .catch((err) => {
        startTransition(() => {
          setError(err as Error);
        });
      })
      .finally(() => {
        startTransition(() => {
          setLoading(false);
        });
      });
  }, [fetchFn, options.key, options.ttl, options.schema]);

  return { data, loading, error };
};
