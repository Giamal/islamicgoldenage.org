import type { ReactNode } from "react";

import {
  parseRichTextDocument,
  type RichTextMark,
  type RichTextNode,
} from "@/lib/rich-text/body-content";

type RichContentRendererProps = {
  content: string;
  locale: "en" | "it" | "ar";
};

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function renderTextWithMarks(
  text: string,
  marks: RichTextMark[] | undefined,
  key: string,
): ReactNode {
  let node: ReactNode = text;

  for (const [index, mark] of (marks ?? []).entries()) {
    if (mark.type === "bold") {
      node = <strong key={`${key}-b-${index}`}>{node}</strong>;
      continue;
    }
    if (mark.type === "italic") {
      node = <em key={`${key}-i-${index}`}>{node}</em>;
      continue;
    }
    if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
      node = (
        <a
          key={`${key}-l-${index}`}
          href={href}
          target={isExternalHref(href) ? "_blank" : undefined}
          rel={isExternalHref(href) ? "noreferrer noopener" : undefined}
          className="underline underline-offset-2 hover:text-[var(--accent)]"
        >
          {node}
        </a>
      );
    }
  }

  return node;
}

function renderChildren(children: RichTextNode[] | undefined, prefix: string): ReactNode[] {
  return (children ?? []).map((child, index) =>
    renderNode(child, `${prefix}-${index}`),
  );
}

function renderImage(node: RichTextNode, key: string) {
  const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
  if (!src) {
    return null;
  }

  const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
  const caption =
    typeof node.attrs?.caption === "string" ? node.attrs.caption : "";
  const credit =
    typeof node.attrs?.credit === "string" ? node.attrs.credit : "";
  const source =
    typeof node.attrs?.source === "string" ? node.attrs.source : "";

  return (
    <figure key={key} className="entity-rich-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="entity-rich-image" />
      {caption || credit || source ? (
        <figcaption className="entity-rich-caption">
          {caption ? <span className="entity-rich-caption-main">{caption}</span> : null}
          {credit ? <span className="entity-rich-caption-meta">Credit: {credit}</span> : null}
          {source ? <span className="entity-rich-caption-meta">Source: {source}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

function renderNode(node: RichTextNode, key: string): ReactNode {
  if (node.type === "text") {
    return (
      <span key={key}>
        {renderTextWithMarks(node.text ?? "", node.marks, key)}
      </span>
    );
  }

  if (node.type === "paragraph") {
    return <p key={key}>{renderChildren(node.content, key)}</p>;
  }

  if (node.type === "heading") {
    const level = Math.min(
      4,
      Math.max(
        1,
        typeof node.attrs?.level === "number" ? node.attrs.level : 2,
      ),
    );

    if (level === 1) {
      return <h1 key={key}>{renderChildren(node.content, key)}</h1>;
    }
    if (level === 2) {
      return <h2 key={key}>{renderChildren(node.content, key)}</h2>;
    }
    if (level === 3) {
      return <h3 key={key}>{renderChildren(node.content, key)}</h3>;
    }
    return <h4 key={key}>{renderChildren(node.content, key)}</h4>;
  }

  if (node.type === "bulletList") {
    return <ul key={key}>{renderChildren(node.content, key)}</ul>;
  }

  if (node.type === "orderedList") {
    return <ol key={key}>{renderChildren(node.content, key)}</ol>;
  }

  if (node.type === "listItem") {
    return <li key={key}>{renderChildren(node.content, key)}</li>;
  }

  if (node.type === "blockquote") {
    return <blockquote key={key}>{renderChildren(node.content, key)}</blockquote>;
  }

  if (node.type === "horizontalRule") {
    return <hr key={key} />;
  }

  if (node.type === "image") {
    return renderImage(node, key);
  }

  return <div key={key}>{renderChildren(node.content, key)}</div>;
}

export function RichContentRenderer({ content, locale }: RichContentRendererProps) {
  const document = parseRichTextDocument(content);
  if (!document?.content) {
    return null;
  }

  return (
    <div className="entity-rich-content" dir={locale === "ar" ? "rtl" : "ltr"}>
      {document.content.map((node, index) => renderNode(node, `node-${index}`))}
    </div>
  );
}
