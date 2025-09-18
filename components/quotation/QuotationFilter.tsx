import { useAppDispatch, useAppSelector } from "@hooks/redux";
// import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { fetchFloorPlans } from "@redux/feature/floorPlan/floorPlanThunk";
import { setSelectedFilters } from "@redux/feature/floorPlan/floorPlanSlice";
import { useEffect, useCallback, useRef } from "react";
import { setSelectedFilters as setFacadeFilters } from "@redux/feature/facade/facadeSlice";
import { getFacades } from "@redux/feature/facade/facadeThunk";
import { fetchPackages } from "@redux/feature/package/packageThunk";
import { setSelectedFilters as setPackageFilters } from "@redux/feature/package/packageSlice";
import { resetAllCategoriesIsExpanded, setSelectedFilters as setMplFilters } from "@redux/feature/masterPriceList/masterPriceListSlice";
import { clearSelectedFloorplanFacadePackageReducer, setSelectedFilters as setQuotationFilters } from "@redux/feature/quotation/quotationSlice";
import { message, Select } from "antd";
import { mapToOptions } from "@lib/utils/rangeAndDwellingObjToOptions";
import { Status } from "@lib/constants/enum";
import { getDwellingTypes, getRanges } from "@redux/feature/types/typesThunk";
import NoDataMessage from "../common/NoDataMessage";
import SystemRoutes from "@lib/constants/Routes";

interface QuotationFilterProps {
  isReadOnly?: boolean;
  onFilterChange?: () => void;
}

const QuotationFilter: React.FC<QuotationFilterProps> = ({ isReadOnly = false, onFilterChange }) => {
  const dispatch = useAppDispatch();
  const { range, dwellingType, status } = useAppSelector(
    (state) => state.types
  );
  const rangeOptions = mapToOptions(range);
  const dwellingOptions = mapToOptions(dwellingType);
  const { selectedFilters: selectedQuotationFilters } = useAppSelector(
    (state) => state.quotation
  );
  const { selectedFilters: selectedPackageFilters } = useAppSelector((state) => state.package);
  const initialLoad = useRef(true);

  useEffect(() => {
    const fetchTypesData = async () => {
      try {
      if (status?.range === Status.IDLE) {
        await dispatch(getRanges()).unwrap();
      }
      if (status?.dwellingType === Status.IDLE) {
        await dispatch(getDwellingTypes()).unwrap();
      }
    } catch (error) {
      message.error(error);
    }
  };
  fetchTypesData();
  }, [dispatch]);

  useEffect(() => {
    if (initialLoad.current && selectedQuotationFilters) {
      initialLoad.current = false;

      if (selectedQuotationFilters.dwelling_type) {
        handleFloorPlanDwellingTypeChange(
          selectedQuotationFilters.dwelling_type
        );
        handleFacadeDwellingTypeChange(selectedQuotationFilters.dwelling_type);
      }

      if (selectedQuotationFilters.range) {
        handleRangeChange(selectedQuotationFilters.range);
      }
      handlePackage();
    }
  }, [selectedQuotationFilters]);

  const handleRangeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = { ...selectedQuotationFilters, range: value || "" };
      dispatch(setSelectedFilters(newFilters));
      dispatch(setMplFilters({ range: value || "" }));
      dispatch(setQuotationFilters(newFilters));

      if (newFilters.range || newFilters.dwelling_type) {
        dispatch(fetchFloorPlans(newFilters));
      } else {
        dispatch(fetchFloorPlans(undefined));
      }
    },
    [dispatch, selectedQuotationFilters]
  );

  const handleDwellingTypeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = {
        ...selectedQuotationFilters,
        dwelling_type: value || "",
      };
      dispatch(setSelectedFilters(newFilters));
      dispatch(
        setMplFilters({
          ...selectedQuotationFilters,
          dwelling_type: value || "",
        })
      );
      dispatch(setQuotationFilters(newFilters));

      if (newFilters.range || newFilters.dwelling_type) {
        dispatch(fetchFloorPlans(newFilters));
      } else {
        // If no filters are selected, fetch all floor plans
        dispatch(fetchFloorPlans(undefined));
      }
    },
    [dispatch, selectedQuotationFilters]
  );

  const handleFloorPlanDwellingTypeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = {
        ...selectedQuotationFilters,
        dwelling_type: value || "",
      };
      dispatch(setSelectedFilters(newFilters));
      dispatch(setMplFilters({ dwelling_type: value || "" }));
      dispatch(setQuotationFilters(newFilters));

      // Only make API call if at least one filter is selected
      if (newFilters.range || newFilters.dwelling_type) {
        dispatch(fetchFloorPlans(newFilters));
      } else {
        // If no filters are selected, fetch all floor plans
        dispatch(fetchFloorPlans(undefined));
      }
    },
    [dispatch, selectedQuotationFilters]
  );

  const handleFacadeDwellingTypeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = { dwelling_type: value || "" };
      dispatch(setFacadeFilters(newFilters));

      // Only make API call if dwelling_type filter is selected
      if (newFilters.dwelling_type) {
        dispatch(getFacades(newFilters));
      } else {
        // If no filters are selected, fetch all facades
        dispatch(getFacades(undefined));
      }
    },
    [dispatch]
  );

  const handlePackageDwellingTypeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = {
        ...selectedPackageFilters,
        dwelling_type: value || "",
      };
      dispatch(setPackageFilters(newFilters));

      if (newFilters.range || newFilters.dwelling_type) {
        dispatch(fetchPackages(newFilters));
      } else {
        dispatch(fetchPackages(undefined));
      }
    },
    [dispatch, selectedPackageFilters]
  );

  const handlePackageRangeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = {
        ...selectedPackageFilters,
        range: value || "",
      };
      dispatch(setPackageFilters(newFilters));

      if (newFilters.range || newFilters.dwelling_type) {
        dispatch(fetchPackages(newFilters));
      } else {
        dispatch(fetchPackages(undefined));
      }
    },
    [dispatch, selectedPackageFilters]
  );

  const handlePackage = useCallback(async () => {
    await dispatch(fetchPackages(undefined));
  }, [dispatch]);

  const clearSelectedFloorplanFacadePackage = () => {
    dispatch(clearSelectedFloorplanFacadePackageReducer())
  };

  return (
    <div className="flex items-center gap-6 justify-end text-font-color w-[1000px]">
      <div className="flex items-center gap-4">
        <span className="text-sm">Range</span>
        <Select
          className="w-32"
          placeholder="Select Range"
          size="small"
          allowClear
          value={selectedQuotationFilters?.range || undefined}
          notFoundContent={
            <NoDataMessage
              label="Range type"
              link={SystemRoutes.DWELLING_AND_RANGE}
            />
          }
          onChange={(value) => {
            clearSelectedFloorplanFacadePackage()
            handleRangeChange(value)
            handlePackageRangeChange(value)
            dispatch(resetAllCategoriesIsExpanded())
            onFilterChange?.() 
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
          value={selectedQuotationFilters?.dwelling_type || undefined}
          notFoundContent={
            <NoDataMessage
              label="dwelling type"
              link={SystemRoutes.DWELLING_AND_RANGE}
            />
          }
          onChange={(value) => {
              clearSelectedFloorplanFacadePackage()
              handleDwellingTypeChange(value),
              handleFloorPlanDwellingTypeChange(value),
              handleFacadeDwellingTypeChange(value);
              handlePackageDwellingTypeChange(value)
              dispatch(resetAllCategoriesIsExpanded())
              onFilterChange?.() 
          }}
          options={dwellingOptions}
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
};

export default QuotationFilter;
