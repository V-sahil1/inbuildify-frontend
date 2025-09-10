import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { CreateFormField } from "../common/Models/CreateFormModel";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { useEffect } from "react";
import { RootState } from "@redux/feature/store";
import { Status } from "@lib/constants/enum";
import { fetchPackageItems } from "@redux/feature/package/packageThunk";
import { Item } from "@redux/feature/masterPriceList/iMasterPriceListState";
import { setAddInstItemModal } from "@redux/feature/package/packageSlice";

export const packageFields = ( selectedValues?: { range?: string; dwelling?: string }): CreateFormField[] => {
  const itemStatus = useAppSelector(
    (state: RootState) => state.package.status.items
  );
  const {range , dwellingType} = useAppSelector((state) => state.types);
  const items = useAppSelector((state: RootState) => state.package.items);
  const dispatch = useAppDispatch();

  function mapToAntdOptions(items: Item[]) {
    return items?.map(item => ({
      label: item.description,   // what to display
      value: item.categoryItemId // what to capture
    }));
  }

  const filteredItems = items?.filter((item) => {
    return (
      item?.rangeId === selectedValues?.range && item?.dwellingTypeId === selectedValues?.dwelling
    )
  })
  const options = mapToAntdOptions(filteredItems)
  useEffect(() => {
    try {
      if (itemStatus === Status.IDLE) {
        dispatch(
          fetchPackageItems()
        ).unwrap();
      }
    } catch (error) {
    }
  }, []);

  const handleAddItem = () => {
    dispatch(setAddInstItemModal(true));
  }

  const rangeOptions = range?.map((range) => ({
    label: range?.name,
    value: range?.rangeId,
  }));
  const dwellingTypeOptions = dwellingType?.map((dwellingType) => ({
    label: dwellingType?.name,
    value: dwellingType?.dwellingTypeId,
  }));

  return [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Package Name",
      rules: [{ required: true, message: "Please enter the package name" }],
    },
    {
      label: "Range",
      name: "range",
      type: "select",
      options: rangeOptions,
      placeholder: "Select Range",
    },
    {
      label: "Dwelling Type",
      name: "dwelling",
      type: "select",
      options: dwellingTypeOptions,
      placeholder: "Select Dwelling Type",
    },
    {
      label: "Items",
      name: "categoryItemIds",
      type: "select",
      mode:"multiple",
      options: options,
      placeholder: "Select Items",
      rules: [{ required: true, message: "Please select a range" }],
      button:"Add Item",
      disabled: !selectedValues?.range || !selectedValues?.dwelling,
      onClick: handleAddItem,
    },
    {
      label: "Total Amount",
      name: "amount",
      type: "number",
      placeholder: "3200",
      rules: [{ required: true, message: "Please enter total price" }],
    },
  ];
};
