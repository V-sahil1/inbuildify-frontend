import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { CreateFormField } from "../common/Models/CreateFormModel";
import { useAppSelector } from "@hooks/redux";
import { mapToOptions } from "@lib/utils/rangeAndDwellingObjToOptions";
import { acceptOnlyImageRule, costRules, settingNameRules } from "@lib/constants/formInputValidations";
import NoDataMessage from "../common/NoDataMessage";
import SystemRoutes from "@lib/constants/Routes";

export const facadeFields = ({isDwellingDisable = false}: {isDwellingDisable?: boolean}): CreateFormField[] => {
const dwellingType = useAppSelector((state) => state.types.dwellingType);
const { selectedFilters } = useAppSelector((state) => state.quotation);
const dwellingTypeOptions = mapToOptions(dwellingType);

  return [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Luxury Villa",
      rules: settingNameRules,
    },
    {
      label: "Image",
      name: "image",
      type: "image",
      acceptFileType: acceptOnlyImageRule,
      rules: [{ required: true, message: "Please upload image" }],
    },
    {
      label: "Dwelling Type",
      name: "dwelling_type",
      type: "select",
      options: dwellingTypeOptions,
      placeholder: "Select dwelling type",
      rules: [{ required: true, message: "Please select a dwelling type" }],
      disabled: isDwellingDisable,
      initialValue: isDwellingDisable ? selectedFilters?.dwelling_type : undefined,
      notFoundContent: (
        <NoDataMessage
          label="dwelling type"
          link={SystemRoutes.DWELLING_AND_RANGE}
        />
      ),
    },
    {
      label: "Cost",
      name: "cost",
      type: "number",
      placeholder: "10000",
      rules: costRules
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
