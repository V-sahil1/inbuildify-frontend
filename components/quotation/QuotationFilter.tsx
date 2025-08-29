import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import {
  getFloorPlanFilters,
  fetchFloorPlans,
} from "@redux/feature/floorPlan/floorPlanThunk";
import { setSelectedFilters } from "@redux/feature/floorPlan/floorPlanSlice";
import React, { useEffect, useCallback } from "react";
import { setSelectedFilters as setFacadeFilters } from "@redux/feature/facade/facadeSlice";
import { getFacades } from "@redux/feature/facade/facadeThunk";
import { fetchPackages } from "@redux/feature/package/packageThunk";
import { setSelectedFilters as setPackageFilters } from "@redux/feature/package/packageSlice";
import { setSelectedFilters as setMplFilters } from "@redux/feature/masterPriceList/masterPriceListSlice";
import { Select } from "antd";

const QuotationFilter = () => {
  const dispatch = useAppDispatch();
  const { filters, selectedFilters } = useAppSelector(
    (state) => state.floorPlan
  );
  const { selectedFilters: packageFilters } = useAppSelector(
    (state) => state.package
  );
  const rangeOptions = enumArrayToOptions(filters?.ranges);
  const dwellingOptions = enumArrayToOptions(filters?.dwellingTypes);

  useEffect(() => {
    if (!filters) {
      dispatch(getFloorPlanFilters())
        .unwrap()
        .then(() => {});
    }
  }, [dispatch]);

  const handleRangeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = { ...selectedFilters, range: value || "" };
      dispatch(setSelectedFilters(newFilters));
      dispatch(setMplFilters({ range: value || "" }));

      // Only make API call if at least one filter is selected
      if (newFilters.range || newFilters.dwelling_type) {
        dispatch(fetchFloorPlans(newFilters));
      } else {
        // If no filters are selected, fetch all floor plans
        dispatch(fetchFloorPlans(undefined));
      }
    },
    [dispatch, selectedFilters]
  );

  const handleFloorPlanDwellingTypeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = { ...selectedFilters, dwelling_type: value || "" };
      dispatch(setSelectedFilters(newFilters));
      dispatch(setMplFilters({ dwelling_type: value || "" }));

      // Only make API call if at least one filter is selected
      if (newFilters.range || newFilters.dwelling_type) {
        dispatch(fetchFloorPlans(newFilters));
      } else {
        // If no filters are selected, fetch all floor plans
        dispatch(fetchFloorPlans(undefined));
      }
    },
    [dispatch, selectedFilters]
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

  const handlePackageRangeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = { ...packageFilters, range: value || "" };
      dispatch(setPackageFilters(newFilters));

      // Only make API call if at least one filter is selected
      if (newFilters.range || newFilters.dwelling_type) {
        dispatch(fetchPackages(newFilters));
      } else {
        // If no filters are selected, fetch all packages
        dispatch(fetchPackages(undefined));
      }
    },
    [dispatch, packageFilters]
  );

  const handlePackageDwellingTypeChange = useCallback(
    (value: string | undefined) => {
      const newFilters = { ...packageFilters, dwelling_type: value || "" };
      dispatch(setPackageFilters(newFilters));

      // Only make API call if at least one filter is selected
      if (newFilters.range || newFilters.dwelling_type) {
        dispatch(fetchPackages(newFilters));
      } else {
        // If no filters are selected, fetch all packages
        dispatch(fetchPackages(undefined));
      }
    },
    [dispatch, packageFilters]
  );

  return (
    <div className="flex items-center gap-6 justify-end text-font-color w-[1000px]">
      <div className="flex items-center gap-4"> 
        <span className="text-sm">Range</span>
        <Select
          className="w-32"
          placeholder="Select Range"
          size="small"
          allowClear
          value={selectedFilters?.range || undefined}
          onChange={(value) => {
            handleRangeChange(value), handlePackageRangeChange(value);
          }}
          options={rangeOptions}
        />
      </div>

      
      <div className="flex items-center gap-4">
        <span className="text-sm">Dwelling Type</span> 
        <Select
          className="w-36"
          placeholder="Select Dwelling Type"
          size="small"
          allowClear
          value={selectedFilters?.dwelling_type || undefined}
          onChange={(value) => {
            handleFloorPlanDwellingTypeChange(value),
              handleFacadeDwellingTypeChange(value),
              handlePackageDwellingTypeChange(value);
          }}
          options={dwellingOptions}
        />
      </div>
    </div>
  );
};

export default QuotationFilter;