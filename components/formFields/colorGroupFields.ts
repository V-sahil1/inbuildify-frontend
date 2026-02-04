import { FormField } from "../common/Models/ActionDialogModel";
import { settingNameRules } from "@lib/constants/formInputValidations";

export const ColorGroupFields = (isEditing: boolean): FormField[] => {
  return [
    {
      label: 'Group Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter group name',
      rules: settingNameRules,
    },
    // 👇 Only include status field when editing
    ...(isEditing
      ? [
          {
            label: "Status",
            name: "status",
            type: "radio" as const,
            placeholder: "Select status",
            initialValue: 'active',
            rules: [{ required: true, message: 'Please select a status' }],
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
        ]
      : []),
  ];
};
