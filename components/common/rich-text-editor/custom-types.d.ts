import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type CustomFontFamily = 'Arial' | 'Verdana' | 'Georgia' | 'Times New Roman' | 'Courier New';
export type CustomFontSize =
  | '12px'
  | '13px'
  | '14px'
  | '15px'
  | '16px'
  | '17px'
  | '18px'
  | '19px'
  | '20px'
  | '21px'
  | '22px'
  | '23px'
  | '24px'
  | '25px'
  | '26px'
  | '27px'
  | '28px'
  | '29px'
  | '30px';
export type CustomColor = string;

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  fontFamily?: CustomFontFamily;
  fontSize?: CustomFontSize;
  color?: CustomColor;
};

export type CustomElementType =
  | 'paragraph'
  | 'block-quote'
  | 'bulleted-list'
  | 'numbered-list'
  | 'list-item'
  | 'heading-one'
  | 'heading-two';

export type CustomElementWithAlign = {
  type: CustomElementType;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: CustomText[];
};

export type CustomElement = CustomElementWithAlign;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type CustomTextKey = keyof Omit<CustomText, 'text'>;
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
