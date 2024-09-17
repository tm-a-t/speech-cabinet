import {MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger} from '~/app/_components/ui/menubar';
import {defaultData, DiscoData} from '~/app/_lib/data-types';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '~/app/_components/ui/dialog';
import React from 'react';
import {downloadFile, formatTime} from '~/app/_lib/utils';

export function SiteSubmenu({data, saveData}: {data: DiscoData | null, saveData: (data: DiscoData) => void}) {

  return (
    <MenubarMenu>
      <MenubarTrigger>Speech Cabinet</MenubarTrigger>
      <MenubarContent className="w-72">
        <MenubarItem disabled>
          We don't have anything to talk about anymore.
          Every combination of words has been played out.
          The atoms don't form us anymore: us, our love, our unborn daughters.
        </MenubarItem>
        <MenubarSeparator/>
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
      </MenubarContent>
    </MenubarMenu>
  )
}