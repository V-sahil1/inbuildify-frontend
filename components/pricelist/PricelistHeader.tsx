import { Badge, Button, Dropdown, Input, Select, Tooltip } from 'antd';
import DwellingTypeSelect from '../common/custom-selects/DwellingTypeSelect';
import RangeSelect from '../common/custom-selects/RangeSelect';
import {
  IconDownload,
  IconFileSpreadsheet,
  IconFilter,
  IconPlus,
  IconSearch,
  IconUpload,
} from '@tabler/icons-react';
import { PricelistMaster } from '@lib/utils/Reports/pricelist/PricelistMaster';
import { PriceMasterCorrection } from '@lib/utils/Reports/pricelist/PriceMasterCorrection';
import LocationSelect from '../common/custom-selects/LocationSelect';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
import { useState } from 'react';

export const PricelistHeader = ({
  filters,
  setParams,
  setDrawerOpen,
  setModalOpen,
  fetchCategoriesData,
}) => {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const { rangeOptions, dwellingTypeOptions } = useDwellingAndRangeHook({
    type: ['range', 'dwellingType'],
  });
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });

  const exportMenu = [
    {
      key: 'pricemaster',
      label: 'Export Full List',
      icon: <IconFileSpreadsheet size={15} color="red" />,
    },
    {
      key: 'pricemastercorrection',
      label: 'Export For Corrections',
      icon: <IconFileSpreadsheet size={15} color="red" />,
    },
  ];

  const handleExport = key => {
    key === 'pricemaster' ? PricelistMaster() : PriceMasterCorrection();
  };

  const pricelistFilterMenu = () => (
    <div className="min-w-[300px] p-4 bg-white rounded-lg shadow-lg border">
      <h3 className="text-sm mb-4 font-semibold text-gray-700">Filter Pricelist</h3>
      {/* Location Filter */}
      {locationOptions?.length > 0 && (
        <div className="mb-4 grid grid-cols-6 gap-2 items-center">
          <p className="col-span-2 text-sm font-medium">Location</p>
          <Select
            value={filters?.location}
            onChange={value => setParams({ location: value })}
            placeholder="Select status"
            className="w-full col-span-4"
            options={locationOptions}
            allowClear
          />
        </div>
      )}
      {/* Range Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2 items-center">
        <p className="col-span-2 text-sm font-medium">Label</p>
        <Select
          value={filters?.range}
          onChange={value => setParams({ range: value })}
          placeholder="Select status"
          className="w-full col-span-4"
          options={rangeOptions}
          allowClear
        />
      </div>
      {/* Dwelling Type Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2 items-center">
        <p className="col-span-2 text-sm font-medium">Dwelling Type</p>
        <Select
          value={filters?.dwellingType}
          onChange={value => setParams({ dwellingType: value })}
          placeholder="Select status"
          className="w-full col-span-4"
          options={dwellingTypeOptions}
          allowClear
        />
      </div>

      {/* Status Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2 items-center">
        <p className="col-span-2 text-sm font-medium">Status</p>
        <Select
          value={filters?.status !== '' ? filters?.status : undefined}
          onChange={value => setParams({ status: value })}
          placeholder="Select status"
          className="w-full col-span-4"
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ]}
          allowClear
        />
      </div>

      {/* Filter Actions */}
      <div className="flex gap-2 pt-2 justify-end">
        <Button
          size="small"
          onClick={() => {
            setFilterDropdownOpen(false);
            setParams({ status: '', range: '', dwellingType: '', location: '' });
            fetchCategoriesData(false);
          }}
        >
          Clear All
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setFilterDropdownOpen(false);
            fetchCategoriesData();
          }}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
  return (
    <div className="flex items-center gap-2">
      <Input
        prefix={<IconSearch size={15} className="text-gray-400" />}
        placeholder="Search..."
        value={filters?.search}
        onChange={e => setParams({ search: e.target.value })}
      />
      <Button
        type="primary"
        onClick={() => {
          setDrawerOpen('location');
        }}
      >
        Location
      </Button>
      <Button
        type="primary"
        onClick={() => {
          setDrawerOpen('master');
        }}
      >
        <IconPlus size={15} />
        Master
      </Button>
      <Button type="primary" onClick={() => setModalOpen('ItemCreate')}>
        <IconPlus size={15} />
        Item
      </Button>
      <Dropdown
        open={filterDropdownOpen}
        onOpenChange={setFilterDropdownOpen}
        trigger={['click']}
        dropdownRender={pricelistFilterMenu}
      >
        <Tooltip title="Filter">
          <Badge dot={!!(filters.status || filters.label || filters.dwellingType || filters.group)}>
            <IconFilter className="text-primary" />
          </Badge>
        </Tooltip>
      </Dropdown>
      <Button
        type="primary"
        icon={<IconUpload size={15} />}
        onClick={() => setModalOpen('import')}
      />
      <Dropdown menu={{ items: exportMenu, onClick: e => handleExport(e.key) }} trigger={['click']}>
        <Button type="primary" icon={<IconDownload size={15} />} />
      </Dropdown>
    </div>
  );
};
