import { Button, message, Select } from 'antd';
import {
  createPackage,
  fetchPackageGroup,
  updatePackage,
} from '@redux/feature/package/packageThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { useEffect } from 'react';
import { Status } from '@lib/constants/enum';

export const PackageColumn = ({
  setDrawerOpen,
  setSelectedPackage,
  selectedPackage,
  setFilterDropdownOpen,
  fetchPackageData,
}) => {
  const dispatch = useAppDispatch();
  const { status, group } = useAppSelector(state => state.package);

  const { rangeOptions, dwellingTypeOptions } = useDwellingAndRangeHook({
    type: ['range', 'dwellingType'],
  });

  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: [
      'label',
      'dwellingType',
      'status',
      'group',
      'search',
      'name',
      'cost',
      'builderCost',
    ],
    initialValue: { status: 'true' },
    shouldSyncURL: false,
  });

  async function fetchGroup() {
    try {
      await dispatch(fetchPackageGroup()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch package group');
    }
  }
  useEffect(() => {
    if (status.group === Status.IDLE) {
      fetchGroup();
    }
  }, [status.group]);

  const sortMenu = [
    {
      label: (
        <div className="flex justify-between gap-2 items-center w-full">
          <span>Name</span>
          {filters?.name ? (
            filters?.name === 'asc' ? (
              <IconSortAscending size={16} />
            ) : (
              <IconSortDescending size={16} />
            )
          ) : null}
        </div>
      ),
      key: 'name',
      onClick: () =>
        setParams({
          name: filters?.name === 'asc' ? 'desc' : 'asc',
        }),
    },
    {
      label: (
        <div className="flex justify-between gap-2 items-center w-full">
          <span>Price</span>
          {filters?.cost ? (
            filters?.cost === 'asc' ? (
              <IconSortAscending size={16} />
            ) : (
              <IconSortDescending size={16} />
            )
          ) : null}
        </div>
      ),
      key: 'price',
      onClick: () =>
        setParams({
          cost: filters?.cost === 'asc' ? 'desc' : 'asc',
        }),
    },
    {
      label: (
        <div className="flex justify-between gap-2 items-center w-full">
          <span>Builder Price</span>
          {filters?.builderCost ? (
            filters?.builderCost === 'asc' ? (
              <IconSortAscending size={16} />
            ) : (
              <IconSortDescending size={16} />
            )
          ) : null}
        </div>
      ),
      key: 'builderPrice',
      onClick: () =>
        setParams({
          builderCost: filters?.builderCost === 'asc' ? 'desc' : 'asc',
        }),
    },
  ];
  const packageFilterMenu = () => (
    <div className="min-w-[300px] p-4 bg-white rounded-lg shadow-lg border">
      <h3 className="text-sm mb-4 font-semibold text-gray-700">Filter Package</h3>
      {/* Group Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2 items-center">
        <p className="col-span-2 text-sm font-medium">Group</p>
        <Select
          value={instantFilters?.group}
          onChange={value => setParams({ group: value })}
          placeholder="Select status"
          className="w-full col-span-4"
          options={group?.map(i => ({ label: i.name, value: i.packageGroupId }))}
        />
      </div>
      {/* Range Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2 items-center">
        <p className="col-span-2 text-sm font-medium">Label</p>
        <Select
          value={instantFilters?.label}
          onChange={value => setParams({ label: value })}
          placeholder="Select status"
          className="w-full col-span-4"
          options={rangeOptions}
        />
      </div>
      {/* Dwelling Type Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2 items-center">
        <p className="col-span-2 text-sm font-medium">Dwelling Type</p>
        <Select
          value={instantFilters?.dwellingType}
          onChange={value => setParams({ dwellingType: value })}
          placeholder="Select status"
          className="w-full col-span-4"
          options={dwellingTypeOptions}
        />
      </div>

      {/* Status Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2 items-center">
        <p className="col-span-2 text-sm font-medium">Status</p>
        <Select
          value={instantFilters?.status !== '' ? instantFilters?.status === 'true' : undefined}
          onChange={value => setParams({ status: value.toString() })}
          placeholder="Select status"
          className="w-full col-span-4"
          options={[
            { label: 'Active', value: true },
            { label: 'Inactive', value: false },
          ]}
        />
      </div>

      {/* Filter Actions */}
      <div className="flex gap-2 pt-2 justify-end">
        <Button
          size="small"
          onClick={() => {
            setFilterDropdownOpen(false);
            setParams({ status: '', label: '', dwellingType: '', group: '' });
            fetchPackageData(1, 10, false);
          }}
        >
          Clear All
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setFilterDropdownOpen(false);
            fetchPackageData();
          }}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  const handlePackageStatus = async () => {
    try {
      await dispatch(
        updatePackage({ id: selectedPackage.packageId, data: { status: !selectedPackage.status } })
      ).unwrap();
      message.success('Package status updated successfully');
      setSelectedPackage(null);
      setDrawerOpen(null);
    } catch (error) {
      message.error(error || 'Failed to update package status');
    }
  };

  const handlePackageSubmit = async values => {
    try {
      if (selectedPackage) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, selectedPackage);
        if (!isUpdated) {
          setSelectedPackage(null);
          setDrawerOpen(null);
          return;
        }
        await dispatch(
          updatePackage({ id: selectedPackage.packageId, data: updatedFields })
        ).unwrap();
        message.success('Package updated successfully');
      } else {
        await dispatch(createPackage(values)).unwrap();
        message.success('Package created successfully');
      }
      setSelectedPackage(null);
      setDrawerOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save package');
    }
  };
  return {
    handlePackageSubmit,
    handlePackageStatus,
    setParams,
    instantFilters,
    filters,
    debouncedUpdateURL,
    sortMenu,
    packageFilterMenu,
  };
};
