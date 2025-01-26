import {MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from '~/components/ui/menubar';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '~/components/ui/dialog';
import React from 'react';
import Link from "next/link";

export function SiteSubmenu() {

  return (
    <MenubarMenu>
      <MenubarTrigger>Explore</MenubarTrigger>
      <MenubarContent>
        <Link href="https://www.reddit.com/r/DiscoElysium/comments/1fs5gsk/i_made_a_site_that_animates_disco_elysium/" target="_blank">
          <MenubarItem>Guide</MenubarItem>
        </Link>
        <Link href="https://github.com/tm-a-t/speech-cabinet" target="_blank">
          <MenubarItem>GitHub</MenubarItem>
        </Link>
      </MenubarContent>
    </MenubarMenu>
  )
}