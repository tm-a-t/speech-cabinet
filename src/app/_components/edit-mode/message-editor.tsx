import {NameInput} from '~/app/_components/edit-mode/name-input';
import {Button} from '~/app/_components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '~/app/_components/ui/select';
import MessageTextEditor from '~/app/_components/edit-mode/message-text-editor';
import React from 'react';
import {difficulties, Difficulty, Message, Result} from '~/app/_lib/data-types';
import {DropdownMenu, DropdownMenuTrigger} from '../ui/dropdown-menu';
import {cn} from '~/app/_lib/utils';
import { skills } from '~/app/_lib/names';

export function MessageEditor({message, saveMessage, usedNames, removeMessage}: {
  message: Message,
  saveMessage: (m: Message) => void,
  removeMessage: () => void,
  usedNames: string[],
}) {
  const isSkill = skills.includes(message.name);

  function handleNameSelect(params: string | null) {
    saveMessage({
      ...message,
      name: params ?? "",
      check: params && !skills.includes(params)
        ? undefined
        : message.check,
    });
  }

  function handleCheckToggle(value: boolean) {
    saveMessage({
      ...message,
      check: value
        ? {difficulty: 'Medium', result: 'Success'}
        : undefined,
    });
  }

  function handleCheckDifficultySelect(value: Difficulty | 'none') {
    if (value == 'none') {
      handleCheckToggle(false);
      return;
    }
    saveMessage({
      ...message,
      check: {
        ...(message.check ?? {result: 'Success'}),
        difficulty: value,
      },
    });
  }

  function handleCheckResultSelect(value: Result) {
    saveMessage({
      ...message,
      check: message.check && {
        ...message.check,
        result: value,
      },
    });
  }

  function handleTextUpdate(content: string) {
    saveMessage({
      ...message,
      text: content,
    });
  }

  return (
    <div className="pl-8 leading-8 [&:not(:first-child)]:mt-4">
      <span className="-ml-8 relative h-0">
        <LineElement>
          <NameInput value={message.name}
                     onSelect={handleNameSelect}
                     onRemoveLine={removeMessage}
                     usedNames={usedNames}/>
        </LineElement>

        {/*{isSkill && !message.check &&*/}
        {/*  <LineElement>*/}
        {/*    <Button variant="ghost" onClick={() => handleCheckToggle(true)} className="pl-1 pr-2 ml-0.5 text-stone-500">*/}
        {/*      + Check*/}
        {/*    </Button>*/}
        {/*  </LineElement>*/}
        {/*  // <Toggle className="ml-1"*/}
        {/*  //         aria-label="Toggle skill check"*/}
        {/*  //         pressed={message.check !== undefined}*/}
        {/*  //         onPressedChange={handleCheckToggle}>*/}
        {/*  //   <Dices className="w-4 h-4 text-stone-500"/>*/}
        {/*  // </Toggle>*/}
        {/*}*/}

        {isSkill &&
          <LineElement className="text-stone-500">
            <Select onValueChange={handleCheckDifficultySelect} value={message.check?.difficulty ?? 'none'}>
              <SelectTrigger className="h-8">
                <SelectValue/>
                {message.check && ":"}
              </SelectTrigger>
              <SelectContent className="w-60">
                <SelectItem value="none">No skill check</SelectItem>
                {difficulties.map(difficulty =>
                  <SelectItem value={difficulty} key={difficulty}>{difficulty}</SelectItem>,
                )}
              </SelectContent>
            </Select>
          </LineElement>
        }

        {message.check &&
          <LineElement className="text-stone-500">
            <Select onValueChange={handleCheckResultSelect} value={message.check.result}>
              <SelectTrigger className="h-8">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Failure">Failure</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
              </SelectContent>
            </Select>
          </LineElement>
        }
      </span>

      <span className="text-speech"> &ndash; </span>
      <span className="text-speech">
        <MessageTextEditor content={message.text} onUpdate={handleTextUpdate}/>
      </span>
    </div>
  );
}

function LineElement({children, className}: { children?: React.ReactNode, className?: string }) {
  return (
    <span className={cn(className, "inline-block h-0")}>
      {children}
    </span>
  );
}

