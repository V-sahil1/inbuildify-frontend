import { useState, useMemo } from 'react';
import { useAppSelector } from '@hooks/redux';
import { mapToOptions } from '@lib/utils/rangeAndDwellingObjToOptions';
import {
  acceptOnlyImageRule,
  costRules,
  settingNameRules,
} from '@lib/constants/formInputValidations';
import NoDataMessage from '../common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';

export const facadeFields = ({
  isDwellingDisable = false,
  type,
}: {
  isDwellingDisable?: boolean;
  type?: 'standard' | 'upgrade';
}) => {
  const dwellingType = useAppSelector(state => state.types.dwellingType);
  const { selectedFilters } = useAppSelector(state => state.quotation);
  const dwellingTypeOptions = mapToOptions(dwellingType);
  const [costType, setCostType] = useState<'standard' | 'upgrade'>(type);

  const handleCostTypeChange = (e: any) => {
    const value = e?.target?.value || e;
    setCostType(value);
  };

  const fields = useMemo(() => {
    return [
      {
        label: 'Location',
        name: 'location',
        type: 'select',
        options: [],
        placeholder: 'Location',
        rules: settingNameRules,
      },
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        placeholder: 'Luxury Villa',
        rules: settingNameRules,
      },
      {
        label: 'Dwelling Type',
        name: 'dwelling_type',
        type: 'select',
        options: dwellingTypeOptions,
        placeholder: 'Select dwelling type',
        rules: [{ required: true, message: 'Please select a dwelling type' }],
        disabled: isDwellingDisable,
        initialValue: isDwellingDisable ? selectedFilters?.dwelling_type : undefined,
        notFoundContent: (
          <NoDataMessage label="dwelling type" link={SystemRoutes.DWELLING_AND_RANGE} />
        ),
      },
      {
        label: 'Image',
        name: 'image',
        type: 'image',
        acceptFileType: acceptOnlyImageRule,
        rules: [{ required: true, message: 'Please upload image' }],
      },
      {
        label: 'Cost Type',
        name: 'costType',
        type: 'radio',
        options: [
          { label: 'Standard', value: 'standard' },
          { label: 'Upgrade', value: 'upgrade' },
        ],
        placeholder: 'Select cost type',
        rules: [{ required: true, message: 'Please select a cost type' }],
        value: costType,
        onChange: handleCostTypeChange,
        initialValue: costType,
      },
      {
        label: 'Cost',
        name: 'cost',
        type: 'number',
        disabled: costType === 'standard',
        rules: costType === 'upgrade' ? costRules : [],
      },
      {
        label: 'Builder cost',
        name: 'builderCost',
        type: 'number',
        disabled: costType === 'standard',
        rules: costType === 'upgrade' ? costRules : [],
      },
      {
        label: 'Status',
        name: 'status',
        type: 'radio',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
        placeholder: 'Select status',
        initialValue: 'active',
        rules: [{ required: true, message: 'Please select a status' }],
      },
    ];
  }, [costType, dwellingTypeOptions, isDwellingDisable, selectedFilters]);

  return fields;
};
