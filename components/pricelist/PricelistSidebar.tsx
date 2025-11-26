import { IconSearch } from '@tabler/icons-react';
import { Button, Input } from 'antd';

export const PricelistSidebar = ({
  setSelectedCategory,
  selectedCategory,
  filters,
  setParams,
  categories,
}) => {
  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <Input
          value={filters.category}
          onChange={e => setParams({ category: e.target.value })}
          addonBefore={<IconSearch size={15} />}
          placeholder="Search Items"
        />
        <Button size="small" type="primary">
          Show All
        </Button>
      </div>
      <div className="border mt-2 h-full  bg-card-color">
        {categories.map((item, index) => (
          <div
            key={index}
            className={` ${selectedCategory === item.categoryId ? 'bg-primary text-white' : 'bg-card-color hover:bg-gray-100'} cursor-pointer border-b-2 p-4 `}
            onClick={() => {
              setSelectedCategory(item.categoryId);
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </>
  );
};
