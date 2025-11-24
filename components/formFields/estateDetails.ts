import React from 'react';
import { FormField } from '../common/Models/ActionDialogModel';

export const estateDetailsFields = (renderRegionField: () => React.ReactNode): FormField[] => {
  const fields: FormField[] = [
    {
      name: 'name',
      label: 'Estate Name',
      type: 'text',
      placeholder: 'Enter estate name',
    },
    {
      name: 'streetName',
      label: 'Street Name',
      type: 'text',
      placeholder: 'Enter street name',
    },
    {
      name: 'city',
      label: 'City / Suburb',
      type: 'text',
      placeholder: 'Enter city or suburb',
    },
    {
      name: 'state',
      label: 'State / Region',
      type: 'select',
      options: [
        { label: 'Please Select', value: '' },
        { label: 'Victoria', value: 'Victoria' },
        { label: 'New South Wales', value: 'NewSouthWales' },
        { label: 'Queensland', value: 'Queensland' },
        { label: 'South Australia', value: 'SouthAustralia' },
        { label: 'Western Australia', value: 'WesternAustralia' },
        { label: 'Tasmania', value: 'Tasmania' },
        { label: 'Northern Territory', value: 'NorthernTerritory' },
        { label: 'Australian Capital Territory', value: 'AustralianCapitalTerritory' },
      ],
    },
    {
      name: 'region',
      label: 'Region',
      type: 'custom',
      render: renderRegionField,
    },
    {
      name: 'postcode',
      label: 'Zip / Postal Code',
      type: 'text',
      placeholder: 'e.g. 3000',
    },
    {
      name: 'logo',
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
