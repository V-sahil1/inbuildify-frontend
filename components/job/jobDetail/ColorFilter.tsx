import React from 'react';
import { Input, Switch, Button, Dropdown, Menu } from 'antd';
import {
  IconArrowDown,
  IconBrandAppstore,
  IconGrid3x3,
  IconLayout2,
  IconLayoutDistributeHorizontal,
  IconSearch,
} from '@tabler/icons-react';

interface ColorFilterProps {
  selectedCount?: number;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;

  // Use a single toggle handler
  onToggleLayout?: () => void;

  // Pass a prop to know the current layout and show the correct icon
  isGridView?: boolean;

  imageInPdf?: boolean;
  onImageInPdfChange?: (value: boolean) => void;

  price?: boolean;
  onPriceChange?: (value: boolean) => void;

  activeTab?: 'all' | 'standard' | 'upgrade';
  onTabChange?: (tab: 'all' | 'standard' | 'upgrade') => void;

  suppliers?: { key: string; label: string }[];
  onSupplierSelect?: (key: string) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({
  selectedCount = 0,
  searchPlaceholder = 'Search by items, suppliers',
  onSearch,

  isGridView = false,
  onToggleLayout,

  imageInPdf = true,
  onImageInPdfChange,

  price = true,
  onPriceChange,

  activeTab = 'all',
  onTabChange,

  suppliers = [],
  onSupplierSelect,
}) => {
  const menu = (
    <Menu onClick={({ key }) => onSupplierSelect && onSupplierSelect(key)} items={suppliers} />
  );
  return (
    <div className="grid grid-cols-[250px_1fr] gap-2">
      <div>
        <Button className="w-full">
          Selected Items <span>{selectedCount}</span>
        </Button>
      </div>
      <div className="flex items-center gap-6">
        <Input.Search placeholder={searchPlaceholder} onSearch={onSearch} className="w-48" />

        {/* Layout Toggle Icon */}
        {isGridView ? (
          <Button icon={<IconGrid3x3 />} onClick={onToggleLayout} />
        ) : (
          <Button icon={<IconLayoutDistributeHorizontal />} onClick={onToggleLayout} />
        )}

        <div className="flex items-center gap-2">
          {/* Switches */}
          <div className="flex items-center gap-2">
            <span>Image in pdf</span>
            <Switch checked={imageInPdf} onChange={onImageInPdfChange} size="small" />
          </div>

          <div className="flex items-center gap-2">
            <span>Price</span>
            <Switch checked={price} onChange={onPriceChange} size="small" />
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type={activeTab === 'all' ? 'primary' : 'default'}
            onClick={() => onTabChange && onTabChange('all')}
            size="small"
          >
            All
          </Button>
          <Button
            type={activeTab === 'standard' ? 'primary' : 'default'}
            onClick={() => onTabChange && onTabChange('standard')}
            size="small"
          >
            Standard
          </Button>
          <Button
            type={activeTab === 'upgrade' ? 'primary' : 'default'}
            onClick={() => onTabChange && onTabChange('upgrade')}
            size="small"
          >
            Upgrade
          </Button>
        </div>

        {/* Dropdown */}
        {suppliers.length > 0 && (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button size="small">
              More suppliers <IconArrowDown />
            </Button>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default ColorFilter;
