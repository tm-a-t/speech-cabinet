import * as React from "react";
import {Button} from "~/components/ui/button";
import { ArrowDown, ArrowUp, Ellipsis, EllipsisVertical, Trash, ImagePlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type {DiscoData, Message} from "~/lib/disco-data";
import {TypeSelect} from '~/components/editor/type-select';
import {PortraitSelect} from "./portrait-select";
import { useContext } from "react";
import { MessageEditorContext } from "~/components/editor/text-editor-provider";
import { addImage } from "~/lib/utils";

export function MessageExtraMenu({message, removeMessage, data, saveData, moveMessageUp, moveMessageDown}: {
  message: Message,
  removeMessage: () => void,
  data: DiscoData,
  saveData: (data: DiscoData) => void,
  moveMessageUp: () => void,
  moveMessageDown: () => void,
}) {
  const [open, setOpen] = React.useState(false);
  const editor = useContext(MessageEditorContext);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="message-menu-button h-8 text-base px-2 ml-auto text-zinc-400 sm:absolute -left-8 transition">
          <Ellipsis className="h-4 w-4 hidden sm:block"/>
          <EllipsisVertical className="h-4 w-4 mb-1 sm:hidden"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <TypeSelect message={message} data={data} saveData={saveData}/>
        <PortraitSelect message={message} data={data} saveData={saveData} setOpen={setOpen}/>
        <DropdownMenuSeparator className="first:hidden"/>
        <DropdownMenuItem onSelect={() => addImage(editor)}>
          <ImagePlus className="mr-2 h-4 w-4"/>
          Add image
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={e => {moveMessageUp(); e.preventDefault()}}>
          <ArrowUp className="mr-2 h-4 w-4"/>
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={e => {moveMessageDown(); e.preventDefault()}}>
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