import {
  MenubarCheckboxItem,
  MenubarContent, MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '~/app/_components/ui/menubar';
import {MusicSelect} from '~/app/_components/main-menu/music-select';
import React from 'react';
import {defaultData, DiscoData} from '~/app/_lib/data-types';
import {downloadFile, formatTime} from '~/app/_lib/utils';

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
      <MenubarTrigger className="text-zinc-400">Options</MenubarTrigger>
      <MenubarContent>
        <MenubarCheckboxItem checked={data.showPortraits} onCheckedChange={saveShowPortraits}>
          Display portraits
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