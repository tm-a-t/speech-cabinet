import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '~/components/ui/menubar';
import {MusicSelect} from '~/components/site-menu/music-select';
import React from 'react';
import type {DiscoData} from '~/lib/disco-data';
import { CoverSelect } from "~/components/site-menu/cover-select";

export function OptionsSubmenu({data, saveData, close}: { data: DiscoData, saveData: (data: DiscoData) => void, close: () => void }) {
  function setBooleanValue(name: 'showPortraits' | 'skipMusicIntro' | 'showParticles', value: boolean) {
    if (data === null) return;
    saveData({
      ...data,
      [name]: value,
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
        <CoverSelect data={data} saveData={saveData}/>
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