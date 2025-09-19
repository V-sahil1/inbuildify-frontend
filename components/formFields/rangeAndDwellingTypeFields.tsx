import { CreateFormField } from "@/components/common/Models/CreateFormModel";
import { nameRules } from "@lib/constants/formInputValidations";

const rangeAndDwellingTypeFields = (): CreateFormField[] => {
  return [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter name",
      rules: nameRules,
    },
  ];
};

export default rangeAndDwellingTypeFields;
