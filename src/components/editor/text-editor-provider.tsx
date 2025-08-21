import { type Editor, type EditorEvents, useEditor } from "@tiptap/react";
import { type Context, createContext, type ReactNode } from "react";
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

export const MessageEditorContext = createContext<Editor | null>(null);
export const CoverImageEditorContext = createContext<Editor | null>(null);

export function TextEditorProvider(props: { children: ReactNode, context: Context<Editor | null>, content: string, placeholder: string, onUpdate: (value: string, isEmpty: boolean) => void, allowOnlyImage?: boolean }) {
  const isDesktop = useIsDesktop();
  const handleUpdate = ({editor}: EditorEvents['update']) => {
    props.onUpdate(editor.getHTML(), editor.isEmpty);
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
    <props.context.Provider value={editor}>
      {props.children}
    </props.context.Provider>
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
          handlePaste: (view, event) => {
            const items = [...(event.clipboardData?.items ?? [])]
            if (items.some(item => item.type.startsWith('text/'))) {
              return true;
            }
          },
        },
      }),
    ];
  }
});
