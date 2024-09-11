'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import {Paragraph} from '@tiptap/extension-paragraph';
import {Document} from '@tiptap/extension-document';
import {Text} from '@tiptap/extension-text';
import {Placeholder} from '@tiptap/extension-placeholder';

function TextEditor(props: {content: string, onUpdate: (value: string) => void}) {
  const editor = useEditor({
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
        placeholder: 'Some text...',
      }),
      Document,
      Text,
      Paragraph.configure({
        HTMLAttributes: {
          class: 'leading-7 [&:not(:first-child)]:mt-1 [&:first-child]:inline',
        },
      }),
    ],
    content: props.content,
  })

  return <EditorContent editor={editor} className="inline"/>
}

export default TextEditor
