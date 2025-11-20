import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  DropdownItem,
  filterItems,
  getDropdownPosition,
  isClickOutside,
  handleKeyDown as handleKeyDownUtil,
  handleAddNewItem as handleAddNewItemUtil
} from '../../lib/utils/MultiSelectDropdown.utils';
import { Input } from 'antd';

// Icons
const X = ({ className = '' }: { className?: string }) => (
  <span className={`inline-block text-base leading-none ${className}`}>×</span>
);


interface MultiSelectDropdownProps {
  items: DropdownItem[];
  selectedItems: DropdownItem[];
  onSelectionChange: (selected: DropdownItem[]) => void;
  onAddNewItem?: (name: string) => Promise<DropdownItem>;
  placeholder?: string;
  loading?: boolean;
  className?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onAddNewItem,
  placeholder = 'Select items...',
  loading = false,  
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const filteredItems = filterItems(items, selectedItems, searchTerm);

  const handleSelect = useCallback((item: DropdownItem) => {
    onSelectionChange([...selectedItems, item]);
    setSearchTerm('');
  }, [onSelectionChange, selectedItems]);

  const handleRemove = useCallback((id: string) => {
    onSelectionChange(selectedItems.filter((item) => item.id !== id));
  }, [onSelectionChange, selectedItems]);

  const handleAddNew = useCallback(async () => {
    if (!onAddNewItem) return;
    await handleAddNewItemUtil(
      searchTerm,
      selectedItems,
      onAddNewItem,
      onSelectionChange,
      setSearchTerm,
      setIsAdding
    );
  }, [onAddNewItem, searchTerm, selectedItems, onSelectionChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isClickOutside(dropdownRef, event)) {
        setIsOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (isOpen) {
        const position = getDropdownPosition(buttonRef, dropdownMenuRef.current?.offsetHeight);
        setDropdownPosition(position);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updateDropdownPosition);
    
    // Initial position check
    if (isOpen) {
      // Use requestAnimationFrame to ensure the dropdown is rendered before checking position
      const timer = requestAnimationFrame(updateDropdownPosition);
      return () => {
        cancelAnimationFrame(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDownUtil(e, {
      isOpen,
      setIsOpen,
      onEnter: handleAddNew
    });
  };

  return (
    <div className={`${className}`} ref={dropdownRef}>
      <div className="flex flex-wrap items-center gap-2">        
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-amber-500 text-white rounded-md"
              >
                {item.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          {placeholder}
        </button>
      </div>

      {isOpen && (
        <div 
          ref={dropdownMenuRef}
          className={`z-10 w-full ${
            dropdownPosition === 'bottom' ? 'mt-1' : 'mb-1 bottom-full'
          } bg-white border rounded-md shadow-lg`}
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          <div className="p-2 border-b">
            <Input
              type="text"
              value={searchTerm}
              onKeyDown={handleKeyDown}
              className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search or add new..."
              autoFocus
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-2 text-sm text-gray-500">Loading...</div>
            ) : filteredItems.length === 0 && searchTerm ? (
              onAddNewItem ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNew();
                  }}
                  disabled={isAdding}
                  className="w-full p-2 text-sm text-left text-blue-600 hover:bg-blue-50"
                >
                  {isAdding ? 'Adding...' : `Add "${searchTerm}"`}
                </button>
              ) : (
                <div className="p-2 text-sm text-gray-500">No items found</div>
              )
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                  className="p-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {item.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
