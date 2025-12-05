import { ReactNode } from 'react';

export interface CustomSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
}

export interface CustomSelectOption {
  label: string;
  value: string;
  role?: string[];
}

export interface TooltipButtonProps {
  title: string;
  icon: ReactNode;
  onClick?: () => void;
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed';
  className?: string;
}

export type CopyType = 'category' | 'subcategory' | 'subcategoryitem';


// EXPORT TYPE OF THE EXCEL AND CSV

export type ExcelColumn =
  | string
  | {
    label: string;
    color?: string;
    dataColor?: string;
    dataColorFn?: (value: any, row: any) => string | undefined;
    children?: {
      key: string;
      label: string;
      color?: string;
      dataColor?: string;
      dataColorFn?: (value: any, row: any) => string | undefined;
    }[];
  };

export interface HeaderBlock {
  position: "top" | "bottom";
  layout?: "horizontal" | "vertical";
  columnHeaders: Record<string, ExcelColumn>;
  data: any[];
}

export interface ExportOptions {
  data: any[];
  fileName: string;
  sheetName?: string;
  columnHeaders: Record<string, ExcelColumn>;
  title?: string;
  extraHeaderRows?: HeaderBlock[];
}