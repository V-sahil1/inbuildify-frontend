import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchFloorPlans } from '@redux/feature/floorPlan/floorPlanThunk';
import { useEffect, useRef } from 'react';
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
  onFilterChange?: (payload: {
    type: 'plan' | 'facade' | 'package' | 'range' | 'dwellingType' | 'location';
    value: string;
  }) => void;
}

const QuotationFilter: React.FC<QuotationFilterProps> = ({
  isReadOnly = false,
  onFilterChange,
}) => {
  const dispatch = useAppDispatch();
  const { rangeOptions, dwellingTypeOptions } = useDwellingAndRangeHook({
    type: ['range', 'dwellingType'],
  });
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });
  const { selectedFilters } = useAppSelector(state => state.quotation);
  const prevFiltersRef = useRef(selectedFilters);

  const newFilters = {
    dwelling_type_id: selectedFilters?.dwellingType || undefined,
    range_id: selectedFilters?.range || undefined,
  };

  useEffect(() => {
    const prevFilters = prevFiltersRef.current;

    // Check if relevant filters changed
    const rangeChanged = prevFilters?.range !== selectedFilters?.range;
    const dwellingTypeChanged = prevFilters?.dwellingType !== selectedFilters?.dwellingType;

    if (rangeChanged || dwellingTypeChanged) {
      handleFetchFloorPlan();
      handleFetchFacade();
      handleFetchPackage();
    }
    prevFiltersRef.current = selectedFilters;
  }, [selectedFilters]);

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
    <div className="flex items-center gap-6 justify-end text-font-color ml-4">
      {/* <div className="flex items-center gap-4">
        <span className="text-sm">Location</span>
        <Select
          className="w-32"
          placeholder="Select Location"
          size="small"
          allowClear
          value={selectedFilters?.location || undefined}
          notFoundContent={<NoDataMessage label="Location type" link={SystemRoutes.PRICELIST} />}
          onChange={value => {
            onFilterChange({ type: 'location', value });
          }}
          options={locationOptions}
          disabled={isReadOnly}
        />
      </div> */}
      <div className="flex items-center gap-4">
        <span className="text-sm">Range</span>
        <Select
          className="w-32"
          placeholder="Select Range"
          size="small"
          allowClear
          value={selectedFilters?.range || undefined}
          notFoundContent={<NoDataMessage label="Range type" link={SystemRoutes.SALES_RANGE} />}
          onChange={value => {
            console.log("🔥 ~ :104 ~ QuotationFilter ~ value:", value)
            onFilterChange({ type: 'range', value });
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
            <NoDataMessage label="dwelling type" link={SystemRoutes.SALES_DWELLING_TYPE} />
          }
          onChange={value => {
            onFilterChange({ type: 'dwellingType', value });
          }}
          options={dwellingTypeOptions}
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
};

export default QuotationFilter;
