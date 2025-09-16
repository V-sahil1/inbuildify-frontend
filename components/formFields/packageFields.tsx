import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { CreateFormField } from "../common/Models/CreateFormModel";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { useEffect, useState } from "react";
import { RootState } from "@redux/feature/store";
import { Status } from "@lib/constants/enum";
import { fetchPackageItems } from "@redux/feature/package/packageThunk";
import { Item } from "@redux/feature/masterPriceList/iMasterPriceListState";
import { setAddInstItemModal } from "@redux/feature/package/packageSlice";

export const packageFields = ( selectedValues?: { range?: string; dwelling?: string }): CreateFormField[] => {
  const {range , dwellingType} = useAppSelector((state) => state.types);
  const items = useAppSelector((state: RootState) => state.package.items);
  const dispatch = useAppDispatch();

  function mapToAntdOptions(items: Item[]) {
    return items?.map(item => ({
      label: item.description,   // what to display
      value: item.categoryItemId // what to capture
    }));
  }

  const options = mapToAntdOptions(items);
  useEffect(() => {
    if (selectedValues?.range && selectedValues?.dwelling) {
      try {
        dispatch(fetchPackageItems({range: selectedValues.range,dwellingType: selectedValues.dwelling,})
        );
      } catch (error) {
        console.error("🚀 ~ packageFields ~ error:", error)
      }
    }
  }, [selectedValues?.range, selectedValues?.dwelling, dispatch]);

  const handleAddItem = () => {
    dispatch(setAddInstItemModal(true));
  }

  const rangeOptions = range?.map((range) => ({
    label: range?.name,
    value: range?.name,
  }));
  const dwellingTypeOptions = dwellingType?.map((dwellingType) => ({
    label: dwellingType?.name,
    value: dwellingType?.name,
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
