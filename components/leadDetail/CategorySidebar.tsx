import React from 'react';
import { Menu } from 'antd';
import { Category } from '@redux/feature/masterPriceList/iMasterPriceListState';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  // useEffect(() => {
  //   if (categories.length > 0 && !selectedCategory) {
  //     onCategorySelect(categories[0].categoryId);
  //   }
  // }, [categories, selectedCategory, onCategorySelect]);

  const menuItems = categories.map(category => ({
    key: category.categoryId,
    label: category.name,
  }));

  return (
    <div className="h-full">
      <Menu
        mode="vertical"
        selectedKeys={[selectedCategory]}
        onSelect={({ key }) => onCategorySelect(key)}
        className="border-0 h-full"
        items={menuItems}
      />
    </div>
  );
};

export default CategorySidebar;