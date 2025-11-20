import { Form, FormInstance } from 'antd';
import {
  numberRules,
  settingNameRules,
} from '@lib/constants/formInputValidations';
import { FormField } from '../common/Models/ActionDialogModel';

interface ColorSubCategoryFieldsProps {
  totalCount?: number;
  users?: any[];
}

export const ColorSubCategoryFields = (totalCount: number | ColorSubCategoryFieldsProps = 0): FormField[] => {
  // Make form optional with a fallback
  let form: FormInstance | null = null;
  try {
    form = Form.useFormInstance();
  } catch (error) {
    console.warn('Form instance not available. Make sure this component is wrapped in a Form component.');
  }
  
  // Handle case where a number is passed directly
  const count = typeof totalCount === 'number' 
    ? totalCount 
    : totalCount?.totalCount || 0;
    
  // Get users if passed as part of props object
  const usersList = (typeof totalCount === 'object' && totalCount?.users) 
    ? totalCount.users 
    : [];
    
  console.log('Users in ColorSubCategoryFields:', usersList);
  return [
    {
      label: 'Sub Category Name',
      name: 'name',
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
  type: "checkbox",
  placeholder: "Select a supplier",
  rules: [{ required: true, message: 'Please select a supplier' }],
  options: usersList?.length > 0
    ? [
        { label: 'Select All', value: 'all' },
        ...usersList.map((user: any) => ({
          value: user.usersId,
          label: user.name
        }))
      ]
    : [],
  onChange: (checkedValues) => {
    const supplierIds = usersList?.map(u => u.usersId) || [];
    const allValues = ['all', ...supplierIds];
    
    // If form is not available, just return
    if (!form) {
      console.warn('Form instance not available. Make sure this component is wrapped in a Form component.');
      return;
    }
    
    // If "Select All" was clicked
    if (checkedValues.includes('all')) {
      // If "Select All" is being checked
      if (checkedValues[checkedValues.length - 1] === 'all') {
        form.setFieldsValue({ suppliers: allValues });
      } 
      // If "Select All" is being unchecked
      else {
        form.setFieldsValue({ suppliers: [] });
      }
      return;
    }
    
    // If all individual items are checked, also check "Select All"
    if (supplierIds.length > 0 && supplierIds.every(id => checkedValues.includes(id))) {
      form.setFieldsValue({ suppliers: allValues });
      return;
    }
    
    // For any other case, just update with current values (excluding 'all' if present)
    form.setFieldsValue({ 
      suppliers: checkedValues.filter(v => v !== 'all') 
    });
  }
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
        name: "group",
        type: "checkbox",
        placeholder: "Select group",
        rules: [{ required: true, message: 'Please select group' }],
        options: [
          { label: 'Select All', value: 'all' },
          {label : 'ColorBond Color', value : 'colorbondColor'},
          {label : 'Dark Themes', value : 'darkthemes'},
          {label : 'MG Color Group', value : 'mgColorGroup'},
        ],
        onChange: (checkedValues) => {
            const form = Form.useFormInstance();

            if (checkedValues.includes('all')) {
                // If 'Select All' is checked, select all groups
                form.setFieldsValue({ group: ['all', 'colorbondColor', 'darkthemes', 'mgColorGroup'] });
            } else if (checkedValues.length === 0) {
                // If nothing is selected, ensure at least one item is selected
                form.setFieldsValue({ group: ['all', 'colorbondColor', 'darkthemes', 'mgColorGroup'] });
            } else if (checkedValues.includes('all') && checkedValues.length < 4) {
                // If 'Select All' is checked but not all items are selected, uncheck 'Select All'
                form.setFieldsValue({ group: checkedValues.filter(v => v !== 'all') });
            } else if (checkedValues.length === 3) {
                // If all items are selected manually, check 'Select All'
                form.setFieldsValue({ group: ['all', 'colorbondColor', 'darkthemes', 'mgColorGroup'] });
            }
        }   
    },
  ];
};

