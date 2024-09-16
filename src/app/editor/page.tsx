'use client';


import {Button} from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import React, {useEffect, useState} from 'react';
import {defaultData, SavedData} from '../_lib/data-types';
import {Editor} from '~/app/_components/edit-mode/editor';
import {Player} from '../_components/play-mode/player';
import {DownloadButton} from '../_components/play-mode/download-button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../_components/ui/tabs';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../_components/ui/menubar';
import Link from 'next/link';
import { downloadFile, formatTime } from "../_lib/utils";

export default function EditorPage() {
  const [data, setData] = useState<SavedData | null>(null);

  useEffect(() => {
    if (data === null) {
      const dataSave = JSON.parse(localStorage.getItem('data') ?? 'null') as SavedData;
      if (dataSave) {
        setData(dataSave);
      } else {
        setData(defaultData);
      }
    }
  });

  function saveData(newData: SavedData) {
    setData(newData);
    localStorage.setItem('data', JSON.stringify(newData));
  }

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
    downloadFile('data:application/json;base64,' + base64, `Disco Export ${formatTime()}.json`)
  }

  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const files = (e.target as HTMLInputElement).files!;
      void files[0]!.text().then(text => {
        setData(JSON.parse(text));
      })
    }
    input.click();
  }

  return (
    <Tabs className="w-full h-full m-0" defaultValue="edit">
      <div
        className="fixed z-20 top-0 left-0 right-0 px-2 py-2 flex flex-wrap gap-1 items-center bg-zinc-950 lg:bg-transparent">
        <Dialog>
          <Menubar className=" mr-auto">
            <MenubarMenu>
              <MenubarTrigger>Speech Cabinet</MenubarTrigger>
              <MenubarContent className="w-72">
                  <DialogTrigger asChild>
                    <MenubarItem>
                      About
                    </MenubarItem>
                  </DialogTrigger>
                <MenubarSeparator/>
                <MenubarItem disabled>
                  We don't have anything to talk about anymore.
                  Every combination of words has been played out.
                  The atoms don't form us anymore: us, our love, our unborn daughters.
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-zinc-400">Dialogue</MenubarTrigger>
              {data &&
                <MenubarContent>
                  <MenubarCheckboxItem checked={data.showPortraits} onCheckedChange={saveShowPortraits}>Display
                    portraits</MenubarCheckboxItem>
                  <MenubarSeparator/>
                  <MenubarItem inset>Music</MenubarItem>
                  <MenubarSeparator/>
                  <MenubarItem inset onSelect={exportData}>Export data</MenubarItem>
                  <MenubarItem inset onSelect={importData}>Import data</MenubarItem>
                  <MenubarItem className="text-red-400" inset onSelect={() => setData(defaultData)}>
                    Reset dialogue
                  </MenubarItem>
                </MenubarContent>
              }
            </MenubarMenu>
          </Menubar>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Speech Cabinet</DialogTitle>
            </DialogHeader>
            <p>
              Something!
            </p>
          </DialogContent>
        </Dialog>

        <TabsList>
          <TabsTrigger value="edit">
            Edit
          </TabsTrigger>
          <TabsTrigger value="play">
            Preview
          </TabsTrigger>
        </TabsList>
      </div>

      {data && <>
        <TabsContent value="edit" className="m-0">
          <Editor data={data} saveData={saveData}/>
        </TabsContent>
        <TabsContent value="play">
          <div className="h-full min-h-dvh w-full pb-16">
            <div className="h-[512px] mt-20 lg:mt-4 relative">
              <div
                className="scale-[0.2] w-[1080px] relative -translate-y-[40%] -translate-x-[50%] left-1/2 border-2 box-content">
                <Player data={data}/>
              </div>
            </div>
            <DownloadButton data={data}/>
          </div>
        </TabsContent>
      </>}
    </Tabs>
  );
}

