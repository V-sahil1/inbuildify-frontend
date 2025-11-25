import type { FormField } from '@/components/common/Models/ActionDialogModel';

export const getQuotationFormatFields = (modalMode: 'heading' | 'item'): FormField[] => [
  {
    label: modalMode === 'heading' ? 'Heading' : 'Item',
    name: 'name',
    type: modalMode === 'heading' ? 'text' : 'textarea',
    placeholder: modalMode === 'heading' ? 'Enter heading name' : 'Enter item description',
    rules: [
      {
        required: true,
        message:
          modalMode === 'heading' ? 'Please enter heading name' : 'Please enter item description',
      },
    ],
  },
  {
    label: 'Effective Start Date',
    name: 'startDate',
    type: 'date',
  },
  {
    label: 'Effective End Date',
    name: 'endDate',
    type: 'date',
  },
  {
    label: 'Sort Order',
    name: 'sortOrder',
    type: 'number',
  },
  {
    label: 'Status',
    name: 'status',
    type: 'radio',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
    ],
    initialValue: 'Active',
  },
];

export const getSectionDetailsFields = (): FormField[] => [
  {
    label: 'Section',
    name: 'sectionName',
    type: 'select',
    initialValue: 'blank',
    options: [{ label: 'Blank Page', value: 'blank' }], //TODO:as per selected option here, below fields will change
  },
  {
    label: 'Sort Order',
    name: 'sortOrder',
    type: 'number',
  },
  {
    label: 'Title',
    name: 'title',
    type: 'text',
  },
  {
    label: 'Allow Merge',
    name: 'allowMerge',
    type: 'switch',
  },
  {
    label: 'Title Alignment',
    name: 'titleAlignment',
    type: 'select',
    initialValue: 'center',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ],
  },
  {
    label: 'Title Font Size',
    name: 'titleFontSize',
    type: 'select',
    initialValue: '14',
    options: [8, 10, 12, 14, 16, 18, 20].map(v => ({
      label: v.toString(),
      value: v.toString(),
    })),
  },
  {
    label: 'Title Font Color',
    name: 'titleFontColor',
    type: 'text',
  },
  {
    label: 'Title Bg Color',
    name: 'titleBgColor',
    type: 'text',
  },
];

export const getCreateMasterFields = (): FormField[] => [
  {
    label: 'Master',
    name: 'masterName',
    type: 'text',
    rules: [{ required: true, message: 'Please enter master name' }],
  },
  {
    label: 'Status',
    name: 'status',
    type: 'radio',
    initialValue: 'active',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
];

export const getCustomGroupFields = (): FormField[] => [
  {
    key: 'fieldName',
    label: 'Field Name',
    name: 'fieldName',
    type: 'text',
    rules: [{ required: true, message: 'Field Name is required' }],
  },
  {
    key: 'fieldLabel',
    label: 'Field Label',
    name: 'fieldLabel',
    type: 'text',
    rules: [{ required: true, message: 'Field Label is required' }],
  },
  {
    key: 'sortOrder',
    label: 'Sort Order',
    name: 'sortOrder',
    type: 'number',
    rules: [{ required: true, message: 'Sort Order is required' }],
  },
];
