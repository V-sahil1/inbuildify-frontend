import { CreateFormField } from "@/components/common/Models/CreateFormModel";
import { settingNameRules } from "@lib/constants/formInputValidations";

const rangeAndDwellingTypeFields = (): CreateFormField[] => {
  return [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter name",
      rules: settingNameRules,
    },
  ];
};

export default rangeAndDwellingTypeFields;
