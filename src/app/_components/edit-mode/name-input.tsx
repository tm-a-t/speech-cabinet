"use client";

import * as React from "react";

import {useMediaQuery} from "~/app/_lib/hooks/use-media-query";
import {Button} from "~/app/_components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/app/_components/ui/command";
import {Drawer, DrawerContent, DrawerTrigger} from "~/app/_components/ui/drawer";
import {cn, uniqueValues} from "~/app/_lib/utils";
import {Trash} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import {characters, nameClass, skills} from '~/app/_lib/names';

export function NameInput(props: {
  value: string,
  onSelect: (option: string | null) => void,
  onRemoveLine: () => void,
  usedNames: string[],
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<string>(props.value);

  function handleSelectedOption(option: string) {
    setSelectedOption(option);
    props.onSelect(option);
  }

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("uppercase tracking-wider h-8 px-3", nameClass[selectedOption])}>
            {selectedOption}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 p-0" align="start">
          <OptionList setOpen={setOpen} setSelectedOption={handleSelectedOption} usedNames={props.usedNames}/>
          <DropdownMenuSeparator/>
          <DropdownMenuItem className="m-1" onSelect={props.onRemoveLine}>
            <Trash className="mr-2 h-4 w-4"/>
            Remove line
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className={cn("uppercase tracking-wider h-8 px-3", nameClass[selectedOption])}>
          {selectedOption}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionList setOpen={setOpen} setSelectedOption={handleSelectedOption} usedNames={props.usedNames}/>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OptionList(
  {
    setOpen,
    setSelectedOption,
    usedNames,
  }: {
    setOpen: (open: boolean) => void
    setSelectedOption: (option: string) => void
    usedNames: string[],
  },
) {
  const [input, setInput] = React.useState('');
  const customOption =
    input.length > 0 && skills.find(option => option == input) == null
      ? input
      : null;

  function selectOption(option: string) {
    setSelectedOption(option);
    setOpen(false);
  }

  return (
    <Command>
      <CommandInput placeholder="Name..." autoFocus onValueChange={text => setInput(text.trim())}/>
      <CommandList>
        {/*<CommandEmpty>No results found.</CommandEmpty>*/}

        <CommandGroup heading="Used characters">
          {usedNames.map((name) => <OptionItem option={name} onSelect={() => selectOption(name)} key={name}/>)}
        </CommandGroup>
        <CommandSeparator/>
        <CommandGroup heading="Skills">
          {skills.map((option) => <OptionItem option={option} onSelect={() => selectOption(option)} key={option}/>)}
        </CommandGroup>
        <CommandGroup heading="Other characters">
          {characters.map((option) => <OptionItem option={option} onSelect={() => selectOption(option)} key={option}/>)}
        </CommandGroup>
        {customOption && <>
          <CommandSeparator/>
          <CommandGroup heading="Create character">
            <OptionItem option={customOption} onSelect={() => selectOption(customOption)}/>
          </CommandGroup>
        </>}
      </CommandList>
    </Command>
  );
}

function OptionItem({option, onSelect}: { option: string, onSelect: (() => void) }) {
  return (
    <CommandItem
      key={option}
      value={option}
      onSelect={onSelect}
      className={cn("uppercase tracking-wider", nameClass[option])}
    >
      {option}
    </CommandItem>
  );
}
