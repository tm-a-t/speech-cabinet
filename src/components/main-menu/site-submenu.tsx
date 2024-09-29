import {MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from '~/components/ui/menubar';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '~/components/ui/dialog';
import React from 'react';

export function SiteSubmenu() {

  return (
    <MenubarMenu>
      <MenubarTrigger className="font-medium">Speech Cabinet</MenubarTrigger>
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
            <div className="-mt-2">
              <p className="font-disco">
                Every combination of words has been played out.
                The atoms don&apos;t form us anymore: us, our love, our unborn daughters.
              </p>
              <hr className="my-4"/>
              <p>
                This site generates dialogue videos in the style of Disco Elysium;
                see <a href="https://www.reddit.com/r/DiscoElysium/comments/1fs5gsk/i_made_a_site_that_animates_disco_elysium/" className="underline underline-offset-4" target="_blank">the reddit posts.</a>
              </p>
              <p className="mt-3">Created by tmat.</p>
            </div>
          </DialogContent>
        </Dialog>
      </MenubarContent>
    </MenubarMenu>
  )
}