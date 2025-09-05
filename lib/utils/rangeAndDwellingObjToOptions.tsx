import { DwellingType, Range } from "@redux/feature/types/ITypesState";

type Option = {
    label: string;
    value: string;
};
  
export function mapToOptions<T extends Range | DwellingType>(items: T[]): Option[] {
    return items?.map((item) => ({
      label: item.name,
      value: item.name,
    }));
}