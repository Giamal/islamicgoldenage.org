import type { ReactElement } from "react";

type LongformContentProps = {
  content: string;
  locale: "en" | "it" | "ar";
};

function normalizeBlock(block: string) {
  return block.replace(/\r/g, "").trim();
}

export function LongformContent({ content, locale }: LongformContentProps) {
  const blocks = content
    .split(/\n{2,}/)
    .map(normalizeBlock)
    .filter((block) => block.length > 0);

  if (blocks.length === 0) {
    return null;
  }

  const nodes: ReactElement[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const headingMatch = block.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const headingText = headingMatch[2].trim();
      nodes.push(
        <h3 key={`h-${index}`} className="entity-longform-heading">
          {headingText}
        </h3>,
      );
      continue;
    }

    nodes.push(
      <p key={`p-${index}`} className="entity-longform-paragraph">
        {block}
      </p>,
    );
  }

  return (
    <div className="entity-longform" dir={locale === "ar" ? "rtl" : "ltr"}>
      {nodes}
    </div>
  );
}
