'use client';


import React, {useEffect, useState} from 'react';
import {defaultData, DiscoData} from '~/app/_lib/data-types';
import {Editor} from '~/app/_components/edit-mode/editor';
import {
  Menubar,
} from '~/app/_components/ui/menubar';
import {SiteSubmenu} from '~/app/_components/main-menu/site-submenu';
import {FileSubmenu} from '~/app/_components/main-menu/file-submenu';
import {VideoSubmenu} from '~/app/_components/main-menu/video-submenu';
import {PlayerButton} from '~/app/_components/main-menu/player-button';
import {redirect} from 'next/navigation';

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
      console.log('saved');
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="w-full h-full">
      <div
        className="fixed z-20 top-0 left-0 right-0 py-2 px-3 flex flex-wrap gap-1 items-center bg-black xl:bg-transparent backdrop-blur xl:backdrop-blur-none bg-opacity-50 border-b xl:border-0">
        <Menubar className="mr-auto border-0 dark:bg-transparent" value={menuValue} onValueChange={setMenuValue}
                 id="menubar">
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

