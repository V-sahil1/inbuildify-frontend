import React from 'react';
import { FormField } from '../common/Models/ActionDialogModel';
import { cityRules, zipCodeRules } from '@lib/constants/formInputValidations';

export const estateDetailsFields = (
  renderRegionField: () => React.ReactNode,
  stateOptions?: { label: string; value: string }[]
): FormField[] => {
  const fields: FormField[] = [
    {
      name: 'name',
      label: 'Estate Name',
      type: 'text',
      placeholder: 'Enter estate name',
      rules: [{ required: true, message: 'Please Enter estate name' }],
    },
    {
      name: 'streetName',
      label: 'Street Name',
      type: 'text',
      placeholder: 'Enter street name',
      rules: [{ required: true, message: 'Please Enter Street' }],
    },
    {
      name: 'city',
      label: 'City / Suburb',
      type: 'text',
      placeholder: 'Enter city or suburb',
      rules: cityRules,
    },
    {
      name: 'stateId',
      label: 'State / Region',
      type: 'select',
      options: stateOptions,
      rules: [{ required: true, message: 'Please Select State' }],
    },
    // {
    //   name: 'region',
    //   label: 'Region',
    //   type: 'custom',
    //   render: renderRegionField,
    // },
    {
      name: 'zip',
      label: 'Zip / Postal Code',
      type: 'text',
      placeholder: 'e.g. 3000',
      rules: zipCodeRules,
    },
    {
      name: 'estateLogo',
      label: 'Estate Logo',
      type: 'image',
      acceptFileType: 'image/*',
      extra: 'Upload a logo image (recommended ratio fits 1920x1080 display)',
    },
    {
      name: 'website',
      label: 'Website Address',
      type: 'text',
      placeholder: 'Add http:// or https://',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Describe the estate',
    },
  ];

  return fields;
};
