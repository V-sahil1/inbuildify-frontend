import { useMemo } from 'react';
import { debounce } from 'lodash';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function debouncedURL(delay = 500) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: Record<string, string | number | null | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newFilters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.set(key, value.toString());
          } else {
            params.delete(key);
          }
        });

        router.replace(`${pathname}?${params.toString()}`);
      }, delay),
    [pathname, router, searchParams, delay]
  );

  return debouncedUpdateURL;
}
