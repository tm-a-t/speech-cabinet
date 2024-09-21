import * as React from 'react';
import {characters, skills} from '~/app/_lib/names';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/app/_components/ui/command';
import {cn, getColorClass} from '~/app/_lib/utils';
import type {DiscoData, Message} from '~/app/_lib/data-types';
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from '~/app/_components/ui/dropdown-menu';
import {useIsDesktop} from '~/app/_lib/hooks/use-media-query';
import {Drawer, DrawerContent, DrawerTrigger} from '../ui/drawer';
import {Button} from '~/app/_components/ui/button';

export function NameSelect(
  props: {
    message: Message,
    saveMessage: (message: Message) => void,
    usedNames: string[],
    data: DiscoData,
  },
) {
  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = React.useState(false);

  function handleSelectedOption(option: string) {
    props.saveMessage({
      ...(props.message),
      name: option ?? "",
    });
    setIsOpen(false);
  }

  const colorClass = getColorClass(props.message.name, props.data);
  const button = <Button variant="ghost"
                         className={cn("h-8 px-3 sm:px-3 sm:text-base uppercase tracking-wider font-disco", colorClass)}>
    {props.message.name}
  </Button>;

  if (isDesktop) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
        <DropdownMenuContent className="p-0 w-60">
          <NameOptionList setSelectedOption={handleSelectedOption}
                          usedNames={props.usedNames}
                          selectedOption={props.message.name}
                          isDesktop={isDesktop}
                          data={props.data}/>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {button}
      </DrawerTrigger>
      <DrawerContent className="h-96">
        <NameOptionList setSelectedOption={handleSelectedOption}
                        usedNames={props.usedNames}
                        selectedOption={props.message.name}
                        isDesktop={isDesktop}
                        data={props.data}/>
      </DrawerContent>
    </Drawer>
  );
}

function NameOptionList(
  {
    setSelectedOption,
    selectedOption,
    usedNames,
    isDesktop,
    data,
  }: {
    setSelectedOption: (option: string) => void,
    selectedOption: string,
    usedNames: string[],
    isDesktop: boolean,
    data: DiscoData,
  },
) {
  const [input, setInput] = React.useState('');

  const customOption =
    input.length > 0
    && skills.find(option => option.toLowerCase() == input) == null
    && characters.find(option => option.toLowerCase() == input) == null
      ? input
      : null;

  const usedNamesSorted = [selectedOption, ...usedNames.filter(e => e != selectedOption)];

  function selectOption(option: string) {
    setSelectedOption(option);
  }

  return (
    <Command>
      <CommandInput
        autoFocus={isDesktop}
        placeholder="Name..."
        onValueChange={text => setInput(text.trim().toUpperCase())}
        className="[&:not(:placeholder-shown)]:uppercase"/>
      <CommandList data-vaul-no-drag>
        {/*<CommandEmpty>No results found.</CommandEmpty>*/}

        {usedNames.length && <>
          <CommandGroup heading="Used characters">
            {usedNamesSorted.map((name) =>
              <NameOptionItem option={name} category="used" onSelect={() => selectOption(name)} key={name}
                              data={data}/>,
            )}
          </CommandGroup>
          <CommandSeparator/>
        </>}
        <CommandGroup heading="Skills">
          {skills.map((option) =>
            <NameOptionItem option={option} category="skills" onSelect={() => selectOption(option)} key={option}
                            data={data}/>,
          )}
        </CommandGroup>
        <CommandGroup heading="More characters">
          {characters.map((option) =>
            <NameOptionItem option={option} category="other" onSelect={() => selectOption(option)} key={option}
                            data={data}/>,
          )}
        </CommandGroup>
        {customOption && <>
          <CommandSeparator/>
          <CommandGroup heading="Create character" forceMount>
            <NameOptionItem option={customOption} category="new" onSelect={() => selectOption(customOption)}
                            data={data}/>
          </CommandGroup>
        </>}
      </CommandList>
    </Command>
  );
}

function NameOptionItem({option, category, onSelect, data}: {
  option: string,
  category: string,
  onSelect: () => void,
  data: DiscoData
}) {
  return (
    <CommandItem
      key={option}
      value={category + ' / ' + option}
      onSelect={onSelect}
      className={cn("uppercase tracking-wider font-disco", getColorClass(option, data))}
    >
      {option}
    </CommandItem>
  );
}
