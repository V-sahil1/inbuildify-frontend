import DwellingTypeSelect from '@/components/common/custom-selects/DwellingTypeSelect';
import RangeSelect from '@/components/common/custom-selects/RangeSelect';
import { CustomFilterButtons } from '@/components/common/CustomFilterButtons';
import { MasterFacadeCollection } from '@/components/masterCollection/MasterFacadeCollection';
import { MasterFloorPlanCollection } from '@/components/masterCollection/MasterFloorplanCollection';
import { MasterPricelistCollection } from '@/components/masterCollection/MasterPricelistCollection';
import { debouncedURL } from '@lib/utils/debounceURL';
import { IconFileTypePdf, IconSearch } from '@tabler/icons-react';
import { Button, Dropdown, Input } from 'antd';
import { useEffect, useState } from 'react';
const MasterCollection = () => {
  const [activeTab, setActiveTab] = useState('Price List');

  const { debouncedUpdateURL, setParams, filters, resetParams, instantFilters } = debouncedURL({
    filtersKey: [
      'name',
      'description',
      'uom',
      'cost',
      'costType',
      'costOption',
      'range',
      'dwellingType',
      'search',
    ],
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  const pricelistMenu = [
    {
      key: 'homeInclusion',
      label: 'My Home Incluions',
      icon: <IconFileTypePdf size={15} color="red" />,
    },
    { key: 'T&C', label: 'Terms And Conditions', icon: <IconFileTypePdf size={15} color="red" /> },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{activeTab} Collections </h1>
        <div className="flex gap-2 items-center">
          <span>
            Range :
            <RangeSelect value={instantFilters?.range} onChange={value => setParams({ range: value })} />
          </span>
          <span>
            Dwelling Type :
            <DwellingTypeSelect
              value={instantFilters?.dwellingType}
              onChange={value => setParams({ dwellingType: value })}
            />
          </span>
        </div>
        <CustomFilterButtons
          filterButtons={['Price List', 'Facade', 'Floor Plan']}
          activeTab={activeTab}
          setActiveTab={value => {
            resetParams();
            setActiveTab(value);
          }}
        />
        {activeTab === 'Price List' ? (
          <Dropdown menu={{ items: pricelistMenu }} trigger={['click']}>
            <Button type="primary">Master Collections</Button>
          </Dropdown>
        ) : (
          <Input
            addonBefore={<IconSearch size={15} />}
            className="max-w-[200px]"
            placeholder={`search ${activeTab}`}
            value={instantFilters?.search}
            onChange={e => setParams({ search: e.target.value })}
          />
        )}
      </div>
      {activeTab === 'Price List' ? (
        <MasterPricelistCollection filters={filters} instantFilters={instantFilters} setParams={setParams} />
      ) : activeTab === 'Facade' ? (
        <MasterFacadeCollection filters={filters} />
      ) : (
        <MasterFloorPlanCollection filters={filters} />
      )}
    </div>
  );
};

export default MasterCollection;
