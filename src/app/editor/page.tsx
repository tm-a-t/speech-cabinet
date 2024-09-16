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
  MenubarMenu, MenubarRadioGroup, MenubarRadioItem,
  MenubarSeparator, MenubarSub, MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '../_components/ui/menubar';
import Link from 'next/link';
import {downloadFile, formatTime} from "../_lib/utils";
import {ost} from "../_lib/music";
import {MusicSelect} from '~/app/_components/main-menu/music-select';
import {SiteSubmenu} from '~/app/_components/main-menu/site-submenu';
import {DialogueSubmenu} from '~/app/_components/main-menu/dialogue-submenu';

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

  return (
    <Tabs className="w-full h-full m-0" defaultValue="edit">
      <div
        className="fixed z-20 top-0 left-0 right-0 px-2 py-2 flex flex-wrap gap-1 items-center bg-zinc-950 lg:bg-transparent">
        <Menubar className="mr-auto">
          <SiteSubmenu data={data} saveData={saveData}/>
          {data &&
            <DialogueSubmenu data={data} saveData={saveData}/>
          }
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
          <div className="h-full min-h-dvh w-full pb-16">
            <div className="h-[576px] mt-20 lg:mt-4 relative">
              <div
                className="scale-[0.3] -translate-y-[35%] w-[1080px] relative -translate-x-[50%] left-1/2 border-2 box-content">
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

