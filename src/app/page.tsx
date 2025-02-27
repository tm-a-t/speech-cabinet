'use client';


import React, {useEffect, useState} from 'react';
import {type DiscoData, serialize} from '~/lib/disco-data';
import {Editor} from '~/components/editor/editor';
import { Menubar } from "~/components/ui/menubar";
import {SiteSubmenu} from '~/components/site-menu/site-submenu';
import {FileSubmenu} from '~/components/site-menu/file-submenu';
import {VideoSubmenu} from '~/components/site-menu/video-submenu';
import { InfoIcon } from 'lucide-react';
import { restoreSavedData } from '~/lib/utils';

export default function EditorPage() {
  const [data, setData] = useState<DiscoData | null>(null);
  const [menuValue, setMenuValue] = useState('');

  useEffect(() => {
    if (data !== null) return;
    setData(restoreSavedData());
  }, []);

  function saveData(newData: DiscoData) {
    setData(newData);
  }

  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('data', serialize(data));
        console.log('saved');
      } catch (e) {
        alert("Sorry, can't store this. Looks like the dialogue gets too large.");
        console.error('Could not save:', e);
        setData(restoreSavedData());
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="w-full h-full">
      <div
        className="fixed z-20 top-0 left-0 right-0 py-2 px-1 sm:px-3 flex flex-wrap gap-x-1 gap-y-4 items-center bg-zinc-900/50 backdrop-blur-xl xl:bg-transparent xl:backdrop-blur-none border-b xl:border-0">
        <Menubar className="border-0 dark:bg-transparent mr-auto"
                 value={menuValue}
                 onValueChange={setMenuValue}
                 id="menubar">
          <SiteSubmenu/>
          {data && <>
            <FileSubmenu data={data} saveData={saveData} close={() => setMenuValue('')}/>
            <VideoSubmenu data={data} saveData={saveData} close={() => setMenuValue('')}/>
          </>}
        </Menubar>
      </div>

      {data &&
        <div
          className="container mx-auto px-6 sm:px-24 max-w-2xl pb-64 h-full min-h-dvh tape-background">
          <p className="text-zinc-300 font-disco italic mx-2 sm:mx-0 pt-24 xl:pt-16">
            <InfoIcon className="inline h-4 w-4 mb-1"/> Welcome to the place where you can create your own Disco&nbsp;Elysium-style dialogues.
            Click on&nbsp;a&nbsp;name to&nbsp;set the&nbsp;character.
            Your changes are saved automatically.
          </p>

          <hr className="border-transparent sm:border-zinc-800 mt-4" />

          <Editor data={data} saveData={saveData} />
        </div>
      }
    </div>
  );
}

