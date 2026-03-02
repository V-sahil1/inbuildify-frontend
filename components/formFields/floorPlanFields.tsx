import { CreateFormField } from '../common/Models/CreateFormModel';
import NoDataMessage from '../common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';
import {
  acceptOnlyImageRule,
  numberRules,
  settingNameRules,
} from '@lib/constants/formInputValidations';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';

export const floorPlanFields = (): CreateFormField[] => {
  const { rangeOptions, dwellingTypeOptions } = useDwellingAndRangeHook({
    type: ['range', 'dwellingType'],
  });

  return [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Luxury Villa',
      rules: settingNameRules,
    },
    {
      label: 'Image',
      name: 'image',
      type: 'image',
      acceptFileType: acceptOnlyImageRule,
      rules: [{ required: true, message: 'Please upload image' }],
    },
    {
      label: 'Range',
      name: 'range',
      type: 'select',
      options: rangeOptions,
      notFoundContent: <NoDataMessage label="range" link={SystemRoutes.DWELLING_AND_RANGE} />,
      placeholder: 'Select range',
      rules: [{ required: true, message: 'Please select a range' }],
    },
    {
      label: 'Dwelling Type',
      name: 'dwelling_type',
      type: 'select',
      options: dwellingTypeOptions,
      notFoundContent: (
        <NoDataMessage label="dwelling type" link={SystemRoutes.DWELLING_AND_RANGE} />
      ),
      placeholder: 'Select dwelling type',
      rules: [{ required: true, message: 'Please select a dwelling type' }],
    },
    {
      label: 'Beds',
      name: 'beds',
      type: 'number',
      placeholder: '4',
      rules: numberRules,
    },
    {
      label: 'Baths',
      name: 'bath',
      type: 'number',
      placeholder: '3',
      rules: numberRules,
    },
    {
      label: 'Car Park',
      name: 'car_park',
      type: 'number',
      placeholder: '2',
      rules: numberRules,
    },
    {
      label: 'Width (m)',
      name: 'width_meter',
      type: 'number',
      placeholder: '15',
      rules: numberRules,
    },
    {
      label: 'Depth (m)',
      name: 'depth_meter',
      type: 'number',
      placeholder: '20',
      rules: numberRules,
    },
    {
      label: 'Dwelling',
      name: 'dwelling',
      type: 'number',
      placeholder: '1',
      rules: numberRules,
    },
    {
      label: 'Garage',
      name: 'garage',
      placeholder: '1',
      type: 'number',
      rules: numberRules,
    },
    {
      label: 'Porch',
      name: 'porch',
      type: 'number',
      placeholder: '1',
      rules: numberRules,
    },
    {
      label: 'Alfresco',
      name: 'alfresco',
      type: 'number',
      placeholder: '1',
      rules: numberRules,
    },
    {
      label: 'Total Sqft',
      name: 'total_sqft',
      type: 'number',
      placeholder: '3200',
      rules: numberRules,
    },
  ];
};
