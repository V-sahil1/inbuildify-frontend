export interface SortableItem {
  id: number;
  sort: number;
  [key: string]: any;
}
export function reorderBySort<T extends SortableItem>(list: T[], item: T): T[] {
  const filtered = list.filter(obj => obj.id !== item.id);
  let newSort = Number(item.sort);
  if (Number.isNaN(newSort) || newSort < 1) newSort = 1;
  if (newSort > filtered.length + 1) newSort = filtered.length + 1;
  const reordered = [
    ...filtered.slice(0, newSort - 1),
    { ...item, sort: newSort },
    ...filtered.slice(newSort - 1),
  ];
  return reordered.map((obj, index) => ({ ...obj, sort: index + 1 }));
}
