import {MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger, MenubarLabel} from '~/components/ui/menubar';
import React from 'react';
import Link from "next/link";

export function SiteSubmenu() {

  return (
    <MenubarMenu>
      <MenubarTrigger className="font-bold">Speech Cabinet</MenubarTrigger>
      <MenubarContent>
        <MenubarLabel className="text-zinc-400">Explore</MenubarLabel>
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