import { Form, Checkbox, Input } from 'antd';
import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import {
  numberRules,
  settingNameRules,
} from '@lib/constants/formInputValidations';
import { FormField } from '../common/Models/ActionDialogModel';
import { useAppSelector } from '@hooks/redux';
import { CustomBulkSelect } from '../common/CustomBulkSelect';

interface ColorSubCategoryFieldsProps {
  totalCount?: number;
  users?: any[];
  group?: any;
}

export const ColorSubCategoryFields = (props: ColorSubCategoryFieldsProps = { totalCount: 0 }): FormField[] => {
  const { totalCount, users, group } = props;
  const supplierList = users?.map((supplier: any) => ({ value: supplier.supplierId, label: supplier.companyName })) || [];
  const groupList = group?.map((item: any) => ({ value: item.colorGroupId, label: item.name })) || [];

  // Get count from props
  const count = totalCount || 0;

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
      initialValue: count + 1,
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
      label: "Select Suppliers",
      name: "suppliers",
      type: "custom",
      render: <CustomBulkSelect options={supplierList} onChange={() => { }} placeholder='Select the Suppliers'/>,
      rules: [{ required: true, message: 'Please select suppliers' }],
    },

    {
      label: "Selection Type",
      name: "selectionType",
      type: "radio",
      placeholder: "Select selection type",
      initialValue: 'multiple',
      rules: [{ required: true, message: 'Please select a selection type' }],
      options: [
        { value: 'single', label: 'Single' },
        { value: 'multiple', label: 'Multiple' },
      ],
    },
    {
      label: "Status",
      name: "status",
      type: "radio",
      initialValue: 'active',
      placeholder: "Select status",
      rules: [{ required: true, message: 'Please select a status' }],
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    {
      label: "Select Group",
      name: "colorGroups",
      type: "custom",
      render: <CustomBulkSelect options={groupList} onChange={() => { }} placeholder='Select the Group'/>,
      rules: [{ required: true, message: 'Please select group' }],
    }
  ];
};

