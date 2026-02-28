import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

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
  const [filters, setFilters] = useState<Record<string, string>>(
    filtersKey.reduce(
      (acc, key) => {
        acc[key] = searchParams.get(key) || (initialValue && initialValue[key]) || '';
        return acc;
      },
      {} as Record<string, string>
    )
  );
  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: Record<string, string>) => {
        setFilters(newFilters);
        if (shouldSyncURL) {
          const params = new URLSearchParams(searchParams.toString());
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
    (updatedParams: Record<string, string>) => {
      const newFilters = { ...filters, ...updatedParams };
      debouncedUpdateURL(newFilters);
    },
    [filters, debouncedUpdateURL]
  );

  const resetParams = useCallback(() => {
    const resetFilters = filtersKey.reduce(
      (acc, key) => {
        acc[key] = initialValue[key] || '';
        return acc;
      },
      {} as Record<string, string>
    );
    debouncedUpdateURL(resetFilters);
  }, [debouncedUpdateURL, filtersKey, initialValue]);

  return { debouncedUpdateURL, setParams, filters, resetParams };
}
