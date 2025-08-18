import {MenubarItem, MenubarSub, MenubarSubContent, MenubarSubTrigger} from '~/components/ui/menubar';
import {ost} from '~/lib/music';
import React from 'react';
import {Command, CommandInput, CommandItem, CommandList} from '~/components/ui/command';
import {Circle} from 'lucide-react';
import {useIsDesktop} from '~/lib/hooks/use-media-query';
import {Drawer, DrawerContent, DrawerTrigger} from '~/components/ui/drawer';

export function MusicSelect({value, saveValue}: { value: string | null, saveValue: (value: string | null) => void }) {
  const isDesktop = useIsDesktop();

  const label = 'Music';

  if (isDesktop) {
    return (
      <MenubarSub>
        <MenubarSubTrigger inset>{label}</MenubarSubTrigger>
        <MenubarSubContent className="p-0">
          <MusicSelectList value={value} saveValue={saveValue}/>
        </MenubarSubContent>
      </MenubarSub>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <MenubarItem inset onSelect={e => e.preventDefault()}>{label}...</MenubarItem>
      </DrawerTrigger>
      <DrawerContent>
        <MusicSelectList value={value} saveValue={saveValue}/>
      </DrawerContent>
    </Drawer>
  )
}

function MusicSelectList({value, saveValue}: { value: string | null, saveValue: (value: string | null) => void }) {
  return (
    <Command>
      <CommandInput placeholder="Search..."/>
      <CommandList>
        {ost.map(track =>
          <CommandItem onSelect={() => saveValue(track.url)} className="pl-9" key={track.name}>
            {track.url === value &&
              <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
                  <Circle className="h-2 w-2 fill-current"/>
              </span>
            }
            {track.name}
            {track.name === 'Instrument of Surrender' &&
              <span className="block text-zinc-500 ml-1">Martinaise theme</span>
            }
          </CommandItem>,
        )}
      </CommandList>
    </Command>
  );
}
