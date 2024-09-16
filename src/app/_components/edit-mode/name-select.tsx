import * as React from 'react';
import {characters, skillColorClass, skills} from '~/app/_lib/names';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/app/_components/ui/command';
import {cn, getColorClass} from '~/app/_lib/utils';
import {Message, SavedData} from '~/app/_lib/data-types';
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '~/app/_components/ui/dropdown-menu';
import {Users} from 'lucide-react';
import {useIsDesktop} from '~/app/_lib/hooks/use-media-query';
import {Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger} from '../ui/drawer';

export function NameSelect(
  props: {
    message: Message,
    saveMessage: (message: Message) => void,
    setOpen: (open: boolean) => void,
    usedNames: string[],
    data: SavedData,
  },
) {
  const isDesktop = useIsDesktop();
  const [drawerOpen, setDrawerOpen] = React.useState();

  function handleSelectedOption(option: string) {
    props.saveMessage({
      ...(props.message),
      name: option ?? "",
    });
  }

  const label = <>
    <Users className="mr-2 h-4 w-4"/>
    Change character
  </>;

  if (isDesktop) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>{label}</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="p-0 w-60">
            <NameOptionList setOpen={props.setOpen}
                            setSelectedOption={handleSelectedOption}
                            usedNames={props.usedNames}
                            selectedOption={props.message.name}
                            data={props.data}/>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>{label}...</DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent className="h-96">
        <NameOptionList setOpen={props.setOpen}
                        setSelectedOption={handleSelectedOption}
                        usedNames={props.usedNames}
                        selectedOption={props.message.name}
                        data={props.data}/>
      </DrawerContent>
    </Drawer>
  );
}

function NameOptionList(
  {
    setOpen,
    setSelectedOption,
    selectedOption,
    usedNames,
    data,
  }: {
    setOpen: (open: boolean) => void,
    setSelectedOption: (option: string) => void,
    selectedOption: string,
    usedNames: string[],
    data: SavedData,
  },
) {
  const [input, setInput] = React.useState('');

  const customOption =
    input.length > 0 && skills.find(option => option == input) == null
      ? input
      : null;

  const usedNamesSorted = [selectedOption, ...usedNames.filter(e => e != selectedOption)];

  function selectOption(option: string) {
    setSelectedOption(option);
    setOpen(false);
  }

  React.useEffect(() => {
    document.getElementById('name-select-input')?.focus();
  }, []);

  return (
    <Command>
      <CommandInput
        id="name-select-input"
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
  data: SavedData
}) {
  return (
    <CommandItem
      key={option}
      value={category + ' / ' + option}
      onSelect={onSelect}
      className={cn("uppercase tracking-wider", getColorClass(option, data))}
    >
      {option}
    </CommandItem>
  );
}
