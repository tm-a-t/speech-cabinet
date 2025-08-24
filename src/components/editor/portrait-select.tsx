import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '~/components/ui/dropdown-menu';
import { Paperclip, User} from 'lucide-react';
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
import { addImage, getDefaultPortraitUrl, getPortraitUrl} from '~/lib/utils';
import * as React from 'react';
import type {DiscoData, Message} from '~/lib/disco-data';
import {SkeletonImage} from '../ui/skeleton-image';
import {useIsDesktop} from '~/lib/hooks/use-media-query';
import {Drawer, DrawerContent, DrawerTrigger} from '~/components/ui/drawer';
import { Button } from "~/components/ui/button";
import {
  CoverImageEditorContext,
  MessageEditorContext,
  PortraitImageEditorContext,
  TextEditorProvider,
} from "~/components/editor/text-editor-provider";
import { EditorContent } from "@tiptap/react";
import { useContext } from "react";
import type { Editor } from "@tiptap/core";

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
    // setTimeout(() => setOpen(false), 200);
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

  function handlePastePortrait(text: string, editor: Editor) {
    if (!text.startsWith('<img src="')) {
      return;
    }
    const src = text.replace(/<img src="/, '').split('"')[0]!;
    onSelectPortraitUrl(src);
    editor.commands.clearContent();
  }

  return (
    <Command defaultValue={current}>
      {current && <>
        <SkeletonImage src={current} alt="Current portrait"
                       className="w-1/2 max-w-28 mx-auto aspect-portrait object-cover" width={720} height={1000}/>
        <CommandSeparator/>
      </>}

      <TextEditorProvider
        context={PortraitImageEditorContext}
        content={""}
        placeholder="Paste"
        onUpdate={handlePastePortrait}
        allowOnlyImage
      >
        <PortraitActionRow/>
      </TextEditorProvider>
      <CommandSeparator/>

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

function PortraitActionRow() {
  const editor = useContext(PortraitImageEditorContext);
  return (
    <div className="px-1 text-sm flex gap-x-1 items-center">
      <Button className="pl-1" variant="ghost" size="sm" onClick={() => addImage(editor)}>
        <Paperclip className="h-4 mr-1"/> Choose
      </Button>
      <EditorContent editor={editor} className="[&>*]:py-2 [&_p.is-empty::before]:text-zinc-400 [&_p.is-empty::before]:opacity-100"></EditorContent>
      <div className="grow [&>*]:border-b-0">
        <CommandInput className="" placeholder="Search"/>
      </div>
    </div>
  );
}
