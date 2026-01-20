import { useState, useMemo } from 'react';
import { useAppSelector } from '@hooks/redux';
import {
  acceptOnlyImageRule,
  costRules,
  settingNameRules,
} from '@lib/constants/formInputValidations';
import NoDataMessage from '../common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
import { FormField } from '../common/Models/ActionDialogModel';

export const facadeFields = ({
  isDwellingDisable = false,
  type,
}: {
  isDwellingDisable?: boolean;
  type?: 'standard' | 'upgrade';
}): FormField[] => {
  const { selectedFilters } = useAppSelector(state => state.quotation);
  const [costType, setCostType] = useState<'standard' | 'upgrade'>(type);
  const { dwellingTypeOptions, rangeOptions } = useDwellingAndRangeHook({ type: ['dwellingType', 'range'] });
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });

  const handleCostTypeChange = (e) => {
    const value = e?.target?.value || e;
    setCostType(value);
  };

  const fields = useMemo((): FormField[] => {
    return [
      {
        label: 'Location',
        name: 'locationId',
        type: 'select',
        options: locationOptions,
        placeholder: 'Location',
      },
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        placeholder: 'Luxury Villa',
        rules: settingNameRules,
      },
      {
        label: 'Range',
        name: 'rangeId',
        type: 'select',
        options: rangeOptions,
        placeholder: 'Select range',
        rules: [{ required: true, message: 'Please select a range' }],
        disabled: isDwellingDisable,
        initialValue: isDwellingDisable ? selectedFilters?.rangeId : undefined,
        notFoundContent: (
          <NoDataMessage label="range" link={SystemRoutes.DWELLING_AND_RANGE} />
        ),
      },
      {
        label: 'Dwelling Type',
        name: 'dwellingTypeId',
        type: 'select',
        options: dwellingTypeOptions,
        placeholder: 'Select dwelling type',
        rules: [{ required: true, message: 'Please select a dwelling type' }],
        disabled: isDwellingDisable,
        notFoundContent: (
          <NoDataMessage label="dwelling type" link={SystemRoutes.DWELLING_AND_RANGE} />
        ),
      },
      {
        label: 'Cost Type',
        name: 'costType',
        type: 'radio' as const,
        options: [
          { label: 'Standard', value: 'standard' },
          { label: 'Upgrade', value: 'upgrade' },
        ],
        placeholder: 'Select cost type',
        rules: [{ required: true, message: 'Please select a cost type' }],
        onChange: handleCostTypeChange,
        initialValue: costType,
      },
      {
        label: 'Cost',
        name: 'cost',
        type: 'number' as const,
        disabled: costType === 'standard',
        rules: costType === 'upgrade' ? costRules : [],
      },
      {
        label: 'Image',
        name: 'image',
        type: 'image',
        acceptFileType: acceptOnlyImageRule,
        rules: [{ required: true, message: 'Please upload image' }],
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
        type: 'radio' as const,
        options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ],
        placeholder: 'Select status',
        initialValue: true,
        rules: [{ required: true, message: 'Please select a status' }],
      },
    ];

   
  }, [costType, dwellingTypeOptions, isDwellingDisable, selectedFilters, locationOptions, rangeOptions]);

  return fields;
};
