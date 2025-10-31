'use client';

import React, { useState } from 'react';

export interface FilterOption {
  type: string;
  label: string;
  count: number;
}

interface FilterTabsProps {
  options: FilterOption[];
  defaultType?: string;
  onChange?: (selectedType: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ options, defaultType, onChange }) => {
  const [activeType, setActiveType] = useState(defaultType || options[0]?.type);

  const handleSelect = (type: string) => {
    setActiveType(type);
    onChange?.(type);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(filter => (
        <button
          key={filter.type}
          onClick={() => handleSelect(filter.type)}
          className={`px-4 py-2 text-sm font-medium transition-all duration-150 ${
            activeType === filter.type
              ? 'bg-primary text-white rounded border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>{filter.label}</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {filter.count}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
