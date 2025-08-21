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
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const TextEditorContext = createContext<Editor | null>(null);

export function TextEditorProvider(props: { children: ReactNode, content: string, placeholder: string, onUpdate: (value: string) => void, allowOnlyImage?: boolean }) {
  const isDesktop = useIsDesktop();
  const handleUpdate = ({editor}: EditorEvents['update']) => {
    props.onUpdate(editor.getHTML());
  };

  const editor = useEditor({
    immediatelyRender: false,
    onUpdate: props.allowOnlyImage ? handleUpdate : debounce(handleUpdate),
    autofocus: isDesktop ? 'end' : false,
    editorProps: {
      attributes: {
        class: 'inline min-w-20',
      },
    },
    extensions: [
      Placeholder.configure({
        placeholder: props.placeholder,
      }),
      History,
      props.allowOnlyImage ? Document.extend({content: 'paragraph|image'}) : Document,
      Text,
      props.allowOnlyImage ? AlwaysEmptyParagraph : Paragraph,
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

const ExtendedImage = Image.extend({
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

const AlwaysEmptyParagraph = Paragraph.extend({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("disallowTyping"),
        props: {
          handleTextInput: () => true,
          handlePaste: (view, event) => [...event.clipboardData?.items ?? []].some(item => item.type == "text/html"),
        },
      }),
    ]
  }
});
