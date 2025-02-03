'use client';

import {useEditor, EditorContent, type EditorEvents} from '@tiptap/react';
import {Paragraph} from '@tiptap/extension-paragraph';
import {Document} from '@tiptap/extension-document';
import {Text} from '@tiptap/extension-text';
import {Placeholder} from '@tiptap/extension-placeholder';
import History from '@tiptap/extension-history';
import Image from '@tiptap/extension-image';
import FileHandler from '@tiptap-pro/extension-file-handler';
import Focus from '@tiptap/extension-focus';
import Dropcursor from '@tiptap/extension-dropcursor';
import {cn, debounce} from '~/lib/utils';
import {useIsDesktop} from '~/lib/hooks/use-media-query';

export function MessageTextEditor(props: { content: string, onUpdate: (value: string) => void }) {
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
        className: 'outline outline-white',
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

  function addImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (!editor) return;
        const source = fileReader.result;
        if (!source) return;
        const src = typeof source === 'string' ? source : Buffer.from(source).toString();
        editor.chain().focus().setImage({ src: src }).run();
      };
    };
    fileInput.click();
  }

  return <EditorContent editor={editor}
                        className={cn("sm:inline [&_p:not(:first-child)]:mt-4 sm:[&_p:first-child]:inline [&_img]:w-full [&_img]:mt-1")}/>
}
