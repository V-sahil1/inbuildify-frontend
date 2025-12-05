import { FormField } from "../common/Models/ActionDialogModel";
import { settingNameRules } from "@lib/constants/formInputValidations";

export const ColorGroupFields = (): FormField[] => {
  return [
    {
      label: 'Group Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter group name',
      rules: settingNameRules,
    },
    {
        label: "Status",
        name: "status",
        type: "radio",
        placeholder: "Select status",
        initialValue: 'active',
        rules: [{ required: true, message: 'Please select a status' }],
        options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
        ],
    }
  ];
};