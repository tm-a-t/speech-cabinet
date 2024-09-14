import {NameInput} from '~/app/_components/edit-mode/name-input';
import {Button} from '~/app/_components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '~/app/_components/ui/select';
import MessageTextEditor from '~/app/_components/edit-mode/message-text-editor';
import React from 'react';
import {difficulties, Difficulty, Message, Result} from '~/app/_lib/data-types';
import {cn} from '~/app/_lib/utils';
import { nameClass } from '~/app/_lib/names';

export function MessageView({message, className}: { message: Message, className?: string }) {
  return (
    <div className={cn("pl-8 [&:not(:first-child)]:mt-6", className)} style={{transition: ".2s opacity linear"}}>
      <span className={cn("-ml-8 uppercase tracking-wider", nameClass[message.name])}>{message.name}</span>
      {message.check &&
        <span className="text-stone-500"> [
          {message.check.difficulty}: {message.check.result}
          ]</span>
      }

      <span className="text-speech"> &ndash; </span>
      <span className="text-speech" dangerouslySetInnerHTML={{__html: message.text}}></span>
    </div>
  );
}
