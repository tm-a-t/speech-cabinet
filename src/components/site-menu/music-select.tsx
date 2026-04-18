import {MenubarItem, MenubarSub, MenubarSubContent, MenubarSubTrigger} from '~/components/ui/menubar';
import {ost} from '~/lib/music';
import React, {useEffect, useState} from 'react';
import {Command, CommandInput, CommandItem, CommandList} from '~/components/ui/command';
import {Circle} from 'lucide-react';
import {useIsDesktop} from '~/lib/hooks/use-media-query';
import {Drawer, DrawerContent, DrawerTrigger} from '~/components/ui/drawer';
import type {MusicAvailability} from '~/app/api/music/route'; // type-only: stripped at compile time

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

/**
 * Shape returned by `GET /api/music`. Inline type instead of importing the
 * route module on the client (which would drag server-only Node built-ins).
 */
type Availability = Record<string, boolean>;

function MusicSelectList({value, saveValue}: { value: string | null, saveValue: (value: string | null) => void }) {
  const [availability, setAvailability] = useState<Availability | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/music', {cache: 'no-store'});
        if (!res.ok) return;
        const data = await res.json() as MusicAvailability;
        if (cancelled) return;
        const map: Availability = {};
        for (const entry of data.entries) {
          map[entry.name] = entry.exists;
        }
        setAvailability(map);
      } catch {
        // Network / parse error: leave availability null so nothing is greyed.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const anyExist = availability === null
    ? true
    : ost.some(track => track.url !== null && availability[track.name] === true);

  return (
    <Command>
      <CommandInput placeholder="Search..."/>
      <CommandList>
        {availability !== null && !anyExist &&
          <div className="px-3 py-2 text-xs text-zinc-400 border-b border-zinc-800">
            No music files installed. Drop tracks into <code>public/music/</code>
            {' '}(see README &gt; Using Docker).
          </div>
        }
        {ost.map(track => {
          const missing = availability !== null && track.url !== null && availability[track.name] === false;
          return (
            <CommandItem
              onSelect={() => { if (!missing) saveValue(track.url); }}
              className={`pl-9 ${missing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={missing}
              key={track.name}
            >
              {track.url === value &&
                <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
                    <Circle className="h-2 w-2 fill-current"/>
                </span>
              }
              {track.name}
              {track.name === 'Instrument of Surrender' &&
                <span className="block text-zinc-500 ml-1">Martinaise theme</span>
              }
              {missing &&
                <span className="block text-zinc-500 ml-1">file missing</span>
              }
            </CommandItem>
          );
        })}
      </CommandList>
    </Command>
  );
}
