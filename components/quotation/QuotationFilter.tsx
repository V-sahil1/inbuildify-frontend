import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchFloorPlans } from '@redux/feature/floorPlan/floorPlanThunk';
import { useEffect } from 'react';
import { getFacades } from '@redux/feature/facade/facadeThunk';
import { fetchPackages } from '@redux/feature/package/packageThunk';
import { message, Select } from 'antd';
import NoDataMessage from '../common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { setSelectedFilters } from '@redux/feature/quotation/quotationSlice';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
interface QuotationFilterProps {
  isReadOnly?: boolean;
  onFilterChange?: () => void;
  setParams?: (value: Record<string, string>) => void;
  filters?: Record<string, string>;
  instantFilters?: Record<string, string>;
}

const QuotationFilter: React.FC<QuotationFilterProps> = ({
  isReadOnly = false,
  onFilterChange,
  setParams,
  filters,
  instantFilters,
}) => {
  const dispatch = useAppDispatch();
  const { rangeOptions, dwellingTypeOptions } = useDwellingAndRangeHook({
    type: ['range', 'dwellingType'],
  });
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });
  const { selectedFilters } = useAppSelector(state => state.quotation);

  const newFilters = {
    dwelling_type_id: filters?.dwellingType || undefined,
    range_id: filters?.range || undefined,
  };

  useEffect(() => {
    handleFetchFloorPlan();
    handleFetchFacade();
    handleFetchPackage();
  }, [filters]);

  const handleFetchFloorPlan = async () => {
    try {
      await dispatch(fetchFloorPlans(newFilters)).unwrap();
    } catch (error) {
      message.error('Failed to fetch package data');
    }
  };

  const handleFetchFacade = async () => {
    try {
      await dispatch(getFacades(newFilters)).unwrap();
    } catch (error) {
      message.error('Failed to fetch package data');
    }
  };

  const handleFetchPackage = async () => {
    try {
      await dispatch(fetchPackages(newFilters)).unwrap();
    } catch (error) {
      message.error('Failed to fetch package data');
    }
  };

  return (
    <div className="flex items-center gap-6 justify-end text-font-color w-[1000px]">
      <div className="flex items-center gap-4">
        <span className="text-sm">Location</span>
        <Select
          className="w-32"
          placeholder="Select Location"
          size="small"
          allowClear
          value={selectedFilters?.location || undefined}
          notFoundContent={<NoDataMessage label="Location type" link={SystemRoutes.PRICELIST} />}
          onChange={value => {
            dispatch(setSelectedFilters({ ...instantFilters, location: value }));
            setParams({ location: value });
            onFilterChange();
          }}
          options={locationOptions}
          disabled={isReadOnly}
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Range</span>
        <Select
          className="w-32"
          placeholder="Select Range"
          size="small"
          allowClear
          value={selectedFilters?.range || undefined}
          notFoundContent={
            <NoDataMessage label="Range type" link={SystemRoutes.DWELLING_AND_RANGE} />
          }
          onChange={value => {
            dispatch(setSelectedFilters({ ...instantFilters, range: value }));
            setParams({ range: value });
            onFilterChange();
          }}
          options={rangeOptions}
          disabled={isReadOnly}
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">Dwelling Type</span>
        <Select
          className="w-36"
          placeholder="Select Dwelling Type"
          size="small"
          allowClear
          value={selectedFilters?.dwellingType || undefined}
          notFoundContent={
            <NoDataMessage label="dwelling type" link={SystemRoutes.DWELLING_AND_RANGE} />
          }
          onChange={value => {
            dispatch(setSelectedFilters({ ...instantFilters, dwellingType: value }));
            setParams({ dwellingType: value });
            onFilterChange();
          }}
          options={dwellingTypeOptions}
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
};

export default QuotationFilter;
