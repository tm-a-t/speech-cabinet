import {
  DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '~/app/_components/ui/dropdown-menu';
import {Pencil} from 'lucide-react';
import {getColorClass} from '~/app/_lib/utils';
import * as React from 'react';
import {Message, SavedData} from '~/app/_lib/data-types';
import {characters, skills} from '~/app/_lib/names';

export function TypeSelect({message, data, saveData}: {
  message: Message,
  data: SavedData,
  saveData: (data: SavedData) => void,
}) {
  if (characters.includes(message.name) || skills.includes(message.name)) {
    return
  }

  function handleSelectColorClass(value: string) {
    const allowChecks = value !== '';
    saveData({
      ...data,
      overrides: {
        ...data.overrides,
        colorClass: {
          ...data.overrides.colorClass,
          [message.name]: value,
        },
        checks: {
          ...data.overrides.checks,
          [message.name]: allowChecks,
        },
      }
    });
  }

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Pencil className="mr-2 h-4 w-4"/>
          Set type
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={getColorClass(message.name, data)} onValueChange={handleSelectColorClass}>
              <DropdownMenuRadioItem value="">
                Regular character
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="text-intellect" className="text-intellect">
                Intellect skill
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="text-psyche" className="text-psyche">
                Psyche skill
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="text-physique" className="text-physique">
                Physique skill
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="text-motorics" className="text-motorics">
                Motorics skill
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </>
  );
}