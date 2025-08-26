import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { CreateFormField } from "../common/Models/CreateFormModel";
import { useAppSelector } from "@hooks/redux";

export const packageFields = (): CreateFormField[] => {
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
      name: "items",
      type: "select",
      options: [{label:"",value:""}],
      placeholder: "Select Items",
      rules: [{ required: true, message: "Please select a range" }],
    },
    {
      label: "Total Price",
      name: "total_price",
      type: "number",
      placeholder: "3200",
      rules: [{ required: true, message: "Please enter total price" }],
    },
  ];
};
