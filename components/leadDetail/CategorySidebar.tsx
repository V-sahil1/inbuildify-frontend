import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { IPriceList } from '@redux/feature/masterPriceList/iMasterPriceListState';

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
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      onCategorySelect(categories[0].priceListId);
    }
  }, [categories, selectedCategory, onCategorySelect]);

  const menuItems = categories.map(category => ({
    key: category.priceListId,
    label: category.name,
  }));

  return (
    <div className="h-full">
      <Menu
        mode="vertical"
        selectedKeys={[selectedCategory]}
        onSelect={({ key }) => {
          onCategorySelect(key);
          setSelect(false);
        }}
        className="border-0 h-full"
        items={menuItems}
      />
    </div>
  );
};

export default CategorySidebar;
