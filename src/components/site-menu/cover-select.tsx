import {
  MenubarCheckboxItem,
  MenubarItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger
} from '~/components/ui/menubar';
import { EditorContent } from '@tiptap/react';
import React, { useContext } from 'react';
import type { DiscoData } from '~/lib/disco-data';
import { addImage } from '~/lib/utils';
import { CoverImageEditorContext } from '~/components/editor/text-editor-provider';

export function CoverSelect({data, saveData}: { data: DiscoData, saveData: (data: DiscoData) => void }) {
  const coverEditor = useContext(CoverImageEditorContext);

  function hideCover() {
    saveData({
      ...data,
      cover: undefined,
    });
    coverEditor?.commands.clearContent();
  }

  function addCover() {
    saveData({
      ...data,
      cover: { content: '' },
    });
    addImage(coverEditor, {
      onCancel() {
        hideCover();
      },
    });
  }


  return data.cover
    ? <MenubarCheckboxItem checked={true} onCheckedChange={hideCover}>
      Image on top
    </MenubarCheckboxItem>
    : <MenubarSub>
      <MenubarSubTrigger inset>
        Image on top
      </MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem onClick={addCover}>Choose...</MenubarItem>
        <EditorContent editor={coverEditor} placeholder="Or paste here" className="text-sm p-2"></EditorContent>
      </MenubarSubContent>
    </MenubarSub>
}