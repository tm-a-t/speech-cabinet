import {
  MenubarItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '~/app/_components/ui/menubar';
import {ost} from '~/app/_lib/music';
import React from 'react';
import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from '~/app/_components/ui/command';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import {Circle} from 'lucide-react';

export function MusicSelect({value, saveValue}: { value: string | null, saveValue: (value: string | null) => void }) {
  return (
    <MenubarSub>
      <MenubarSubTrigger inset>Music</MenubarSubTrigger>
      <MenubarSubContent className="p-0">
        <MusicSelectList value={value} saveValue={saveValue}/>
      </MenubarSubContent>
    </MenubarSub>
  );
}

function MusicSelectList({value, saveValue}: { value: string | null, saveValue: (value: string | null) => void }) {
  return (
    <Command>
      <CommandInput placeholder="Search..."/>
      <CommandList>
        {ost.map(track =>
          <CommandItem onSelect={() => saveValue(track.url)} className="pl-9">
            {track.url === value &&
              <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
                  <Circle className="h-2 w-2 fill-current"/>
              </span>
            }
            {track.name}
            {track.name === 'Instrument of Surrender' &&
              <span className="block text-zinc-500 ml-1">(Martinaise theme)</span>
            }
          </CommandItem>,
        )}
      </CommandList>
    </Command>
  );
}
