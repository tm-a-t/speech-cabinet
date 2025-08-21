import {
  DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '~/components/ui/dropdown-menu';
import { Dices } from "lucide-react";
import {getColorClass} from '~/lib/utils';
import * as React from 'react';
import type {Message, DiscoData} from '~/lib/disco-data';
import {characters, skills} from '~/lib/names';

export function TypeSelect({message, data, saveData}: {
  message: Message,
  data: DiscoData,
  saveData: (data: DiscoData) => void,
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
          <Dices className="mr-2 h-4 w-4"/>
          Skill
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