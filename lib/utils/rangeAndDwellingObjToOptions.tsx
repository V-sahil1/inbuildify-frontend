import { DwellingType, Range } from '@redux/feature/types/ITypesState';
import { LeadSourceType } from '@redux/feature/admin/sales/leadSource/ILeadSourceState';

export type Option = {
  label: string;
  value: string;
};

export function mapToOptions<T extends Range | DwellingType | LeadSourceType>(
  items: T[],
  label: string,
  values: string
): Option[] {
  return (
    items &&
    items?.length > 0 &&
    items?.map(item => ({
      label: item[label],
      value: item[values],
    }))
  );
}
