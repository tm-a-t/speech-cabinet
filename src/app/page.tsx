'use client';

import React, {useEffect, useState} from 'react';
import {Button} from '~/app/_components/ui/button';
import {SavedData} from './_lib/data-types';
import {PencilRuler, Play} from 'lucide-react';
import {Editor} from '~/app/_components/edit-mode/editor';
import {Player} from './_components/play-mode/player';
import {cn} from './_lib/utils';
import { DownloadButton } from './_components/play-mode/download-button';

export default function HomePage() {
  const [data, setData] = useState<SavedData | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'play'>('edit');

  useEffect(() => {
    if (data == null) {
      const dataSave = JSON.parse(localStorage.getItem('data') ?? 'null') as SavedData;
      if (dataSave) {
        setData(dataSave);
      } else {
        setData({messages: [], version: '0.1'});
        // todo: default
      }
    }
  });

  function saveData(newData: SavedData) {
    setData(newData);
    localStorage.setItem('data', JSON.stringify(newData));
  }

  return (
    <>
      {activeTab === 'edit' && data &&
        <Editor data={data} saveData={saveData}/>
      }
      {activeTab === 'play' && data &&
        <div className="h-full min-h-dvh w-full bg-stone-950">
          <div className="h-[512px] mt-8">
            <div className="scale-[0.4] -translate-y-[384px]">
              <Player data={data}/>
            </div>
          </div>
          <DownloadButton data={data}/>
        </div>
      }

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-stone-950 flex gap-1 p-1">
        <Button onClick={() => setActiveTab('edit')} variant={activeTab === 'edit' ? "secondary" : "ghost"}
                className={cn((activeTab === 'edit') && "dark:bg-stone-800/80 pointer-events-none")}>
          <PencilRuler className="h-4 w-4 mr-2"/>
          Edit
        </Button>
        <Button onClick={() => setActiveTab('play')} variant={activeTab === 'play' ? "secondary" : "ghost"}>
          <Play className="h-4 w-4 mr-2"/>
          Run
        </Button>
      </div>
    </>
  );
}

