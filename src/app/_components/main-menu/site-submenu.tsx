import {MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from '~/app/_components/ui/menubar';
import {DiscoData} from '~/app/_lib/data-types';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription} from '~/app/_components/ui/dialog';
import React from 'react';

export function SiteSubmenu({data, saveData}: {data: DiscoData | null, saveData: (data: DiscoData) => void}) {

  return (
    <MenubarMenu>
      <MenubarTrigger>Speech Cabinet</MenubarTrigger>
      <MenubarContent>
        <Dialog>
          <DialogTrigger asChild>
            <MenubarItem onSelect={e => e.preventDefault()}>
              About
            </MenubarItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] leading-6">
            <DialogHeader>
              <DialogTitle>Speech Cabinet</DialogTitle>
            </DialogHeader>
            <p className="text-zinc-400">
              We don&apos;t have anything to talk about anymore.
              Every combination of words has been played out.
              The atoms don&apos;t form us anymore: us, our love, our unborn daughters.
            </p>
            <p>I made Disco Elysum dialogue generator — because somebody had ot.</p>
          </DialogContent>
        </Dialog>
      </MenubarContent>
    </MenubarMenu>
  )
}