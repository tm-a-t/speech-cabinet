import {MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from '~/components/ui/menubar';
import React from 'react';
import {type DiscoData, getDefaultData, serialize, toDiscoData} from '~/lib/disco-data';
import {downloadFile, formatTime} from '~/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {Button} from '../ui/button';
import {useToast} from "~/lib/hooks/use-toast";

export function FileSubmenu({data, saveData, close}: { data: DiscoData, saveData: (data: DiscoData) => void, close: () => void }) {
  const {toast} = useToast();

  function exportData() {
    const base64 = btoa(serialize(data));
    downloadFile('data:application/json;base64,' + base64, `Disco Download ${formatTime()}.disco`);
  }

  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.disco,.json';
    input.onchange = e => {
      const files = (e.target as HTMLInputElement).files!;
      void files[0]!.text().then(text => {
        const newData = toDiscoData(text);
        if (newData) {
          saveData(newData);
        } else {
          toast({
            title: "Couldn't read the file",
          })
        }
      });
    };
    input.click();
  }

  function handleStartNew() {
    saveData(getDefaultData());
    close();
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <Dialog>
          <DialogTrigger asChild>
            <MenubarItem onSelect={e => e.preventDefault()}>New dialogue</MenubarItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset the dialogue</DialogTitle>
              <DialogDescription>
                You will lose your current lines if you don&apos;t download them first.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-1 mt-5 w-full justify-center sm:justify-start">
              <Button variant="default" onClick={handleStartNew}>Start new</Button>
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