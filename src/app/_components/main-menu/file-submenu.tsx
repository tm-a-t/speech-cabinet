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

export function FileSubmenu({data, saveData}: { data: DiscoData, saveData: (data: DiscoData) => void }) {
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
    downloadFile('data:application/json;base64,' + base64, `Disco Download ${formatTime()}.disco`);
  }

  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.disco';
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
      <MenubarTrigger className="text-zinc-400">File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onSelect={() => saveData(defaultData)}>New dialogue</MenubarItem>
        <MenubarItem onSelect={importData}>Open...</MenubarItem>
        <MenubarItem onSelect={exportData}>Download</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}