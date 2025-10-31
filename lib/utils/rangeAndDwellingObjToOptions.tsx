import { LeadSource } from '@redux/feature/lead/ILeadState';
import { DwellingType, Range } from '@redux/feature/types/ITypesState';
import { enumToReadable } from './enumToRedable';

export type Option = {
  label: string;
  value: string;
};

export function mapToOptions<T extends Range | DwellingType | LeadSource>(items: T[]): Option[] {
  return (
    items &&
    items?.length > 0 &&
    items?.map(item => ({
      label: item.name,
      value: item.name,
    }))
  );
}
