import {MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger} from '~/app/_components/ui/menubar';
import {defaultData, SavedData} from '~/app/_lib/data-types';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '~/app/_components/ui/dialog';
import React from 'react';
import {downloadFile, formatTime} from '~/app/_lib/utils';

export function SiteSubmenu({data, saveData}: {data: SavedData | null, saveData: (data: SavedData) => void}) {

  return (
    <MenubarMenu>
      <MenubarTrigger>Speech Cabinet</MenubarTrigger>
      <MenubarContent className="w-72">
        <Dialog>
          <DialogTrigger asChild>
            <MenubarItem onSelect={e => e.preventDefault()}>
              About
            </MenubarItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Speech Cabinet</DialogTitle>
            </DialogHeader>
            <p>
              Something!
            </p>
          </DialogContent>
        </Dialog>
        <MenubarSeparator/>
        <MenubarItem disabled>
          We don't have anything to talk about anymore.
          Every combination of words has been played out.
          The atoms don't form us anymore: us, our love, our unborn daughters.
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}