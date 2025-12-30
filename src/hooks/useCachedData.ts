import { useState, useEffect } from "react";
import { z } from "zod";
import { safeParseJSON } from "../utils/storage";

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
    const cached = localStorage.getItem(options.key);
    const cachedTime = localStorage.getItem(`${options.key}_time`);

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
              setTimeout(() => {
                setData(parsedData);
                setLoading(false);
              }, 0);
              return;
            }
          } else {
            parsedData = JSON.parse(cached) as T;
            setTimeout(() => {
              setData(parsedData);
              setLoading(false);
            }, 0);
            return;
          }
        } catch {
          // Если парсинг не удался, загружаем заново
        }
      }
    }

    fetchFn()
      .then((result) => {
        setTimeout(() => {
          setData(result);
          setError(null);
        }, 0);
        localStorage.setItem(options.key, JSON.stringify(result));
        localStorage.setItem(`${options.key}_time`, Date.now().toString());
      })
      .catch((err) => {
        setTimeout(() => {
          setError(err as Error);
        }, 0);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 0);
      });
  }, [fetchFn, options.key, options.ttl, options.schema]);

  return { data, loading, error };
};
