import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// delay:  debounce time
// filtersKey: string[] — list of query parameter keys to manage and sync with the URL.
// initialValue?: object — optional default values that are applied first and override URL search params.
// shouldSyncURL?: new prop to control URL syncing
interface DebouncedURLOptions {
  delay?: number;
  filtersKey: string[];
  initialValue?: Record<string, string>;
  shouldSyncURL?: boolean;
}
export function debouncedURL({
  delay = 500,
  filtersKey,
  initialValue = {},
  shouldSyncURL = true,
}: DebouncedURLOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, string> | null>(
    filtersKey.reduce(
      (acc, key) => {
        acc[key] = searchParams.get(key) || (initialValue && initialValue[key]);
        return acc;
      },
      {} as Record<string, string>
    )
  );
  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: Record<string, string | number | null | undefined>) => {
        if (shouldSyncURL) {
          const params = new URLSearchParams(searchParams.toString());
          newFilters &&
            Object.entries(newFilters).forEach(([key, value]) => {
              if (value !== null && value !== undefined && value !== '') {
                params.set(key, value.toString());
              } else {
                params.delete(key);
              }
            });
          router.replace(`${pathname}?${params.toString()}`);
        }
      }, delay),
    [pathname, router, delay, shouldSyncURL]
  );
  const setParams = useCallback(
    updatedParams => {
      setFilters(prev => {
        const newFilters = { ...prev, ...updatedParams };
        debouncedUpdateURL(newFilters);
        return newFilters;
      });
    },
    [debouncedUpdateURL]
  );

  const resetParams = useCallback(() => {
    setFilters(null);
    debouncedUpdateURL(null);
  }, [debouncedUpdateURL]);

  useEffect(() => {
    debouncedUpdateURL(filters);
  }, []);
  return { debouncedUpdateURL, setParams, filters, resetParams };
}
