import { numberRules } from '@lib/constants/formInputValidations';
import { Category, ColorType } from '@redux/feature/color/iColourState';
import { useState } from 'react';
import { FormField } from '../common/Models/ActionDialogModel';

export type CopyInitialValues = {
  categoryName?: string;
  subCategoryId?: string;
  sortOrder?: number;
  itemName?: string;
  colorId?: string;
  colorItemId?: string;
  colorCategoryId?: string;
};

export const useBuildCopyFields = ({
  copyModal,
  copyInitialValues,
  color,
}: {
  copyModal: string;
  copyInitialValues: CopyInitialValues;
  color: ColorType[];
}): FormField[] => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const colorOptions = color?.map((color: ColorType) => ({
    label: color.colorName,
    value: color.colorId,
  }));

  const categoryOptions = !!selectedColor
    ? color
        ?.find((color: ColorType) => color.colorId === selectedColor)
        ?.colorCategories?.map((category: Category) => ({
          label: category.categoryName,
          value: category.colorCategoryId,
        }))
    : [];
  if (copyModal === 'copyColor') {
    return [
      {
        label: 'Color Name',
        name: 'colorName',
        type: 'text',
        placeholder: 'Enter color name',
        rules: [{ required: true, message: 'Please enter category name' }],
      },
      {
        label: 'Sort Order',
        name: 'sortOrder',
        type: 'number',
        rules: numberRules,
      },
    ];
  }

  if (copyModal === 'copyCategory') {
    return [
      {
        label: 'Color',
        name: 'colorId',
        type: 'dynamic-select',
        options: colorOptions,
        initialValue: copyInitialValues?.colorId,
        rules: [{ required: true, message: 'Please select a Color' }],
        onChange: (value: string) => setSelectedColor(value),
      },
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
        rules: numberRules,
      },
    ];
  }

  if (copyModal === 'copyColorItem') {
    return [
      {
        label: 'Color',
        name: 'colorId',
        type: 'dynamic-select',
        options: colorOptions,
        initialValue: copyInitialValues?.colorId,
        rules: [{ required: true, message: 'Please select a color' }],
        onChange: (value: string) => setSelectedColor(value),
      },
      {
        label: 'Category',
        name: 'colorCategoryId',
        type: 'select',
        options: categoryOptions,
        initialValue: copyInitialValues?.colorCategoryId,
        rules: [{ required: true, message: 'Please select a category' }],
      },
      {
        label: 'Item Name',
        name: 'itemName',
        type: 'text',
        initialValue: copyInitialValues?.itemName,
        placeholder: 'Enter item name',
        rules: [{ required: true, message: 'Please enter item name' }],
      },
      {
        label: 'Sort Order',
        name: 'sortOrder',
        type: 'number',
        rules: numberRules,
      },
    ];
  }
  return [];
};
