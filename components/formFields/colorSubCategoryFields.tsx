import { numberRules, settingNameRules } from '@lib/constants/formInputValidations';
import { FormField } from '../common/Models/ActionDialogModel';
import { CustomBulkSelect } from '../common/CustomBulkSelect';
import NoDataMessage from '../common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';

interface ColorSubCategoryFieldsProps {
  totalCount?: number;
  supplierOptions?: { label: string; value: string }[];
  groupOptions?: { label: string; value: string }[];
}

export const ColorSubCategoryFields = (
  props: ColorSubCategoryFieldsProps = { totalCount: 0 }
): FormField[] => {
  const { totalCount, supplierOptions, groupOptions } = props;
  return [
    {
      label: 'Sub Category Name',
      name: 'categoryName',
      type: 'text',
      placeholder: 'Enter sub category name',
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
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: 'Select Suppliers',
      name: 'suppliers',
      type: 'custom',
      render: (
        <CustomBulkSelect
          options={supplierOptions}
          onChange={() => {}}
          placeholder="Select the Suppliers"
          notFoundContent={<NoDataMessage label="Supplier" link={SystemRoutes.SUPPLIER} />}
        />
      ),
      rules: [{ required: true, message: 'Please select suppliers' }],
    },

    {
      label: 'Selection Type',
      name: 'selectionType',
      type: 'radio',
      placeholder: 'Select selection type',
      initialValue: 'multiple',
      rules: [{ required: true, message: 'Please select a selection type' }],
      options: [
        { value: 'single', label: 'Single' },
        { value: 'multiple', label: 'Multiple' },
      ],
    },
    {
      label: 'Status',
      name: 'status',
      type: 'radio',
      initialValue: 'active',
      placeholder: 'Select status',
      rules: [{ required: true, message: 'Please select a status' }],
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    {
      label: 'Select Group',
      name: 'colorGroups',
      type: 'custom',
      render: (
        <CustomBulkSelect
          options={groupOptions}
          onChange={() => {}}
          placeholder="Select the Group"
          notFoundContent={<NoDataMessage label="Color Group" link={SystemRoutes.COLOR_GROUP} />}
        />
      ),
      rules: [{ required: true, message: 'Please select group' }],
    },
  ];
};
