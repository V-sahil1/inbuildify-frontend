'use client';

import React, { KeyboardEvent, MouseEvent, useCallback, useMemo, useRef } from 'react';
import { Descendant, Editor, Element as SlateElement, Transforms, createEditor } from 'slate';
import DOMPurify from 'dompurify';
import { jsx } from 'slate-hyperscript';
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

/** ✅ Safe marks helper */
const safeMarks = (editor: Editor) => {
  if (!editor.selection) return null;
  try {
    return Editor.marks(editor) || null;
  } catch {
    return null;
  }
};

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
    if (!value) return [{ type: 'paragraph', children: [{ text: '' }] }];

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      if (/<[a-z][\s\S]*>/i.test(value)) return deserialize(value);
    }

    return [{ type: 'paragraph', children: [{ text: value }] }];
  }, [value]);

  const initialValueRef = useRef(slateValue);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      const html = serialize(newValue);
      const clean = DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
        FORBID_CONTENTS: ['script', 'style'],
      });
      onChange(clean);
    },
    [onChange]
  );

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Slate editor={editor} initialValue={initialValueRef.current} onChange={handleChange}>
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
            options={Array.from({ length: 19 }, (_, i) => `${12 + i}px` as CustomFontSize)}
            placeholder="Size"
          />

          <input
            type="color"
            value={safeMarks(editor)?.color || '#000000'}
            onChange={e => {
              if (!editor.selection) return;
              try {
                Editor.addMark(editor, 'color', e.target.value);
                Editor.normalize(editor, { force: true });
              } catch {}
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

        <div className="p-4" style={{ maxHeight, overflowY: 'auto' }}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            className="focus:outline-none"
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              for (const hotkey in HOTKEYS) {
                if (event.metaKey && event.key === hotkey.replace('mod+', '')) {
                  event.preventDefault();
                  toggleMark(editor, HOTKEYS[hotkey]);
                }
              }
            }}
          />
        </div>
      </Slate>
    </div>
  );
};

/** ---------------- Helper Functions ---------------- */

const deserialize = (html: string): Descendant[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const walk = (el: Node): any => {
    if (el.nodeType === 3) {
      const text = el.textContent || '';
      return text.trim() ? { text } : null;
    }

    if (!(el instanceof HTMLElement)) return null;

    let children = Array.from(el.childNodes).map(walk).flat().filter(Boolean);

    if (children.length === 0) {
      children = [{ text: '' }];
    }

    switch (el.nodeName) {
      case 'BODY':
        return children;
      case 'P':
        return { type: 'paragraph', children };
      case 'H1':
        return { type: 'heading-one', children };
      case 'H2':
        return { type: 'heading-two', children };
      case 'STRONG':
        return children.map((child: any) => ({ ...child, bold: true }));
      case 'EM':
        return children.map((child: any) => ({ ...child, italic: true }));
      case 'U':
        return children.map((child: any) => ({ ...child, underline: true }));
      case 'UL':
        return { type: 'bulleted-list', children };
      case 'OL':
        return { type: 'numbered-list', children };
      case 'LI':
        return { type: 'list-item', children };
      default:
        return children;
    }
  };

  const result = walk(doc.body);

  return Array.isArray(result) ? result : [result];
};

const serialize = (nodes: Descendant[]): string =>
  nodes
    .map(node => {
      if (Editor.isEditor(node)) return serialize(node.children);

      if ('text' in node) {
        let text = node.text;
        if ((node as any).bold) text = `<strong>${text}</strong>`;
        if ((node as any).italic) text = `<em>${text}</em>`;
        if ((node as any).underline) text = `<u>${text}</u>`;
        if ((node as any).color) text = `<span style="color:${(node as any).color}">${text}</span>`;
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

const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
  if (!editor.selection) return;
  try {
    const marks = Editor.marks(editor) || {};
    const active = marks[format] === true;

    if (active) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }

    Editor.normalize(editor, { force: true });
  } catch {}
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

const isBlockActive = (
  editor: CustomEditor,
  format: CustomElementFormat,
  type: 'type' | 'align'
) => {
  if (!editor.selection) return false;
  try {
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, editor.selection),
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (type === 'align' ? (n as any).align === format : (n as any).type === format),
      })
    );
    return !!match;
  } catch {
    return false;
  }
};

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
  if (!editor.selection) return false;
  try {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  } catch {
    return false;
  }
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) style.textAlign = element.align as AlignType;

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
      onMouseDown={(e: MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
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
      onMouseDown={(e: MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
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
  const marks = safeMarks(editor);
  const activeValue = marks && marks[format] ? (marks[format] as T) : '';

  return (
    <select
      value={activeValue}
      onChange={e => {
        if (!editor.selection) return;
        try {
          Editor.removeMark(editor, format);
          Editor.addMark(editor, format, e.target.value as T);
          Editor.normalize(editor, { force: true });
        } catch {}
      }}
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

const isAlignType = (format: CustomElementFormat): format is AlignType =>
  TEXT_ALIGN_TYPES.includes(format as AlignType);

const isListType = (format: CustomElementFormat): format is ListType =>
  LIST_TYPES.includes(format as ListType);

const isAlignElement = (element: CustomElement): element is CustomElementWithAlign =>
  'align' in element;

export default RichTextEditor;
