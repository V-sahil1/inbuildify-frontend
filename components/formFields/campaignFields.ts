import { FormField } from '../common/Models/ActionDialogModel';

export const campaignFooterfields: FormField[] = [
  { label: 'Footer Name', name: 'footerName', type: 'text' },
  { label: 'Footer Content', name: 'footerContent', type: 'texteditor' },
  { label: 'Set Background Color', name: 'backgroundColor', type: 'color' },
  { label: 'Set as Default', name: 'default', type: 'switch' },
];
