import { numberRules } from "@lib/constants/formInputValidations";
import { CreateFormField } from "../common/Models/CreateFormModel"

type CopyType = 'category' | 'subcategory' | 'subcategoryitem';
type CopyInitialValues = {
  categoryName?: string;
  subCategoryName?: string;
  subCategoryItemName?: string;
  categoryId?: string;
  subCategoryId?: string;
  sortOrder?: number;
};

export const buildCopyFields = (
  copyModal: { type: CopyType },
  copyInitialValues: CopyInitialValues,
  colorCategoryCount: number,
  categoryOptions: Array<{ value: string; label: string }>,
  subCategoryList: Array<{ value: string; label: string }>
): CreateFormField[] => {
  const common = [
    {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
      initialValue: copyInitialValues?.sortOrder ?? colorCategoryCount + 1,
      rules: [
        ...numberRules,
        {
          validator: (_, value) => {
            if (value < 1) {
              return Promise.reject('Sort order must be at least 1');
            }
            if (value > colorCategoryCount + 1) {
              return Promise.reject(`Sort order cannot be greater than ${colorCategoryCount + 1}`);
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];

  if (copyModal.type === 'category') {
    return [
      {
        label: 'Category Name',
        name: 'categoryName',
        type: 'text',
        initialValue: copyInitialValues?.categoryName,
        placeholder: 'Enter category name',
        rules: [{ required: true, message: 'Please enter category name' }],
      },
      {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
      initialValue: copyInitialValues?.sortOrder ?? colorCategoryCount + 1,
      rules: [
        ...numberRules,
        {
          validator: (_, value) => {
            if (value < 1) {
              return Promise.reject('Sort order must be at least 1');
            }
            if (value > colorCategoryCount + 1) {
              return Promise.reject(`Sort order cannot be greater than ${colorCategoryCount + 1}`);
            }
            return Promise.resolve();
          },
        },
      ],
    },
    ];
  }

  if (copyModal.type === 'subcategory') {
    return [
      {
        label: 'Category',
        name: 'categoryId',
        type: 'select',
        options: categoryOptions,
        initialValue: copyInitialValues?.categoryId,
        rules: [{ required: true, message: 'Please select a category' }],
      },
      {
        label: 'Subcategory Name',
        name: 'subCategoryName',
        type: 'text',
        initialValue: copyInitialValues?.subCategoryName,
        placeholder: 'Enter subcategory name',
        rules: [{ required: true, message: 'Please enter subcategory name' }],
      },
      {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
      initialValue: copyInitialValues?.sortOrder ?? colorCategoryCount + 1,
      rules: [
        ...numberRules,
        {
          validator: (_, value) => {
            if (value < 1) {
              return Promise.reject('Sort order must be at least 1');
            }
            if (value > colorCategoryCount + 1) {
              return Promise.reject(`Sort order cannot be greater than ${colorCategoryCount + 1}`);
            }
            return Promise.resolve();
          },
        },
      ],
    },
    ];
  }

  if (copyModal.type === 'subcategoryitem') {
    return [
      {
        label: 'Category',
        name: 'categoryId',
        type: 'select',
        options: categoryOptions,
        initialValue: copyInitialValues?.categoryId,
        rules: [{ required: true, message: 'Please select a category' }],
      },
      {
        label: 'Subcategory',
        name: 'subCategoryId',
        type: 'select',
        options: subCategoryList,
        initialValue: copyInitialValues?.subCategoryId,
        rules: [{ required: true, message: 'Please select a subcategory' }],
      },
      {
        label: 'Item Name',
        name: 'subCategoryItemName',
        type: 'text',
        initialValue: copyInitialValues?.subCategoryItemName,
        placeholder: 'Enter item name',
        rules: [{ required: true, message: 'Please enter item name' }],
      },
      {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
      initialValue: copyInitialValues?.sortOrder ?? colorCategoryCount + 1,
      rules: [
        ...numberRules,
        {
          validator: (_, value) => {
            if (value < 1) {
              return Promise.reject('Sort order must be at least 1');
            }
            if (value > colorCategoryCount + 1) {
              return Promise.reject(`Sort order cannot be greater than ${colorCategoryCount + 1}`);
            }
            return Promise.resolve();
          },
        },
      ],
    },
    ];
  }

  return [];
};

export const CopyColorCategoryFields = (totalCount: number): CreateFormField[] => {
  return [
    {
      label: "Category Name",
      name: "categoryName",
      type: "text",
      placeholder: "Enter category name",
      rules: [{ required: true, message: "Please enter category name" }]
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
            if (value > totalCount + 1) {
              return Promise.reject(`Sort order cannot be greater than ${totalCount + 1}`);
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};