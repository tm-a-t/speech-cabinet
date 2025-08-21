import {MessageExtraMenu} from '~/components/editor/message-extra-menu';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '~/components/ui/select';
import React, { useContext } from "react";
import {difficulties, type Difficulty, type DiscoData, type Message, type Result} from '~/lib/disco-data';
import {skills} from '~/lib/names';
import {NameSelect} from '~/components/editor/name-select';
import { MessageEditorContext, TextEditorProvider } from "~/components/editor/text-editor-provider";
import { EditorContent } from "@tiptap/react";
import { cn } from "~/lib/utils";
import { Dices } from "lucide-react";

export function MessageView(
  {
    message,
    saveMessage,
    removeMessage,
    data,
    saveData,
    moveMessageUp,
    moveMessageDown,
    usedNames,
  }: {
    message: Message,
    saveMessage: (m: Message) => void,
    removeMessage: () => void,
    data: DiscoData,
    saveData: (data: DiscoData) => void,
    moveMessageUp: () => void,
    moveMessageDown: () => void,
    usedNames: string[],
  },
) {
  const editor = useContext(MessageEditorContext);
  const showCheck = data.overrides.checks[message.name] ?? skills.includes(message.name);

  function handleCheckToggle(value: boolean) {
    saveMessage({
      ...message,
      check: value
        ? {difficulty: 'Medium', result: 'Success', active: false}
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
        ...(message.check ?? {result: 'Success', active: false}),
        difficulty: value,
      },
    });
  }

  function handleCheckResultSelect(value: string) {
    const [result, active] = value.split(' ');
    saveMessage({
      ...message,
      check: message.check && {
        ...message.check,
        result: result as Result,
        active: active === 'true',
      },
    });
  }

  return (
    <div className="font-disco sm:pl-6 leading-7 [&:not(:first-child)]:mt-3 sm:[&:not(:first-child)]:mt-5 sm:[&:not(:hover)_.message-menu-button]:opacity-0">
      <span className="inline-block sm:h-0 sm:-ml-6 -ml-1 -mr-1 w-full sm:w-auto">
        <span className="relative sm:h-0 flex sm:-ml-3 w-full sm:w-auto">
          <span>
            <NameSelect message={message} saveMessage={saveMessage} usedNames={usedNames} data={data}/>

            {showCheck &&
              <span className="inline-block ml-2">
                  <Select onValueChange={handleCheckDifficultySelect} value={message.check?.difficulty ?? 'none'}>
                    <SelectTrigger
                      className="h-8 px-1 sm:px-1 sm:text-base text-zinc-400 dark:bg-transparent dark:border-0 hover:dark:bg-zinc-800 hover:text-white transition">
                      <SelectValue/>
                      {/*{message.check && ':'}*/}
                    </SelectTrigger>
                    <SelectContent className="w-60">
                      <SelectItem value="none">No skill check</SelectItem>
                      {difficulties.options.map(difficulty =>
                        <SelectItem value={difficulty} key={difficulty}>{difficulty}</SelectItem>,
                      )}
                    </SelectContent>
                  </Select>

                {showCheck && message.check &&
                  <Select onValueChange={handleCheckResultSelect} value={`${message.check.result} ${message.check.active}`}>
                    <SelectTrigger
                      className="h-8 px-1 sm:px-1 sm:text-base text-zinc-400 dark:bg-transparent dark:border-0 hover:dark:bg-zinc-800 hover:text-white transition">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Failure false">Failure</SelectItem>
                      <SelectItem value="Success false">Success</SelectItem>
                      <SelectItem value="Failure true">Failure <Dices className="inline h-4" /></SelectItem>
                      <SelectItem value="Success true">Success <Dices className="inline h-4" /></SelectItem>
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
      <span className="text-zinc-300 block sm:inline border-b sm:border-0 px-2 pb-3 sm:p-0 rounded">
          <EditorContent editor={editor} className={cn("sm:inline [&_p:not(:first-child)]:mt-4 sm:[&_p:first-child]:inline [&_img]:w-full [&_img]:mt-1")}/>
      </span>
    </div>
  );
}
