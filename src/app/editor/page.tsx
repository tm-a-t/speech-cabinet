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
import {defaultData, DiscoData} from '../_lib/data-types';
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
import {FileSubmenu} from '~/app/_components/main-menu/file-submenu';
import {VideoSubmenu} from '~/app/_components/main-menu/video-submenu';
import { Play } from "lucide-react";
import {Drawer, DrawerContent, DrawerTrigger} from '~/app/_components/ui/drawer';
import {DropdownMenuItem} from '~/app/_components/ui/dropdown-menu';
import {PlayerButton} from '~/app/_components/main-menu/player-button';
import DrawerDemo from '~/app/_components/test';

export default function EditorPage() {
  const [data, setData] = useState<DiscoData | null>(null);
  const [menuValue, setMenuValue] = useState('');

  useEffect(() => {
    if (data === null) {
      const dataSave = JSON.parse(localStorage.getItem('data') ?? 'null') as DiscoData;
      if (dataSave) {
        setData(dataSave);
      } else {
        setData(defaultData);
      }
    }
  });

  function saveData(newData: DiscoData) {
    setData(newData);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('data', JSON.stringify(data));
      console.log('saved')
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="w-full h-full">
      <div
        className="fixed z-20 top-0 left-0 right-0 py-2 px-3 flex flex-wrap gap-1 items-center bg-zinc-950 lg:bg-transparent border-b lg:border-0">
        <Menubar className="mr-auto border-0 lg:border" value={menuValue} onValueChange={setMenuValue} id="menubar">
          <SiteSubmenu data={data} saveData={saveData}/>
          {data && <>
            <FileSubmenu data={data} saveData={saveData}/>
            <VideoSubmenu data={data} saveData={saveData}/>
          </>}
        </Menubar>
        {data &&
          <PlayerButton data={data} onMouseOver={() => setMenuValue('empty')}/>
        }
      </div>

      {data && <Editor data={data} saveData={saveData}/>}
    </div>
  );
}

