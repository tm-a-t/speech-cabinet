import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '~/app/_components/ui/menubar';
import {MusicSelect} from '~/app/_components/main-menu/music-select';
import React from 'react';
import type {DiscoData} from '~/app/_lib/data-types';

export function VideoSubmenu({data, saveData, close}: { data: DiscoData, saveData: (data: DiscoData) => void, close: () => void }) {
  function saveShowPortraits(value: boolean) {
    if (data === null) return;
    saveData({
      ...data,
      showPortraits: value,
    });
  }

  function saveSkipMusicIntro(value: boolean) {
    if (data === null) return;
    saveData({
      ...data,
      skipMusicIntro: value,
    });
  }

  function handleSaveMusic(music: string | null) {
    saveData({...data, music});
    close();
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>Options</MenubarTrigger>
      <MenubarContent>
        <MenubarCheckboxItem checked={data.showPortraits} onCheckedChange={saveShowPortraits}>
          Portraits in video
        </MenubarCheckboxItem>
        <MenubarCheckboxItem checked={data.skipMusicIntro} onCheckedChange={saveSkipMusicIntro} disabled={data.music === null}>
          Skip music intro
        </MenubarCheckboxItem>
        <MenubarSeparator/>
        <MusicSelect value={data.music} saveValue={handleSaveMusic}/>
      </MenubarContent>
    </MenubarMenu>
  );
}