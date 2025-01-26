import {MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from '~/components/ui/menubar';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '~/components/ui/dialog';
import React from 'react';
import Link from "next/link";

export function SiteSubmenu() {

  return (
    <MenubarMenu>
      <MenubarTrigger>About</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <Link href="https://www.reddit.com/r/DiscoElysium/comments/1fs5gsk/i_made_a_site_that_animates_disco_elysium/" target="_blank">Reddit post →</Link>
        </MenubarItem>
        <MenubarItem>
          <Link href="https://github.com/tm-a-t/speech-cabinet" target="_blank">Code on GitHub →</Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}