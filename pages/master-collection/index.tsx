import { CustomFilterButtons } from '@/components/common/CustomFilterButtons';
import { MasterFacadeCollection } from '@/components/masterCollection/MasterFacadeCollection';
import { MasterFloorPlanCollection } from '@/components/masterCollection/MasterFloorplanCollection';
import { MasterPricelistCollection } from '@/components/masterCollection/MasterPricelistCollection';
import { useAppDispatch } from '@hooks/redux';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
import { debouncedURL } from '@lib/utils/debounceURL';
import { getFacades } from '@redux/feature/facade/facadeThunk';
import { GetFacadesParams } from '@redux/feature/facade/IFacadeState';
import { fetchFloorPlans } from '@redux/feature/floorPlan/floorPlanThunk';
import { FloorPlanGetParams } from '@redux/feature/floorPlan/IFloorPlanState';
import { PricelistFetchParams } from '@redux/feature/masterPriceList/iMasterPriceListState';
import { fetchPricelistMaster } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { IconDownload, IconFileTypePdf, IconFilter, IconSearch } from '@tabler/icons-react';
import { Badge, Button, Dropdown, Input, message, Select, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
const MasterCollection = () => {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState('Price List');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const { rangeOptions, dwellingTypeOptions } = useDwellingAndRangeHook({
    type: ['range', 'dwellingType'],
  });
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });

  const { debouncedUpdateURL, setParams, filters, resetParams, instantFilters } = debouncedURL({
    filtersKey: ['location', 'range', 'dwellingType', 'search', 'status'],
    initialValue: { status: 'active', search: '' },
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  useEffect(() => {
    resetParams();
  }, [activeTab]);

  useEffect(() => {
    activeTab === 'Price List'
      ? fetchPricelistMasterData()
      : activeTab === 'Facade'
        ? fetchFacadeData()
        : fetchFloorPlansData();
  }, [filters?.search, activeTab]);

  const fetchPricelistMasterData = async (isParam: Boolean = true) => {
    try {
      const params: PricelistFetchParams = {
        search: filters?.search || undefined,
      };
      if (isParam) {
        ((params.is_active = filters?.status !== '' ? filters?.status === 'active' : undefined),
          (params.location_id = filters?.location || undefined));
      }
      await dispatch(fetchPricelistMaster(params)).unwrap();
    } catch (error) {
      message.error(error);
    }
  };

  const fetchFacadeData = async (isParam: Boolean = true) => {
    try {
      const params: GetFacadesParams = {
        search: filters?.search || undefined,
      };
      if (isParam) {
        ((params.status = filters?.status !== '' ? filters?.status === 'active' : undefined),
          (params.range_id = filters?.range || undefined),
          (params.dwelling_type_id = filters?.dwellingType || undefined));
      }
      await dispatch(getFacades(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Facades');
    }
  };

  const fetchFloorPlansData = async (isParam: Boolean = true) => {
    try {
      const params: FloorPlanGetParams = {
        name: filters?.search || undefined,
      };
      if (isParam) {
        ((params.status = filters?.status !== '' ? filters?.status === 'active' : undefined),
          (params.range_id = filters?.range || undefined),
          (params.dwelling_type_id = filters?.dwellingType || undefined));
      }
      await dispatch(fetchFloorPlans(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Floor Plans');
    }
  };

  const pricelistMenu = [
    {
      key: 'homeInclusion',
      label: 'My Home Incluions',
      icon: <IconFileTypePdf size={15} color="red" />,
    },
    { key: 'T&C', label: 'Terms And Conditions', icon: <IconFileTypePdf size={15} color="red" /> },
  ];

  const filterMenu = () => (
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
            activeTab === 'Price List'
              ? fetchPricelistMasterData(false)
              : activeTab === 'Facade'
                ? fetchFacadeData(false)
                : fetchFloorPlansData(false);
          }}
        >
          Clear All
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setFilterDropdownOpen(false);
            activeTab === 'Price List'
              ? fetchPricelistMasterData()
              : activeTab === 'Facade'
                ? fetchFacadeData()
                : fetchFloorPlansData();
          }}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{activeTab} Collections </h1>
        <CustomFilterButtons
          filterButtons={['Price List', 'Facade', 'Floor Plan']}
          activeTab={activeTab}
          setActiveTab={value => {
            resetParams();
            setActiveTab(value);
          }}
        />

        <div className="flex gap-2 items-center">
          <Input
            addonBefore={<IconSearch size={15} />}
            className="max-w-[200px]"
            placeholder={`search ${activeTab}`}
            value={instantFilters?.search}
            onChange={e => setParams({ search: e.target.value })}
          />
          <Dropdown
            open={filterDropdownOpen}
            onOpenChange={setFilterDropdownOpen}
            trigger={['click']}
            dropdownRender={filterMenu}
          >
            <Tooltip title="Filter">
              <Badge
                dot={!!(filters.status || filters.label || filters.dwellingType || filters.group)}
              >
                <IconFilter className="text-primary" />
              </Badge>
            </Tooltip>
          </Dropdown>
          {activeTab === 'Price List' && (
            <Dropdown menu={{ items: pricelistMenu }} trigger={['click']}>
              <IconDownload className="text-primary" />
            </Dropdown>
          )}
        </div>
      </div>
      {activeTab === 'Price List' ? (
        <MasterPricelistCollection filters={filters} />
      ) : activeTab === 'Facade' ? (
        <MasterFacadeCollection filters={filters} />
      ) : (
        <MasterFloorPlanCollection filters={filters} />
      )}
    </div>
  );
};

export default MasterCollection;
