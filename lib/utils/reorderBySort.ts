export interface SortableEntity {
  id: string | number;
  sortOrder: number;
}

export function reorderList<T extends SortableEntity>(list: T[], item: T): T[] {
  const filtered = list.filter(i => i.id !== item.id);

  let newSort = Number(item.sortOrder);

  if (isNaN(newSort) || newSort < 1) newSort = 1;
  if (newSort > filtered.length + 1) newSort = filtered.length + 1;

  const reordered = [
    ...filtered.slice(0, newSort - 1),
    { ...item, sortOrder: newSort },
    ...filtered.slice(newSort - 1),
  ];

  return reordered.map((obj, index) => ({
    ...obj,
    sortOrder: index + 1,
  }));
}

export function mapToSortable<T>(
  list: T[],
  config: {
    idKey: keyof T;
    sortKey: keyof T;
  }
): (T & { id: string | number; sortOrder: number })[] {
  return list.map(item => ({
    ...item,
    id: item[config.idKey] as string | number,
    sortOrder: Number(item[config.sortKey]),
  }));
}

export function mapBackFromSortable<T>(
  list: any[],
  config: {
    idKey: keyof T;
    sortKey: keyof T;
  }
): T[] {
  return list.map(item => ({
    ...item,
    [config.idKey]: item.id,
    [config.sortKey]: item.sortOrder,
  }));
}

export function handleReorder<T>(
  list: T[],
  updatedItem: T,
  config: {
    idKey: keyof T;
    sortKey: keyof T;
  }
): T[] {
  const sortableList = mapToSortable(list, config);
  const sortableItem = {
    ...updatedItem,
    id: updatedItem[config.idKey] as string | number,
    sortOrder: Number(updatedItem[config.sortKey]),
  };

  const reordered = reorderList(sortableList, sortableItem);

  return mapBackFromSortable<T>(reordered, config);
}
