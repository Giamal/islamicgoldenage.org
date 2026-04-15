export type RichTextMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type RichTextNode = {
  type: string;
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: RichTextMark[];
  content?: RichTextNode[];
};

export type RichTextDocument = {
  type: "doc";
  content?: RichTextNode[];
};

function createTextNode(text: string, marks?: RichTextMark[]): RichTextNode {
  return {
    type: "text",
    text,
    marks: marks && marks.length > 0 ? marks : undefined,
  };
}

function parseInlineMarkdown(value: string): RichTextNode[] {
  const content: RichTextNode[] = [];
  const tokenPattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|_([^_]+)_|\*([^*]+)\*)/g;
  let cursor = 0;

  for (const match of value.matchAll(tokenPattern)) {
    const tokenStart = match.index ?? 0;
    if (tokenStart > cursor) {
      const chunk = value.slice(cursor, tokenStart);
      if (chunk.length > 0) {
        content.push(createTextNode(chunk));
      }
    }

    const [token] = match;
    const linkLabel = match[2];
    const linkHref = match[3];
    const boldText = match[4];
    const italicUnderscoreText = match[5];
    const italicAsteriskText = match[6];

    if (linkLabel && linkHref) {
      content.push(
        createTextNode(linkLabel, [{ type: "link", attrs: { href: linkHref.trim() } }]),
      );
    } else if (boldText) {
      content.push(createTextNode(boldText, [{ type: "bold" }]));
    } else {
      const italicText = italicUnderscoreText || italicAsteriskText;
      if (italicText) {
        content.push(createTextNode(italicText, [{ type: "italic" }]));
      } else if (token.length > 0) {
        content.push(createTextNode(token));
      }
    }

    cursor = tokenStart + token.length;
  }

  if (cursor < value.length) {
    const tail = value.slice(cursor);
    if (tail.length > 0) {
      content.push(createTextNode(tail));
    }
  }

  return content.length > 0 ? content : [createTextNode(value)];
}

function buildParagraphNode(text: string): RichTextNode {
  return {
    type: "paragraph",
    content: parseInlineMarkdown(text),
  };
}

function toLegacyNodes(value: string): RichTextNode[] {
  const normalized = value.replace(/\r/g, "").trim();
  if (normalized.length === 0) {
    return [{ type: "paragraph", content: [] }];
  }

  const nodes: RichTextNode[] = [];
  const lines = normalized.split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trimEnd();
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      index += 1;
      continue;
    }

    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      nodes.push({ type: "horizontalRule" });
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      nodes.push({
        type: "heading",
        attrs: { level: Math.min(6, headingMatch[1].length) },
        content: parseInlineMarkdown(headingMatch[2].trim()),
      });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (index < lines.length) {
        const quoteCandidate = lines[index].trim();
        if (!/^>\s?/.test(quoteCandidate)) {
          break;
        }
        quoteLines.push(quoteCandidate.replace(/^>\s?/, ""));
        index += 1;
      }
      nodes.push({
        type: "blockquote",
        content: [buildParagraphNode(quoteLines.join(" ").trim())],
      });
      continue;
    }

    const bulletListMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (bulletListMatch) {
      const items: RichTextNode[] = [];
      while (index < lines.length) {
        const itemMatch = lines[index].trim().match(/^[-*+]\s+(.+)$/);
        if (!itemMatch) {
          break;
        }
        items.push({
          type: "listItem",
          content: [buildParagraphNode(itemMatch[1].trim())],
        });
        index += 1;
      }
      nodes.push({ type: "bulletList", content: items });
      continue;
    }

    const orderedListMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (orderedListMatch) {
      const items: RichTextNode[] = [];
      while (index < lines.length) {
        const itemMatch = lines[index].trim().match(/^\d+[.)]\s+(.+)$/);
        if (!itemMatch) {
          break;
        }
        items.push({
          type: "listItem",
          content: [buildParagraphNode(itemMatch[1].trim())],
        });
        index += 1;
      }
      nodes.push({ type: "orderedList", content: items });
      continue;
    }

    const paragraphLines: string[] = [trimmed];
    index += 1;
    while (index < lines.length) {
      const candidate = lines[index].trim();
      if (
        candidate.length === 0 ||
        /^(-{3,}|_{3,}|\*{3,})$/.test(candidate) ||
        /^(#{1,6})\s+(.+)$/.test(candidate) ||
        /^>\s?/.test(candidate) ||
        /^[-*+]\s+/.test(candidate) ||
        /^\d+[.)]\s+/.test(candidate)
      ) {
        break;
      }
      paragraphLines.push(candidate);
      index += 1;
    }
    nodes.push(buildParagraphNode(paragraphLines.join(" ")));
  }

  return nodes.length > 0 ? nodes : [{ type: "paragraph", content: [] }];
}

export function parseRichTextDocument(value: string): RichTextDocument | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { type: "doc", content: [{ type: "paragraph", content: [] }] };
  }

  try {
    const parsed = JSON.parse(trimmed) as RichTextDocument;
    if (parsed && parsed.type === "doc" && Array.isArray(parsed.content)) {
      return parsed;
    }
  } catch {
    // Fallback to legacy text conversion.
  }

  return {
    type: "doc",
    content: toLegacyNodes(value),
  };
}

export function stringifyRichTextDocument(doc: RichTextDocument): string {
  return JSON.stringify(doc);
}
