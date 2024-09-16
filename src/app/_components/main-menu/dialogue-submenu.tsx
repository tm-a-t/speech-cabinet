import {
  MenubarCheckboxItem,
  MenubarContent, MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '~/app/_components/ui/menubar';
import {MusicSelect} from '~/app/_components/main-menu/music-select';
import React from 'react';
import {defaultData, SavedData} from '~/app/_lib/data-types';
import {downloadFile, formatTime} from '~/app/_lib/utils';

export function DialogueSubmenu({data, saveData}: { data: SavedData, saveData: (data: SavedData) => void }) {
  function saveShowPortraits(value: boolean) {
    if (data === null) {
      return;
    }
    saveData({
      ...data,
      showPortraits: value,
    });
  }

  function exportData() {
    const base64 = btoa(JSON.stringify(data));
    downloadFile('data:application/json;base64,' + base64, `Disco Export ${formatTime()}.json`);
  }

  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const files = (e.target as HTMLInputElement).files!;
      void files[0]!.text().then(text => {
        saveData(JSON.parse(text));
      });
    };
    input.click();
  }

  return (
    <MenubarMenu>
      <MenubarTrigger className="text-zinc-400">Dialogue</MenubarTrigger>
      <MenubarContent>
        <MenubarItem inset onSelect={() => saveData(defaultData)}>New dialogue</MenubarItem>
        <MenubarItem inset onSelect={importData}>Open...</MenubarItem>
        <MenubarItem inset onSelect={exportData}>Download</MenubarItem>
        <MenubarSeparator/>
        <MenubarCheckboxItem checked={data.showPortraits} onCheckedChange={saveShowPortraits}>
          Display portraits
        </MenubarCheckboxItem>
        <MenubarSeparator/>
        <MusicSelect value={data.music} saveValue={(music) => saveData({...data, music})}/>
      </MenubarContent>
    </MenubarMenu>
  );
}