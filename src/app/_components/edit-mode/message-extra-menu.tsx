import * as React from "react";
import {Button} from "~/app/_components/ui/button";
import {ArrowDown, ArrowUp, Ellipsis, EllipsisVertical, Trash} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import type {DiscoData, Message} from "~/app/_lib/data-types";
import {TypeSelect} from '~/app/_components/edit-mode/type-select';
import {PortraitSelect} from "./portrait-select";
import {characters, skills} from '~/app/_lib/names';

export function MessageExtraMenu({message, removeMessage, data, saveData, moveMessageUp, moveMessageDown}: {
  message: Message,
  removeMessage: () => void,
  data: DiscoData,
  saveData: (data: DiscoData) => void,
  moveMessageUp: () => void,
  moveMessageDown: () => void,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="message-menu-button h-8 text-base px-2 ml-auto text-zinc-400 sm:absolute -left-8 transition">
          <Ellipsis className="h-4 w-4 hidden sm:block"/>
          <EllipsisVertical className="h-4 w-4 mb-1 sm:hidden"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <PortraitSelect message={message} data={data} saveData={saveData} setOpen={setOpen}/>
        <TypeSelect message={message} data={data} saveData={saveData}/>
        {(message.name === 'You' || (!characters.includes(message.name) && !skills.includes(message.name)))
          &&
          <DropdownMenuSeparator/>
        }
        <DropdownMenuItem onSelect={e => {moveMessageUp(); e.preventDefault()}}>
          <ArrowUp className="mr-2 h-4 w-4"/>
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem onClick={e => {moveMessageDown(); e.preventDefault()}}>
          <ArrowDown className="mr-2 h-4 w-4"/>
          Move down
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onSelect={removeMessage}>
          <Trash className="mr-2 h-4 w-4"/>
          Remove line
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}