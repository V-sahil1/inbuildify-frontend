import {
  numberRules,
  settingNameRules,
} from '@lib/constants/formInputValidations';
import { FormField } from '../common/Models/ActionDialogModel';


export const ColorMasterCategoryFields = (totalCount: number = 0): FormField[] => {
  return [
    {
      label: 'Color Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter color name',
      rules: settingNameRules,
    },
    {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
      placeholder: 'Enter sort order',
      initialValue: totalCount + 1,
      rules: [
        ...numberRules,
        {
          validator: (_, value) => {
            if (value < 1) {
              return Promise.reject('Sort order must be at least 1');
            }
            if (value > totalCount + 1) {
              return Promise.reject(`Sort order cannot be greater than ${totalCount + 1}`);
            }
            return Promise.resolve();
          },
        },
      ],
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
