import React from 'react';
import { Menu } from 'antd';
import { Category } from '@/pages/leads/data/types';

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
  const menuItems = categories.map(category => ({
    key: category.categoryId,
    label: category.name,
  }));

  return (
    <div className="bg-white border-r border-gray-200 h-full">
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