'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import {Paragraph} from '@tiptap/extension-paragraph';
import {Document} from '@tiptap/extension-document';
import {Text} from '@tiptap/extension-text';
import {Placeholder} from '@tiptap/extension-placeholder';
import {cn} from '~/app/_lib/utils';

function MessageTextEditor(props: {content: string, onUpdate: (value: string) => void}) {
  const editor = useEditor({
    immediatelyRender: false,
    autofocus: 'end',
    onUpdate({ editor }) {
      props.onUpdate(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'inline min-w-20',
      },
    },
    extensions: [
      Placeholder.configure({
        placeholder: 'Type a line...',
      }),
      Document,
      Text,
      Paragraph.configure({
        HTMLAttributes: {
          class: '[&:not(:first-child)]:mt-3 [&:first-child]:inline',
        },
      }),
    ],
    content: props.content,
  })

  return <EditorContent editor={editor} className={cn("inline")}/>
}

export default MessageTextEditor
