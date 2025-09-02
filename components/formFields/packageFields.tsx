import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { CreateFormField } from "../common/Models/CreateFormModel";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { useEffect } from "react";
import { RootState } from "@redux/feature/store";
import { Status } from "@lib/constants/enum";
import { fetchPackageItems } from "@redux/feature/package/packageThunk";
import { Item } from "@redux/feature/masterPriceList/iMasterPriceListState";
import { setAddInstItemModal } from "@redux/feature/package/packageSlice";

export const packageFields = (): CreateFormField[] => {
  const itemStatus = useAppSelector(
    (state: RootState) => state.package.status.items
  );
  const items = useAppSelector((state: RootState) => state.package.items);
  const dispatch = useAppDispatch();

  function mapToAntdOptions(items: Item[]) {
    return items?.map(item => ({
      label: item.description,   // what to display
      value: item.categoryItemId // what to capture
    }));
  }
  const options = mapToAntdOptions(items)
  useEffect(() => {
    try {
      if (itemStatus === Status.IDLE) {
        dispatch(
          fetchPackageItems({ range: "PREMIUM", dwellingType: "DOUBLE_STOREY" })
        ).unwrap();
      }
    } catch (error) {
    }
  }, []);

  const handleAddItem = () => {
    dispatch(setAddInstItemModal(true));
  }

  return [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Package Name",
      rules: [{ required: true, message: "Please enter the package name" }],
    },
    {
      label: "Items",
      name: "categoryItemIds",
      type: "select",
      mode:"tags",
      options: options,
      placeholder: "Select Items",
      rules: [{ required: true, message: "Please select a range" }],
      button:"Add Item",
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
