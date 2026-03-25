import React, { useEffect, useState } from 'react';
import { Input, Menu } from 'antd';
import { IPriceList } from '@redux/feature/masterPriceList/iMasterPriceListState';
import { IconSearch } from '@tabler/icons-react';

interface CategorySidebarProps {
  categories: IPriceList[];

  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  setSelect?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  setSelect,
}) => {
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      onCategorySelect(categories[0].priceListId);
    }
  }, [categories]);

  const filteredPriceMaster = categories.filter(category =>
    category.name.toLowerCase().includes(search?.toLowerCase() || '')
  );

  const menuItems = filteredPriceMaster.map(category => ({
    key: category.priceListId,
    label: category.name,
  }));

  return (
    <div className="h-full flex flex-col">
      <Input
        placeholder="Search Price List..."
        prefix={<IconSearch size={15} className="text-gray-400" />}
        className="w-full rounded-none rounded-tl-lg border-t-0 border-r-2  border-l-0 h-[50px] !border-[#e6e7eb] hover:!border-[#e6e7eb] focus-within:!border-[#e6e7eb] active:!border-[#e6e7eb] !shadow-none hover:!shadow-none focus-within:!shadow-none"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Menu
        mode="vertical"
        selectedKeys={[selectedCategory]}
        onSelect={({ key }) => {
          onCategorySelect(key);
          setSelect(false);
        }}
        className="border-0 rounded-bl-lg flex-1"
        items={menuItems}
      />
    </div>
  );
};

export default CategorySidebar;
