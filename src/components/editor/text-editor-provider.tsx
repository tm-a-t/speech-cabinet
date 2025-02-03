import { Editor, type EditorEvents, useEditor } from "@tiptap/react";
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
import FileHandler from "@tiptap-pro/extension-file-handler";
import { useIsDesktop } from "~/lib/hooks/use-media-query";

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
      Image.configure({
        allowBase64: true,
      }),
      Focus.configure({
        className: 'is-active',
      }),
      Dropcursor,
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (currentEditor, files, pos) => {
          files.forEach(file => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor.chain().insertContentAt(pos, {
                type: 'image',
                attrs: {
                  src: fileReader.result,
                },
              }).focus().run();
            }
          })
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach(file => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              console.log(htmlContent);
              return false;
            }

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
                type: 'image',
                attrs: {
                  src: fileReader.result,
                },
              }).focus().run();
            }
          })
        },
      }),
    ],
    content: props.content || '',
  });

  return (
    <TextEditorContext.Provider value={editor}>
      {props.children}
    </TextEditorContext.Provider>
  )
}
