import {
  MenubarCheckboxItem,
  MenubarContent, MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "~/components/ui/menubar";
import {MusicSelect} from '~/components/site-menu/music-select';
import React, { useContext } from 'react';
import type {DiscoData} from '~/lib/disco-data';
import { CoverImageEditorContext } from "~/components/editor/text-editor-provider";
import { addImage } from "~/lib/utils";
import { EditorContent } from "@tiptap/react";

export function VideoSubmenu({data, saveData, close}: { data: DiscoData, saveData: (data: DiscoData) => void, close: () => void }) {
  const coverEditor = useContext(CoverImageEditorContext);
  const hasCover = data.cover !== undefined;

  function setBooleanValue(name: 'showPortraits' | 'skipMusicIntro' | 'showParticles', value: boolean) {
    if (data === null) return;
    saveData({
      ...data,
      [name]: value,
    });
  }

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

  function handleSaveMusic(music: string | null) {
    saveData({...data, music});
    close();
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>
        {/*<Settings2 className="w-4 h-4 sm:hidden text-zinc-400"/>*/}
        Options
      </MenubarTrigger>
      <MenubarContent>
        {hasCover
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
        <MenubarCheckboxItem checked={data.showPortraits} onCheckedChange={v => setBooleanValue('showPortraits', v)}>
          Portraits
        </MenubarCheckboxItem>
        <MenubarCheckboxItem checked={data.showParticles} onCheckedChange={v => setBooleanValue('showParticles', v)}>
          Animated particles
        </MenubarCheckboxItem>
        <MenubarSeparator/>
        <MusicSelect value={data.music} saveValue={handleSaveMusic}/>
        <MenubarSeparator/>
        <MenubarCheckboxItem checked={data.skipMusicIntro} onCheckedChange={v => setBooleanValue('skipMusicIntro', v)} disabled={data.music === null}>
          Skip music intro
        </MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  );
}