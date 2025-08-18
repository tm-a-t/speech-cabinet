import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "~/components/ui/menubar";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteSubmenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger className="font-bold">Speech Cabinet</MenubarTrigger>
      <MenubarContent className="w-80">
        <p className="px-2 py-1.5 text-sm">
          Welcome to the place where you can create your own
          Disco&nbsp;Elysium-style dialogues. Click on&nbsp;a&nbsp;name
          to&nbsp;set the&nbsp;character. Your changes are saved automatically.
        </p>
        <MenubarSeparator />
        <Link
          href="https://open.substack.com/pub/artsexperience/p/how-i-coded-the-disco-elysium-animator"
          target="_blank"
        >
          <MenubarItem>
            Project story <ArrowRight className="ml-1 w-4" />
          </MenubarItem>
        </Link>
        <Link
          href="https://www.reddit.com/r/DiscoElysium/comments/1fs5gsk/i_made_a_site_that_animates_disco_elysium/"
          target="_blank"
        >
          <MenubarItem>
            Reddit <ArrowRight className="ml-1 w-4" />
          </MenubarItem>
        </Link>
        <Link href="https://github.com/tm-a-t/speech-cabinet" target="_blank">
          <MenubarItem>
            GitHub <ArrowRight className="ml-1 w-4" />
          </MenubarItem>
        </Link>
      </MenubarContent>
    </MenubarMenu>
  );
}
