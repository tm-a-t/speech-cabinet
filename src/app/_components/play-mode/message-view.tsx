import {CharacterMenu} from '~/app/_components/edit-mode/character-menu';
import {Button} from '~/app/_components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '~/app/_components/ui/select';
import React from 'react';
import {difficulties, Difficulty, Message, Result, DiscoData} from '~/app/_lib/data-types';
import {cn, getColorClass} from '~/app/_lib/utils';
import {skillColorClass, skills} from '~/app/_lib/names';

export function MessageView({message, data, className}: { message: Message, data: DiscoData, className?: string }) {
  const showCheck = data.overrides.checks[message.name] || skills.includes(message.name);

  return (
    <div className={cn("pl-12 mt-14 [&:not(:last-child)]:opacity-60", className)}
         style={{transition: ".2s opacity linear"}}>
      <span className={cn("-ml-12 uppercase tracking-wider", getColorClass(message.name, data))}>{message.name}</span>
      {showCheck && message.check &&
        <span className="text-zinc-400"> [
          {message.check.difficulty}: {message.check.result}
          ]</span>
      }

      <span className="text-zinc-300"> &ndash; </span>
      <span className="text-zinc-300 [&>p]:mt-14 [&>p:first-child]:inline" dangerouslySetInnerHTML={{__html: message.text}}></span>
    </div>
  );
}
