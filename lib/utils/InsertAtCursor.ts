import { InputRef } from 'antd';
import { TextAreaRef } from 'antd/es/input/TextArea';

export const InsertAtCursor = (
  inputRef: React.RefObject<InputRef | TextAreaRef>,
  text: string,
  value: string,
  type: 'input' | 'textarea'
) => {
  let input: HTMLInputElement | HTMLTextAreaElement | null = null;

  if (type === 'input') {
    const maybeInput = inputRef.current as InputRef | null;
    input = maybeInput?.input ?? null;
  } else {
    const maybeTextarea = inputRef.current as TextAreaRef | null;
    input = maybeTextarea?.resizableTextArea?.textArea ?? null;
  }
  if (!input) return;

  const start = input.selectionStart;
  const end = input.selectionEnd;
  const newValue = value.slice(0, start) + `[${text}]` + value.slice(end);

  setTimeout(() => {
    input.focus();
    input.setSelectionRange(start + text.length + 2, start + text.length + 2);
  }, 0);
  return newValue;
};
