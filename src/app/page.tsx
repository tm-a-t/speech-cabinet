'use client';


import React, {useEffect, useState} from 'react';
import {getDefaultData, type DiscoData, serialize, toDiscoData} from '~/lib/disco-data';
import {Editor} from '~/components/edit-mode/editor';
import {Menubar} from '~/components/ui/menubar';
import {SiteSubmenu} from '~/components/main-menu/site-submenu';
import {FileSubmenu} from '~/components/main-menu/file-submenu';
import {VideoSubmenu} from '~/components/main-menu/video-submenu';
import {WatchButton} from '~/components/main-menu/watch-button';
import {redirect} from 'next/navigation';

export default function EditorPage() {
  const [data, setData] = useState<DiscoData | null>(null);
  const [menuValue, setMenuValue] = useState('');

  useEffect(() => {
    if (data !== null) return;
    const dataSaveString = localStorage.getItem('data');
    if (!dataSaveString || dataSaveString === 'undefined' || dataSaveString === 'null') {
      setData(getDefaultData());
      return;
    }
    const dataSave = toDiscoData(dataSaveString);
    if (dataSave) {
      setData(dataSave);
    } else {
      redirect('/invalid-data');
    }
  });

  function saveData(newData: DiscoData) {
    setData(newData);
  }

  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => {
      localStorage.setItem('data', serialize(data));
      console.log('saved');
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="w-full h-full">
      <div
        className="fixed z-20 top-0 left-0 right-0 py-2 px-1 sm:px-3 flex flex-wrap gap-x-1 gap-y-4 items-center bg-zinc-950 xl:bg-transparent border-b xl:border-0">
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
        {data &&
          <WatchButton data={data}/>
        }
      </div>

      {data && <Editor data={data} saveData={saveData}/>}
    </div>
  );
}

