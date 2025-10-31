import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

interface BaseProps {
  className?: string;
  [key: string]: unknown;
}

export const Button = React.forwardRef<
  HTMLSpanElement,
  PropsWithChildren<
    {
      active: boolean;
      reversed?: boolean;
    } & BaseProps
  >
>(({ className, active, reversed, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={`
      cursor-pointer inline-block p-1 rounded transition-colors
      ${active ? 'bg-primary text-white' : 'hover:bg-primary-10'}
      ${reversed ? 'text-white' : ''}
      ${className || ''}
    `}
  />
));

export const Icon = React.forwardRef<HTMLSpanElement, PropsWithChildren<BaseProps>>(
  ({ className, ...props }, ref) => (
    <span {...props} ref={ref} className={`material-icons text-lg ${className || ''}`} />
  )
);

export const Menu = React.forwardRef<HTMLDivElement, PropsWithChildren<BaseProps>>(
  ({ className, ...props }, ref) => (
    <div {...props} ref={ref} className={`relative ${className || ''}`} />
  )
);

export const Portal = ({ children }: { children?: React.ReactNode }) => {
  return typeof document === 'object' ? createPortal(children, document.body) : null;
};

export const Toolbar = React.forwardRef<HTMLDivElement, PropsWithChildren<BaseProps>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={`flex items-center space-x-1 px-4 py-2 border-b border-gray-200 ${className || ''}`}
    />
  )
);
