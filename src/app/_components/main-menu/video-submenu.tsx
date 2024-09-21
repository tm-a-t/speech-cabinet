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

export function VideoSubmenu({data, saveData}: { data: DiscoData, saveData: (data: DiscoData) => void }) {
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
        <MusicSelect value={data.music} saveValue={(music) => saveData({...data, music})}/>
      </MenubarContent>
    </MenubarMenu>
  );
}