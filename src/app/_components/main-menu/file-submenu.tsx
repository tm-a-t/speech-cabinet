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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/app/_components/ui/dialog';
import { Button } from '../ui/button';

export function FileSubmenu({data, saveData}: { data: DiscoData, saveData: (data: DiscoData) => void }) {
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
        <Dialog>
          <DialogTrigger asChild>
            <MenubarItem onSelect={e => e.preventDefault()}>New dialogue</MenubarItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset the dialogue</DialogTitle>
            </DialogHeader>
            <p className="text-center sm:text-left">You will lose your current lines if you don&apos;t download them first.</p>
            <div className="flex flex-wrap gap-1 mt-4 w-full justify-center sm:justify-start">
              <DialogClose asChild>
                <Button variant="default" onClick={() => saveData(defaultData)}>Start new</Button>
              </DialogClose>
              <Button variant="secondary" onClick={exportData}>Download current</Button>
            </div>
          </DialogContent>
        </Dialog>
        <MenubarItem onSelect={importData}>Open...</MenubarItem>
        <MenubarItem onSelect={exportData}>Download</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}