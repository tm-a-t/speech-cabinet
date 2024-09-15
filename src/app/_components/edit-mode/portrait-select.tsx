import {
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '~/app/_components/ui/dropdown-menu';
import {SquareUser} from 'lucide-react';
import {Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator} from '~/app/_components/ui/command';
import {characters, skills} from '~/app/_lib/names';
import {Tooltip, TooltipContent, TooltipTrigger} from '~/app/_components/ui/tooltip';
import {getDefaultPortraitUrl, getPortraitUrl} from '~/app/_lib/utils';
import * as React from 'react';
import {Message, SavedData} from '~/app/_lib/data-types';
import {Skeleton} from '~/app/_components/ui/skeleton';
import { SkeletonImage } from '../ui/skeleton-image';

export function PortraitSelect({message, data, saveData}: {
  message: Message,
  data: SavedData,
  saveData: (data: SavedData) => void,
}) {
  function handleSelectPortraitUrl(name: string | null) {
    saveData({
      ...data,
      overrides: {
        ...data.overrides,
        portraitUrl: {
          ...data.overrides.portraitUrl,
          [message.name]: name ? getDefaultPortraitUrl(name) : '',
        }
      }
    });
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SquareUser className="mr-2 h-4 w-4"/>
        Edit portrait
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="p-0">
          <Command className="w-72">
            <p className="text-sm text-zinc-400 px-3 py-2 flex items-center">
              Custom portraits coming soon.
            </p>
            <CommandSeparator/>
            {getPortraitUrl(message.name, data) && <>
              <SkeletonImage src={getPortraitUrl(message.name, data)} alt="Current portrait"
                            className="w-1/2 mx-auto aspect-portrait"/>
              <CommandSeparator/>
            </>}
            <CommandInput placeholder="Search..."/>
            <CommandList>
              <CommandGroup className="[&>*]:flex [&>*]:flex-wrap [&>*]:w-full">
                <CommandItem onSelect={() => handleSelectPortraitUrl(null)}
                             className="w-1/4 aspect-portrait flex text-center align-center text-zinc-500">
                  Clear portrait
                </CommandItem>
                {[...characters, ...skills].map((name) => {
                  const url = getDefaultPortraitUrl(name)!;
                  return <CommandItem onSelect={() => handleSelectPortraitUrl(name)}
                                      value={name} className="w-1/4" key={name}>
                    <Tooltip>
                      <TooltipTrigger>
                        <SkeletonImage src={url} alt={name} className="w-[54px] h-[75px]"/>
                      </TooltipTrigger>
                      <TooltipContent className="uppercase tracking-wider">{name}</TooltipContent>
                    </Tooltip>
                  </CommandItem>;
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}