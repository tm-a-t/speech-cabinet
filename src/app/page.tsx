'use client';


import React, {useEffect, useState} from 'react';
import {type DiscoData, serialize} from '~/lib/disco-data';
import {Editor} from '~/components/editor/editor';
import { Menubar } from "~/components/ui/menubar";
import {SiteSubmenu} from '~/components/site-menu/site-submenu';
import {FileSubmenu} from '~/components/site-menu/file-submenu';
import {OptionsSubmenu} from '~/components/site-menu/options-submenu';
import { restoreSavedData } from '~/lib/utils';
import Image from "next/image";
import {
  CoverImageEditorContext,
  TextEditorProvider,
} from '~/components/editor/text-editor-provider';
import { useIsDesktop } from "~/lib/hooks/use-media-query";
import { PlayerWrapper } from "~/components/editor/watch-button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function EditorPage() {
  const [data, setData] = useState<DiscoData | null>(null);
  const isDesktop = useIsDesktop();
  const [menuValue, setMenuValue] = useState('');

  useEffect(() => {
    if (data !== null) return;
    setData(restoreSavedData());
  }, [data]);

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
    <TextEditorProvider
      context={CoverImageEditorContext}
      content={data?.cover?.content ?? ""}
      placeholder="Or paste here"
      onUpdate={(text, editor) =>
        data &&
        saveData({
          ...data,
          cover: editor.isEmpty ? undefined : { ...data.cover, content: text },
        })
      }
      allowOnlyImage
    >
      <div className="h-full w-full">
        <Image
          src="/layout/wallpaper.png"
          alt=""
          width={1080}
          height={607}
          className="fixed -z-20 h-full w-full object-cover"
        />

        <div className="fixed left-0 right-0 top-0 z-20 flex flex-wrap items-center gap-x-1 gap-y-4 py-3 sm:px-3 sm:py-2"></div>

        <div
          className="mask fixed h-dvh w-full"
          style={{
            maskImage: isDesktop
              ? ""
              : "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2) 1rem, rgba(0,0,0,0.5) 3rem, rgba(0,0,0,1) 6rem)",
          }}
        >
          <div className="flex h-full w-full justify-center gap-x-16">
            <div className="max-w-2xl flex-grow">
              <div className="container mx-auto h-full min-h-dvh max-w-2xl overflow-y-auto bg-black/70 px-6 pb-64 pt-32 sm:px-24 xl:pt-32">
                <h2 className="mb-8 px-2 text-2xl font-bold sm:mb-0 sm:px-0">
                  Dialogue
                </h2>

                <Menubar
                  className="border-0 dark:bg-transparent -ml-3"
                  value={menuValue}
                  onValueChange={setMenuValue}
                  id="menubar"
                >
                  {data && (
                    <>
                      <FileSubmenu
                        data={data}
                        saveData={saveData}
                        close={() => setMenuValue("")}
                      />
                      <OptionsSubmenu
                        data={data}
                        saveData={saveData}
                        close={() => setMenuValue("")}
                      />
                    </>
                  )}
                </Menubar>

                {data && <Editor data={data} saveData={saveData} />}
              </div>
            </div>
            <div>
              <div className="h-32"></div>
              <h2 className="mb-8 px-2 text-2xl font-bold sm:mb-0 sm:px-0">
                Preview
              </h2>
              <Tabs>
                <TabsList>
                  <TabsTrigger value="Video">Video</TabsTrigger>
                  <TabsTrigger value="Image">Image</TabsTrigger>
                </TabsList>
              </Tabs>
              {data && (
                <PlayerWrapper
                  data={data}
                  setIsOpen={function (isOpen: boolean): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </TextEditorProvider>
  );
}

