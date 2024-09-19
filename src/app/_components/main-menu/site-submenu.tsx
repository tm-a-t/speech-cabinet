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
            <p>
              Every combination of words has been played out.
              The atoms don&apos;t form us anymore: us, our love, our unborn daughters.
            </p>
            <hr/>
            <p>
              This site is Disco Elysum dialogue generator, made by tmat.
              See <a href="https://www.reddit.com/r/DiscoElysium/comments/1fgkudy/im_building_a_site_for_animating_discostyle/" className="underline underline-offset-4" target="_blank">the reddit posts.</a>
            </p>
          </DialogContent>
        </Dialog>
      </MenubarContent>
    </MenubarMenu>
  )
}