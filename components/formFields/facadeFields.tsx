
import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { CreateFormField } from "../common/Models/CreateFormModel";
import { useAppSelector } from "@hooks/redux";
import { mapToOptions } from "@lib/utils/rangeAndDwellingObjToOptions";
import { numberRules } from "@lib/constants/formInputValidations";


export const facadeFields = (): CreateFormField[] => {
const dwellingType = useAppSelector((state) => state.types.dwellingType);
const { selectedFilters } = useAppSelector((state) => state.quotation);
const dwellingTypeOptions = mapToOptions(dwellingType);

  return [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Luxury Villa",
      rules: [{ required: true, message: "Please enter the property name" }],
    },
    {
      label: "Image",
      name: "image",
      type: "image",
      rules: [{ required: true, message: "Please upload image" }],
    },
    {
      label: "Dwelling Type",
      name: "dwelling_type",
      type: "select",
      options: dwellingTypeOptions,
      placeholder: "Select dwelling type",
      rules: [{ required: true, message: "Please select a dwelling type" }],
      disabled: true,
      initialValue: selectedFilters?.dwelling_type,
    },
    {
      label: "Cost",
      name: "cost",
      type: "number",
      placeholder: "10000",
      rules: numberRules
    },
    {
      label: "Standard",
      name: "standard",
      type: "checkbox",
      placeholder: "1",
      initialValue: "TRUE",
      rules: [{ required: true, message: "Please select a dwelling type" }],
    },
    {
      label: "Upgrade",
      name: "upgrade",
      type: "checkbox",
      placeholder: "1",
      initialValue: "TRUE",
      rules: [{ required: true, message: "Please select a dwelling type" }],
    },
  ];
}
