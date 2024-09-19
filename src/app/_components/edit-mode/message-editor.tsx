import {MessageExtraMenu} from '~/app/_components/edit-mode/message-extra-menu';
import {Button} from '~/app/_components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '~/app/_components/ui/select';
import {MessageTextEditor} from '~/app/_components/edit-mode/message-text-editor';
import React from 'react';
import {difficulties, Difficulty, Message, Result, DiscoData} from '~/app/_lib/data-types';
import {DropdownMenu, DropdownMenuTrigger} from '../ui/dropdown-menu';
import {cn} from '~/app/_lib/utils';
import {skills} from '~/app/_lib/names';
import {NameSelect} from '~/app/_components/edit-mode/name-select';

export function MessageEditor({message, saveMessage, removeMessage, data, saveData, moveMessageUp, moveMessageDown, usedNames}: {
  message: Message,
  saveMessage: (m: Message) => void,
  removeMessage: () => void,
  data: DiscoData,
  saveData: (data: DiscoData) => void,
  moveMessageUp: () => void,
  moveMessageDown: () => void,
  usedNames: string[],
}) {
  const showCheck = data.overrides.checks[message.name] ?? skills.includes(message.name);

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
    <div className="sm:pl-6 leading-7 [&:not(:first-child)]:mt-8 sm:[&:not(:first-child)]:mt-5 sm:[&:not(:hover)_.message-menu-button]:opacity-0">
      <span className="inline-block sm:h-0 sm:-ml-6 -ml-1 -mr-1 w-full sm:w-auto">
        <span className="relative sm:h-0 flex sm:-ml-3 w-full sm:w-auto">
          <span>
            <NameSelect message={message} saveMessage={saveMessage} setOpen={() => {}} usedNames={usedNames} data={data}/>

            {showCheck &&
              <span className="inline-block">
                  <Select onValueChange={handleCheckDifficultySelect} value={message.check?.difficulty ?? 'none'}>
                    <SelectTrigger
                      className="h-8 px-1 sm:px-1 sm:text-base text-zinc-400 dark:bg-transparent dark:border-0 hover:dark:bg-zinc-800 hover:text-white transition">
                      <SelectValue/>
                      {/*{message.check && ':'}*/}
                    </SelectTrigger>
                    <SelectContent className="w-60">
                      <SelectItem value="none">No skill check</SelectItem>
                      {difficulties.map(difficulty =>
                        <SelectItem value={difficulty} key={difficulty}>{difficulty}</SelectItem>,
                      )}
                    </SelectContent>
                  </Select>

                {showCheck && message.check &&
                  <Select onValueChange={handleCheckResultSelect} value={message.check.result}>
                    <SelectTrigger
                      className="h-8 px-1 sm:px-1 sm:text-base text-zinc-400 dark:bg-transparent dark:border-0 hover:dark:bg-zinc-800 hover:text-white transition">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Failure">Failure</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                }
              </span>
            }
          </span>

          <MessageExtraMenu message={message}
                            removeMessage={removeMessage}
                            data={data}
                            saveData={saveData}
                            moveMessageUp={moveMessageUp}
                            moveMessageDown={moveMessageDown}/>
        </span>
      </span>

      <span className="text-zinc-300 hidden sm:inline"> &ndash; </span>
      <span className="text-zinc-300 block sm:inline border-b sm:border-0 px-2 sm:p-0 mt-2 sm:m-0 rounded">
        <MessageTextEditor content={message.text} onUpdate={handleTextUpdate}/>
      </span>
    </div>
  );
}
