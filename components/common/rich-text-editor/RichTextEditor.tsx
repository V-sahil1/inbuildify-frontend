'use client';

import React, { KeyboardEvent, MouseEvent, useCallback, useMemo } from 'react';
import { Descendant, Editor, Element as SlateElement, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from 'slate-react';
import { Button, Toolbar } from './components';
import {
  CustomEditor,
  CustomElement,
  CustomElementType,
  CustomElementWithAlign,
  CustomTextKey,
  CustomFontFamily,
  CustomFontSize,
  CustomText,
} from './custom-types.d';
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconUnderline,
} from '@tabler/icons-react';

const HOTKEYS: Record<string, CustomTextKey> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const;
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const;

type AlignType = (typeof TEXT_ALIGN_TYPES)[number];
type ListType = (typeof LIST_TYPES)[number];
type CustomElementFormat = CustomElementType | AlignType | ListType;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter your message...',
  maxHeight = '300px',
}) => {
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const slateValue = useMemo(() => {
    if (!value) {
      return [
        {
          type: 'paragraph' as const,
          children: [{ text: '' }],
        },
      ];
    }

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      const paragraphs = value.split('\n').map(line => ({
        type: 'paragraph' as const,
        children: [{ text: line }],
      }));

      return paragraphs.length > 0
        ? paragraphs
        : [
            {
              type: 'paragraph' as const,
              children: [{ text: '' }],
            },
          ];
    }

    return [
      {
        type: 'paragraph' as const,
        children: [{ text: value }],
      },
    ];
  }, [value]);

  const serialize = (nodes: Descendant[]): string => {
    return nodes
      .map(node => {
        if (Editor.isEditor(node)) return serialize(node.children);

        if ('text' in node) {
          let text = node.text;
          if ((node as any).bold) text = `<strong>${text}</strong>`;
          if ((node as any).italic) text = `<em>${text}</em>`;
          if ((node as any).underline) text = `<u>${text}</u>`;
          if ((node as any).color)
            text = `<span style="color:${(node as any).color}">${text}</span>`;
          if ((node as any).fontFamily)
            text = `<span style="font-family:${(node as any).fontFamily}">${text}</span>`;
          if ((node as any).fontSize)
            text = `<span style="font-size:${(node as any).fontSize}">${text}</span>`;
          return text;
        }

        const children = serialize(node.children);
        switch ((node as any).type) {
          case 'paragraph':
            return `<p>${children}</p>`;
          case 'heading-one':
            return `<h1>${children}</h1>`;
          case 'heading-two':
            return `<h2>${children}</h2>`;
          case 'bulleted-list':
            return `<ul>${children}</ul>`;
          case 'numbered-list':
            return `<ol>${children}</ol>`;
          case 'list-item':
            return `<li>${children}</li>`;
          case 'block-quote':
            return `<blockquote>${children}</blockquote>`;
          default:
            return `<div>${children}</div>`;
        }
      })
      .join('');
  };

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      const html = serialize(newValue);
      onChange(html);
    },
    [onChange]
  );

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Slate editor={editor} initialValue={slateValue} onChange={handleChange}>
        <Toolbar>
          <MarkButton format="bold" icon={<IconBold className="w-4 h-4" />} />
          <MarkButton format="italic" icon={<IconItalic className="w-4 h-4" />} />
          <MarkButton format="underline" icon={<IconUnderline className="w-4 h-4" />} />
          <MarkButton format="code" icon={<IconStrikethrough className="w-4 h-4" />} />
          <MarkSelect<CustomFontFamily>
            format="fontFamily"
            options={['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New']}
            placeholder="Font"
          />
          <MarkSelect<CustomFontSize>
            format="fontSize"
            options={[
              '12px',
              '13px',
              '14px',
              '15px',
              '16px',
              '17px',
              '18px',
              '19px',
              '20px',
              '21px',
              '22px',
              '23px',
              '24px',
              '25px',
              '26px',
              '27px',
              '28px',
              '29px',
              '30px',
            ]}
            placeholder="Size"
          />
          <input
            type="color"
            value={Editor.marks(editor)?.color || '#000000'}
            onChange={e => {
              Editor.addMark(editor, 'color', e.target.value);
            }}
            className="w-7 h-8 cursor-pointer rounded-xl"
          />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <BlockButton format="left" icon={<IconAlignLeft className="w-4 h-4" />} />
          <BlockButton format="center" icon={<IconAlignCenter className="w-4 h-4" />} />
          <BlockButton format="right" icon={<IconAlignRight className="w-4 h-4" />} />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <BlockButton format="bulleted-list" icon={<IconList className="w-4 h-4" />} />
          <BlockButton format="numbered-list" icon={<IconListNumbers className="w-4 h-4" />} />
        </Toolbar>
        <div
          className="p-4"
          style={{
            maxHeight: maxHeight,
            overflowY: 'auto',
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            className="focus:outline-none"
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              for (const hotkey in HOTKEYS) {
                if (event.key === hotkey) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
        </div>
      </Slate>
    </div>
  );
};

const toggleBlock = (editor: CustomEditor, format: CustomElementFormat) => {
  const isActive = isBlockActive(editor, format, isAlignType(format) ? 'align' : 'type');
  const isList = isListType(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      isListType(n.type) &&
      !isAlignType(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: CustomEditor,
  format: CustomElementFormat,
  blockType: 'type' | 'align' = 'type'
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === 'align' && isAlignElement(n)) {
            return n.align === format;
          }
          return n.type === format;
        }
        return false;
      },
    })
  );

  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align as AlignType;
  }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          style={style}
          {...attributes}
          className="border-l-4 border-gray-300 pl-4 italic"
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes} className="list-disc list-inside">
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes} className="text-2xl font-bold">
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes} className="text-xl font-semibold">
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes} className="list-decimal list-inside">
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes} className="mb-2">
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code className="bg-gray-100 px-1 rounded">{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.fontFamily) {
    children = <span style={{ fontFamily: leaf.fontFamily }}>{children}</span>;
  }

  if (leaf.fontSize) {
    children = <span style={{ fontSize: leaf.fontSize }}>{children}</span>;
  }

  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
};

interface BlockButtonProps {
  format: CustomElementFormat;
  icon: React.ReactNode;
}

const BlockButton = ({ format, icon }: BlockButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format, isAlignType(format) ? 'align' : 'type')}
      onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

interface MarkButtonProps {
  format: CustomTextKey;
  icon: React.ReactNode;
}

const MarkButton = ({ format, icon }: MarkButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

interface MarkSelectProps<T extends string> {
  format: keyof CustomText;
  options: T[];
  placeholder: string;
}

const MarkSelect = <T extends string>({ format, options, placeholder }: MarkSelectProps<T>) => {
  const editor = useSlate();
  const marks = Editor.marks(editor);
  const activeValue = marks && marks[format] ? (marks[format] as T) : '';

  const handleChange = (value: T) => {
    Editor.removeMark(editor, format);
    Editor.addMark(editor, format, value);
  };

  return (
    <select
      value={activeValue}
      onChange={e => handleChange(e.target.value as T)}
      className="p-1 rounded border border-gray-300 max-w-[50px] focus:outline-none"
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const isAlignType = (format: CustomElementFormat): format is AlignType => {
  return TEXT_ALIGN_TYPES.includes(format as AlignType);
};

const isListType = (format: CustomElementFormat): format is ListType => {
  return LIST_TYPES.includes(format as ListType);
};

const isAlignElement = (element: CustomElement): element is CustomElementWithAlign => {
  return 'align' in element;
};

export default RichTextEditor;
