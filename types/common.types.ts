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
}
