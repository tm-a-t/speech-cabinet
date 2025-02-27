import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '~/components/ui/dropdown-menu';
import {User} from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command';
import {allPortraitNames, characters, harryPortraitNames, skills} from '~/lib/names';
import {Tooltip, TooltipContent, TooltipTrigger} from '~/components/ui/tooltip';
import {getDefaultPortraitUrl, getPortraitUrl} from '~/lib/utils';
import * as React from 'react';
import type {DiscoData, Message} from '~/lib/disco-data';
import {SkeletonImage} from '../ui/skeleton-image';
import {useIsDesktop} from '~/lib/hooks/use-media-query';
import {Drawer, DrawerContent, DrawerTrigger} from '~/components/ui/drawer';

export function PortraitSelect({message, data, saveData, setOpen}: {
  message: Message,
  data: DiscoData,
  saveData: (data: DiscoData) => void,
  setOpen: (value: boolean) => void,
}) {
  const isDesktop = useIsDesktop();
  if (message.name !== 'You' && (characters.includes(message.name) || skills.includes(message.name))) {
    return
  }

  function handleSelectPortraitUrl(url: string) {
    saveData({
      ...data,
      overrides: {
        ...data.overrides,
        portraitUrl: {
          ...data.overrides.portraitUrl,
          [message.name]: url,
        }
      }
    });
    setTimeout(() => setOpen(false), 200);
  }

  const label = <>
    <User className="mr-2 h-4 w-4"/>
    Portrait
  </>;

  if (isDesktop) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>{label}</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="p-0 w-72">
            <PortraitOptionList
              message={message}
              data={data}
              onSelectPortraitUrl={handleSelectPortraitUrl}></PortraitOptionList>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>{label}</DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent>
        <PortraitOptionList
          message={message}
          data={data}
          onSelectPortraitUrl={handleSelectPortraitUrl}></PortraitOptionList>
      </DrawerContent>
    </Drawer>
  );
}

function PortraitOptionList({message, data, onSelectPortraitUrl}: {
  message: Message,
  data: DiscoData,
  onSelectPortraitUrl: (value: string) => void,
}) {
  const current = getPortraitUrl(message.name, data)
  const options = message.name === 'You' ? harryPortraitNames : allPortraitNames;
  return (
    <Command defaultValue={current}>
      <p className="text-sm text-zinc-400 px-3 py-2 flex items-center">
        Custom portraits coming soon.
      </p>
      <CommandSeparator/>
      {current && <>
        <SkeletonImage src={current} alt="Current portrait"
                       className="w-1/2 max-w-28 mx-auto aspect-portrait" width={720} height={1000}/>
        <CommandSeparator/>
      </>}
      <CommandInput placeholder="Search..."/>
      <CommandList>
        <CommandGroup className="[&>*]:flex [&>*]:flex-wrap [&>*]:w-full">
          <CommandItem onSelect={() => onSelectPortraitUrl('')}
                       className="w-1/4 aspect-portrait flex text-center align-center text-zinc-500">
            Clear portrait
          </CommandItem>
          {options.map((name) => {
            const url = getDefaultPortraitUrl(name);
            return <CommandItem onSelect={() => onSelectPortraitUrl(url)}
                                value={url} className="w-1/4" key={name}>
              <Tooltip>
                <TooltipTrigger>
                  <SkeletonImage src={url} alt={name} className="min-w-[54px] min-h-[75px]" width={54} height={75}/>
                </TooltipTrigger>
                <TooltipContent className="uppercase tracking-wider font-disco">{name}</TooltipContent>
              </Tooltip>
            </CommandItem>;
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
