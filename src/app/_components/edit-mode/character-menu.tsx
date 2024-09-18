import * as React from "react";

import {useIsDesktop} from "~/app/_lib/hooks/use-media-query";
import {Button} from "~/app/_components/ui/button";
import {cn, getColorClass} from "~/app/_lib/utils";
import {ArrowDown, ArrowUp, Trash} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import {DiscoData, Message} from "~/app/_lib/data-types";
import {NameSelect} from "./name-select";
import {TypeSelect} from '~/app/_components/edit-mode/type-select';
import {PortraitSelect} from "./portrait-select";

export function CharacterMenu({message, saveMessage, removeMessage, data, saveData, usedNames}: {
  message: Message,
  saveMessage: (message: Message) => void,
  removeMessage: () => void,
  data: DiscoData,
  saveData: (data: DiscoData) => void,
  usedNames: string[],
}) {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"
                className={cn("h-8 px-3 sm:px-3 uppercase tracking-wider [&:last-child]:-mr-2", getColorClass(message.name, data))}>
          {message.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <NameSelect message={message} saveMessage={saveMessage} setOpen={setOpen} usedNames={usedNames} data={data}/>
        <PortraitSelect message={message} data={data} saveData={saveData} setOpen={setOpen}/>
        <TypeSelect message={message} data={data} saveData={saveData}/>
        <DropdownMenuSeparator/>
        <DropdownMenuItem>
          <ArrowUp className="mr-2 h-4 w-4"/>
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ArrowDown className="mr-2 h-4 w-4"/>
          Move down
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={removeMessage}>
          <Trash className="mr-2 h-4 w-4"/>
          Remove line
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}