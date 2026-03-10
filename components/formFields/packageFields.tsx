import { CreateFormField } from '../common/Models/CreateFormModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useEffect } from 'react';
import { RootState } from '@redux/feature/store';
import { fetchPackageItems } from '@redux/feature/package/packageThunk';
import { setAddInstItemModal } from '@redux/feature/package/packageSlice';
import NoDataMessage from '../common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';
import { costRules, settingNameRules } from '@lib/constants/formInputValidations';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';

export const packageFields = (selectedValues?: {
  range?: string;
  dwelling?: string;
}): CreateFormField[] => {
  const items = useAppSelector((state: RootState) => state.package.items);
  const dispatch = useAppDispatch();
  const { rangeOptions, dwellingTypeOptions } = useDwellingAndRangeHook({
    type: ['dwellingType', 'range'],
  });

  // function mapToAntdOptions(items: Item[]) {
  function mapToAntdOptions(items: any[]) {
    return items?.map(item => ({
      label: item.description, // what to display
      value: item.categoryItemId, // what to capture
    }));
  }

  const options = mapToAntdOptions(items);
  useEffect(() => {
    if (selectedValues?.range && selectedValues?.dwelling) {
      try {
        dispatch(
          fetchPackageItems({
            range: selectedValues.range[0] || '',
            dwellingType: selectedValues.dwelling[0] || '',
          })
        );
      } catch (error) {
        console.error('🚀 ~ packageFields ~ error:', error);
      }
    }
  }, [selectedValues?.range, selectedValues?.dwelling, dispatch]);

  const handleAddItem = () => {
    dispatch(setAddInstItemModal(true));
  };

  return [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Package Name',
      rules: settingNameRules,
    },
    {
      label: 'Range',
      name: 'range',
      type: 'select',
      options: rangeOptions,
      notFoundContent: <NoDataMessage label="range" link={SystemRoutes.DWELLING_AND_RANGE} />,
      placeholder: 'Select Range',
    },
    {
      label: 'Dwelling Type',
      name: 'dwelling',
      type: 'select',
      options: dwellingTypeOptions,
      notFoundContent: (
        <NoDataMessage label="dwelling type" link={SystemRoutes.DWELLING_AND_RANGE} />
      ),
      placeholder: 'Select Dwelling Type',
    },
    {
      label: 'Items',
      name: 'categoryItemIds',
      type: 'select',
      mode: 'multiple',
      options: options,
      placeholder: 'Select Items',
      rules: [{ required: true, message: 'Please select a range' }],
      button: 'Add Item',
      disableButton: !selectedValues?.range || !selectedValues?.dwelling,
      disabled: !selectedValues?.range || !selectedValues?.dwelling,
      onClick: handleAddItem,
    },
    {
      label: 'Total Amount',
      name: 'amount',
      type: 'number',
      placeholder: '3200',
      rules: [...costRules],
    },
  ];
};
