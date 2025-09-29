import React, { useMemo } from "react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import {
  CustomElement,
  CustomElementWithAlign,
} from "./custom-types.d";

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
  content,
  className = "",
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Convert string to Slate value for display
  const slateValue = useMemo(() => {
    if (!content) {
      return [
        {
          type: "paragraph" as const,
          children: [{ text: "" }],
        },
      ];
    }

    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      const paragraphs = content.split("\n").map((line) => ({
        type: "paragraph" as const,
        children: [{ text: line }],
      }));

      return paragraphs.length > 0
        ? paragraphs
        : [
          {
            type: "paragraph" as const,
            children: [{ text: "" }],
          },
        ];
    }

    return [
      {
        type: "paragraph" as const,
        children: [{ text: content }],
      },
    ];
  }, [content]);

  const renderElement = React.useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );

  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  return (
    <div className={`prose max-w-none ${className}`}>
      <Slate editor={editor} initialValue={slateValue} key={content}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly
          className="focus:outline-none text-gray-800 leading-relaxed"
        />
      </Slate>
    </div>
  );
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align as "left" | "center" | "right" | "justify";
  }

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={style}
          {...attributes}
          className="border-l-4 border-gray-300 pl-4 italic my-4"
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul
          style={style}
          {...attributes}
          className="list-disc list-inside my-4 space-y-1"
        >
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes} className="text-2xl font-bold my-4">
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2
          style={style}
          {...attributes}
          className="text-xl font-semibold my-3"
        >
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes} className="my-1">
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol
          style={style}
          {...attributes}
          className="list-decimal list-inside my-4 space-y-1"
        >
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong className="font-bold">{children}</strong>;
  }

  if (leaf.code) {
    children = (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  if (leaf.italic) {
    children = <em className="italic">{children}</em>;
  }

  if (leaf.underline) {
    children = <u className="underline">{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const isAlignElement = (
  element: CustomElement
): element is CustomElementWithAlign => {
  return "align" in element;
};

export default RichTextDisplay;
