import * as React from "react";

import {useIsDesktop} from "~/app/_lib/hooks/use-media-query";
import {Button} from "~/app/_components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/app/_components/ui/command";
import {Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger} from "~/app/_components/ui/drawer";
import {cn, getColorClass, getDefaultPortraitUrl, uniqueValues} from "~/app/_lib/utils";
import {Info, Pencil, SquareUser, Trash, Users} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "~/app/_components/ui/dropdown-menu";
import {characters, skillColorClass, skills} from '~/app/_lib/names';
import {Tooltip, TooltipContent, TooltipTrigger} from "../ui/tooltip";
import {Message, SavedData} from "~/app/_lib/data-types";
import {NameSelect} from "./name-select";
import {TypeSelect} from '~/app/_components/edit-mode/type-select';
import {PortraitSelect} from "./portrait-select";

export function CharacterMenu({message, saveMessage, removeMessage, data, saveData, usedNames}: {
  message: Message,
  saveMessage: (message: Message) => void,
  removeMessage: () => void,
  data: SavedData,
  saveData: (data: SavedData) => void,
  usedNames: string[],
}) {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"
                className={cn("uppercase tracking-wider h-8 px-3", getColorClass(message.name, data))}>
          {message.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <NameSelect message={message} saveMessage={saveMessage} setOpen={setOpen} usedNames={usedNames} data={data}/>
        <PortraitSelect message={message} data={data} saveData={saveData} setOpen={setOpen}/>
        <TypeSelect message={message} data={data} saveData={saveData}/>
        <DropdownMenuItem onSelect={removeMessage}>
          <Trash className="mr-2 h-4 w-4"/>
          Remove line
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // return (
  //   <Drawer open={open} onOpenChange={setOpen}>
  //     <DrawerTrigger asChild>
  //       <Button variant="outline" className={cn("uppercase tracking-wider h-8 px-3", skillColorClass[selectedOption])}>
  //         {selectedOption}
  //       </Button>
  //     </DrawerTrigger>
  //     <DrawerContent>
  //       <div className="mt-4 border-t border-b">
  //         <NameOptionList setOpen={setOpen}
  //                         setSelectedOption={handleSelectedOption}
  //                         usedNames={usedNames}
  //                         selectedOption={selectedOption}
  //                         isDesktop={isDesktop}/>
  //       </div>
  //       <div className="m-4">
  //         <Button variant="secondary" onSelect={removeMessage}>
  //           <Trash className="mr-2 h-4 w-4"/>
  //           Remove line
  //         </Button>
  //       </div>
  //     </DrawerContent>
  //   </Drawer>
  // );
}