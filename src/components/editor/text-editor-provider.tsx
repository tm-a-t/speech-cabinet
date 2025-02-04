import { type Editor, type EditorEvents, useEditor } from "@tiptap/react";
import { createContext, type ReactNode } from 'react';
import { debounce } from "~/lib/utils";
import { Placeholder } from "@tiptap/extension-placeholder";
import History from "@tiptap/extension-history";
import { Document } from "@tiptap/extension-document";
import { Text } from "@tiptap/extension-text";
import { Paragraph } from "@tiptap/extension-paragraph";
import Image from "@tiptap/extension-image";
import Focus from "@tiptap/extension-focus";
import Dropcursor from "@tiptap/extension-dropcursor";
import { useIsDesktop } from "~/lib/hooks/use-media-query";
import { FileHandler } from "./file-handler";
import { mergeAttributes } from "@tiptap/core";

export const TextEditorContext = createContext<Editor | null>(null);

export function TextEditorProvider(props: { children: ReactNode, content: string, onUpdate: (value: string) => void }) {
  const isDesktop = useIsDesktop();

  const editor = useEditor({
    immediatelyRender: false,
    onUpdate: debounce(({editor}: EditorEvents['update']) => {
      props.onUpdate(editor.getHTML());
    }),
    autofocus: isDesktop ? 'end' : false,
    editorProps: {
      attributes: {
        class: 'inline min-w-20',
      },
    },
    extensions: [
      Placeholder.configure({
        placeholder: 'Type a line, or paste an image',
      }),
      History,
      Document,
      Text,
      Paragraph,
      ExtendedImage.configure({
        allowBase64: true,
      }),
      Focus.configure({
        className: 'is-active',
      }),
      Dropcursor,
      FileHandler,
    ],
    content: props.content || '',
  });

  return (
    <TextEditorContext.Provider value={editor}>
      {props.children}
    </TextEditorContext.Provider>
  )
}

export const ExtendedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },
})
