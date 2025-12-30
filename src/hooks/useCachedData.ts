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
              setData(parsedData);
              setLoading(false);
              return;
            }
          } else {
            parsedData = JSON.parse(cached) as T;
            setData(parsedData);
            setLoading(false);
            return;
          }
        } catch {
        }
      }
    }

    fetchFn()
      .then((result) => {
        setData(result);
        localStorage.setItem(options.key, JSON.stringify(result));
        localStorage.setItem(`${options.key}_time`, Date.now().toString());
        setError(null);
      })
      .catch((err) => {
        setError(err as Error);
      })
      .finally(() => setLoading(false));
  }, [fetchFn, options.key, options.ttl]);

  return { data, loading, error };
};

