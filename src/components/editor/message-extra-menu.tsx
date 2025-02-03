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
import {characters, skills} from '~/lib/names';
import { useContext } from "react";
import { TextEditorContext } from "~/components/editor/text-editor-provider";

export function MessageExtraMenu({message, removeMessage, data, saveData, moveMessageUp, moveMessageDown}: {
  message: Message,
  removeMessage: () => void,
  data: DiscoData,
  saveData: (data: DiscoData) => void,
  moveMessageUp: () => void,
  moveMessageDown: () => void,
}) {
  const [open, setOpen] = React.useState(false);
  const editor = useContext(TextEditorContext);

  function addImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (!editor) return;
        const source = fileReader.result;
        if (!source) return;
        const src = typeof source === 'string' ? source : Buffer.from(source).toString();
        editor.chain().focus().setImage({ src: src }).run();
      };
    };
    fileInput.click();
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="message-menu-button h-8 text-base px-2 ml-auto text-zinc-400 sm:absolute -left-8 transition">
          <Ellipsis className="h-4 w-4 hidden sm:block"/>
          <EllipsisVertical className="h-4 w-4 mb-1 sm:hidden"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <DropdownMenuItem onSelect={addImage}>
          <ImagePlus className="mr-2 h-4 w-4"/>
          Add image
        </DropdownMenuItem>
        <TypeSelect message={message} data={data} saveData={saveData}/>
        <PortraitSelect message={message} data={data} saveData={saveData} setOpen={setOpen}/>
        <DropdownMenuSeparator/>
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