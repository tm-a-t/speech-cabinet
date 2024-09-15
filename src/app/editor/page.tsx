'use client';

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

  return (
    <Tabs className="w-full h-full m-0" defaultValue="edit">
      <div
        className="fixed z-20 top-0 left-0 right-0 px-2 py-2 flex flex-wrap gap-1 items-center bg-zinc-950 lg:bg-transparent">
        <Menubar className=" mr-auto">
          <MenubarMenu>
            <MenubarTrigger>Speech Cabinet</MenubarTrigger>
            <MenubarContent className="w-72">
              <MenubarItem asChild>
                <Link href="/about">About</Link>
              </MenubarItem>
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
                <MenubarCheckboxItem checked={data.showPortraits} onCheckedChange={saveShowPortraits}>Display portraits</MenubarCheckboxItem>
                <MenubarSeparator/>
                <MenubarItem inset>Choose music</MenubarItem>
                <MenubarItem inset>Choose background</MenubarItem>
                <MenubarSeparator/>
                <MenubarItem inset>Export data</MenubarItem>
                <MenubarItem inset>Import data</MenubarItem>
                <MenubarSeparator/>
                <MenubarItem className="text-red-400" inset onSelect={() => setData(defaultData)}>
                  Reset dialogue
                </MenubarItem>
              </MenubarContent>
            }
          </MenubarMenu>
        </Menubar>
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
          <div className="h-full min-h-dvh w-full pb-24">
            <div className="h-[512px] mt-20 relative">
              <div className="scale-[0.4] w-[720px] relative -translate-y-[30%] -translate-x-[50%] left-1/2 shadow-xl">
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

