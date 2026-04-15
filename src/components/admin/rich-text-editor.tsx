"use client";

import { useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import type { MediaAsset } from "@/lib/media/types";
import { MediaPicker } from "@/components/admin/media-picker";
import {
  parseRichTextDocument,
  stringifyRichTextDocument,
} from "@/lib/rich-text/body-content";

type RichTextEditorProps = {
  name: string;
  initialValue: string;
  locale: "en" | "it" | "ar";
};

const EditorialImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
      },
      credit: {
        default: "",
      },
      source: {
        default: "",
      },
      mimeType: {
        default: "",
      },
    };
  },
});

export function RichTextEditor({
  name,
  initialValue,
  locale,
}: RichTextEditorProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [linkDraft, setLinkDraft] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const initialDocument = useMemo(
    () => parseRichTextDocument(initialValue),
    [initialValue],
  );
  const [serializedValue, setSerializedValue] = useState(
    initialDocument ? stringifyRichTextDocument(initialDocument) : "",
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      EditorialImage,
    ],
    content: initialDocument,
    editorProps: {
      attributes: {
        class: "admin-rich-editor-content",
        dir: locale === "ar" ? "rtl" : "ltr",
      },
    },
    onUpdate({ editor: nextEditor }) {
      setSerializedValue(stringifyRichTextDocument(nextEditor.getJSON()));
    },
  });

  function applyLink() {
    if (!editor) {
      return;
    }

    const trimmed = linkDraft.trim();
    if (trimmed.length === 0) {
      editor.chain().focus().unsetLink().run();
      setShowLinkInput(false);
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
    setShowLinkInput(false);
  }

  function openLinkInput() {
    if (!editor) {
      return;
    }

    const current = editor.getAttributes("link").href as string | undefined;
    setLinkDraft(current || "https://");
    setShowLinkInput(true);
  }

  function insertAsset(asset: MediaAsset) {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: {
          src: asset.url,
          alt: asset.alt,
          title: asset.caption || asset.filename,
          caption: asset.caption,
          credit: asset.credit,
          source: asset.source,
          mimeType: asset.mimeType,
        },
      })
      .run();
    setShowMediaPicker(false);
  }

  if (!editor) {
    return <p className="text-xs text-[var(--muted)]">Loading editor...</p>;
  }

  const toolbarButtonClass =
    "rounded border border-[var(--border)] px-2 py-1 text-xs font-semibold hover:border-[var(--accent)]";
  const activeToolbarButtonClass = `${toolbarButtonClass} bg-[var(--surface-muted)]`;

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={serializedValue} />

      <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2.5">
        <div className="admin-rich-editor-toolbar">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? activeToolbarButtonClass : toolbarButtonClass}
          >
            Paragraph
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={
              editor.isActive("heading", { level: 2 })
                ? activeToolbarButtonClass
                : toolbarButtonClass
            }
          >
            Heading
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? activeToolbarButtonClass : toolbarButtonClass}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? activeToolbarButtonClass : toolbarButtonClass}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList") ? activeToolbarButtonClass : toolbarButtonClass
            }
          >
            Bullets
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList") ? activeToolbarButtonClass : toolbarButtonClass
            }
          >
            Numbered
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={
              editor.isActive("blockquote") ? activeToolbarButtonClass : toolbarButtonClass
            }
          >
            Quote
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={toolbarButtonClass}
          >
            Rule
          </button>
          <button
            type="button"
            onClick={openLinkInput}
            className={editor.isActive("link") ? activeToolbarButtonClass : toolbarButtonClass}
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => setShowMediaPicker((value) => !value)}
            className={showMediaPicker ? activeToolbarButtonClass : toolbarButtonClass}
          >
            Media
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className={toolbarButtonClass}
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className={toolbarButtonClass}
          >
            Redo
          </button>
        </div>

        {showLinkInput ? (
          <div className="flex flex-wrap items-center gap-2 rounded border border-[var(--border)] bg-white p-2">
            <input
              value={linkDraft}
              onChange={(event) => setLinkDraft(event.target.value)}
              placeholder="https://example.org"
              className="min-w-[14rem] flex-1 rounded border border-[var(--border)] px-2 py-1 text-xs"
            />
            <button
              type="button"
              onClick={applyLink}
              className="rounded bg-[var(--accent)] px-2 py-1 text-xs font-semibold text-white"
            >
              Apply link
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setShowLinkInput(false);
              }}
              className={toolbarButtonClass}
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>

      {showMediaPicker ? <MediaPicker onInsert={insertAsset} /> : null}
      <EditorContent editor={editor} />
    </div>
  );
}
