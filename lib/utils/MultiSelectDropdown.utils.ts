import { RefObject } from 'react';

export interface DropdownItem {
  id: string;
  name: string;
}

export const filterItems = (
  items: DropdownItem[],
  selectedItems: DropdownItem[],
  searchTerm: string
): DropdownItem[] => {
  const searchLower = searchTerm.toLowerCase();
  return items.filter(
    (item) =>
      !selectedItems.some((selected) => selected.id === item.id) &&
      item.name.toLowerCase().includes(searchLower)
  );
};

export const getDropdownPosition = (
  buttonRef: RefObject<HTMLElement>,
  dropdownHeight: number = 200
): 'top' | 'bottom' => {
  if (!buttonRef.current) return 'bottom';
  
  const buttonRect = buttonRef.current.getBoundingClientRect();
  const spaceBelow = window.innerHeight - buttonRect.bottom;
  const spaceAbove = buttonRect.top;
  
  return spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom';
};

export const isClickOutside = (
  ref: RefObject<HTMLElement>,
  event: MouseEvent
): boolean => {
  return ref.current ? !ref.current.contains(event.target as Node) : false;
};

export const handleKeyDown = (
  event: React.KeyboardEvent,
  options: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onEnter?: () => void;
    onEscape?: () => void;
  }
) => {
  const { isOpen, setIsOpen, onEnter, onEscape } = options;
  
  switch (event.key) {
    case 'Enter':
      if (!isOpen) {
        setIsOpen(true);
      } else if (onEnter) {
        onEnter();
      }
      event.preventDefault();
      break;
    case 'Escape':
      if (isOpen) {
        setIsOpen(false);
      } else if (onEscape) {
        onEscape();
      }
      event.preventDefault();
      break;
    case 'Tab':
      if (isOpen) {
        setIsOpen(false);
      }
      break;
    default:
      break;
  }
};

export const handleAddNewItem = async (
  searchTerm: string,
  selectedItems: DropdownItem[],
  onAddNewItem: (name: string) => Promise<DropdownItem>,
  onSelectionChange: (items: DropdownItem[]) => void,
  setSearchTerm: (term: string) => void,
  setIsAdding: (isAdding: boolean) => void
) => {
  if (!searchTerm.trim()) return;
  
  setIsAdding(true);
  try {
    const newItem = await onAddNewItem(searchTerm);
    onSelectionChange([...selectedItems, newItem]);
    setSearchTerm('');
  } catch (error) {
    console.error('Error adding new item:', error);
  } finally {
    setIsAdding(false);
  }
};
