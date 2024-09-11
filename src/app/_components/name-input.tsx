"use client";

import * as React from "react";

import {useMediaQuery} from "~/app/_lib/hooks/use-media-query";
import {Button} from "~/app/_components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList, CommandSeparator,
} from "~/app/_components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "~/app/_components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import {cn, uniqueValues} from "~/app/_lib/utils";
import {Image, Trash} from 'lucide-react';


export type NameOption = {
  name: string
  color?: string
}

const skillOptions: NameOption[] = [
  {name: "Logic", color: "text-intellect"},
  {name: "Encyclopedia", color: "text-intellect"},
  {name: "Rhetoric", color: "text-intellect"},
  {name: "Drama", color: "text-intellect"},
  {name: "Conceptualization", color: "text-intellect"},
  {name: "Visual Calculus", color: "text-intellect"},
  {name: "Volition", color: "text-psyche"},
  {name: "Inland Empire", color: "text-psyche"},
];

export const skillNames = skillOptions.map(option => option.name);

export function NameInput(props: {
  value: NameOption | null,
  onSelect: (option: NameOption | null) => void,
  usedNames: string[],
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<NameOption | null>(
    props.value,
  );
  const originalNames = uniqueValues(props.usedNames.filter(name => !skillNames.includes(name)));

  function handleSelectedOption(option: NameOption | null) {
    setSelectedOption(option);
    props.onSelect(option);
  }

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("uppercase tracking-wider", selectedOption?.color)}>
            {selectedOption ? <>{selectedOption.name}</> : <>+ Choose name</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0" align="start">
          <OptionList setOpen={setOpen} setSelectedOption={handleSelectedOption} originalNames={originalNames}/>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className={cn("uppercase tracking-wider", selectedOption?.color)}>
          {selectedOption ? <>{selectedOption.name}</> : <>+ Choose name</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionList setOpen={setOpen} setSelectedOption={handleSelectedOption} originalNames={originalNames}/>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OptionList(
  {
    setOpen,
    setSelectedOption,
    originalNames,
  }: {
    setOpen: (open: boolean) => void
    setSelectedOption: (option: NameOption | null) => void
    originalNames: string[],
  },
) {
  let [input, setInput] = React.useState('');
  let customOption: NameOption | null =
    input.length > 0 && skillOptions.find(option => option.name == input) == null
      ? {name: input}
      : null;

  function selectOption(option: NameOption) {
    setSelectedOption(option);
    setOpen(false);
  }

  return (
    <Command>
      <CommandInput placeholder="Name..." autoFocus onValueChange={text => setInput(text.trim())}/>
      <CommandList>
        {/*<CommandEmpty>No results found.</CommandEmpty>*/}

        {input.length === 0 && <>
          <CommandGroup heading="Edit">
            <CommandItem>
              <Image className="mr-2 h-4 w-4"/>
              Change picture
            </CommandItem>
            <CommandItem>
              <Trash className="mr-2 h-4 w-4"/>
              Remove line
            </CommandItem>
          </CommandGroup>
          <CommandSeparator/>
        </>}
        <CommandGroup heading="Choose character">
          {originalNames.map((name) => <OptionItem option={{name}} onSelect={() => selectOption({name})}/>)}
        </CommandGroup>
        <CommandSeparator/>
        <CommandGroup heading="Skills">
          {skillOptions.map((option) => <OptionItem option={option} onSelect={() => selectOption(option)}/>)}
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

function OptionItem({option, onSelect}: { option: NameOption, onSelect: (() => void) }) {
  return (
    <CommandItem
      key={option.name}
      value={option.name}
      onSelect={onSelect}
      className="uppercase tracking-wider"
    >
      {option.name}
    </CommandItem>
  );
}
