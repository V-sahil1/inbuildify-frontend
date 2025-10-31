import {
  descriptionRules,
  optionalDescriptionRules,
  settingNameRules,
} from '@lib/constants/formInputValidations';
import { CreateFormField } from '../common/Models/CreateFormModel';

export const MasterPricingCategoryFields = (): CreateFormField[] => {
  return [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter name',
      rules: settingNameRules,
    },
    {
      label: 'Description',
      name: 'description',
      type: 'text',
      placeholder: 'Enter description',
      rules: optionalDescriptionRules,
    },
  ];
};
