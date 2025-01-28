'use client';

import {useEditor, EditorContent, type EditorEvents} from '@tiptap/react';
import {Paragraph} from '@tiptap/extension-paragraph';
import {Document} from '@tiptap/extension-document';
import {Text} from '@tiptap/extension-text';
import {Placeholder} from '@tiptap/extension-placeholder';
import History from '@tiptap/extension-history';
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
        placeholder: 'Type a line...',
      }),
      History,
      Document,
      Text,
      Paragraph,
    ],
    content: props.content || '',
  });

  return <EditorContent editor={editor}
                        className={cn("sm:inline [&_p:not(:first-child)]:mt-4 sm:[&_p:first-child]:inline")}/>;
}
