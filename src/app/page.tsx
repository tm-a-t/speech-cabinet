'use client';

import React, {FocusEvent, FocusEventHandler, useEffect, useState} from 'react';
import {NameInput, NameOption, skillNames} from '~/app/_components/name-input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '~/app/_components/ui/select';
import {Dice4, Dices, Plus} from 'lucide-react';
import {Toggle} from '~/app/_components/ui/toggle';
import {Button} from '~/app/_components/ui/button';
import TextEditor from '~/app/_components/text-editor';

type SavedData = {
  messages: Array<Message>,
  version: '0.1',
}

type Message = {
  text: string,
  name: string,
  nameColor: string | null,
  check?: Check,
}

type Check = {
  difficulty: Difficulty,
  result: Result,
}

const difficulties = [
  'Trivial',
  'Easy',
  'Medium',
  'Challenging',
  'Formidable',
  'Legendary',
  'Heroic',
  'Godly',
  'Impossible',
] as const;
type Difficulty = typeof difficulties[number];
type Result = 'Success' | 'Failure';

export default function HomePage() {
  let [data, setData] = useState<SavedData | null>(null);
  let usedNames = data?.messages.map(message => message.name) ?? [];

  useEffect(() => {
    if (data == null) {
      let dataSave = JSON.parse(localStorage.getItem('data') ?? 'null');
      if (dataSave) {
        setData(dataSave);
      } else {
        // todo: default
      }
    }
  })

  function saveData(newData: SavedData) {
    setData(newData);
    localStorage.setItem('data', JSON.stringify(newData));
  }

  function saveMessage(index: number, message: Message) {
    if (data === null) return;
    saveData({
      ...data,
      messages: data.messages.map((m, i) =>
        i === index ? message : m,
      ),
    })
  }

  function addMessage() {
    if (data === null) return;

    const lastMessage = data.messages.length
      ? data.messages[data.messages.length - 1]
      : null;

    saveData({
      ...data,
      messages: [
        ...data.messages,
        {
          text: 'Hello',
          name: lastMessage?.name || 'Evrart',
          nameColor: lastMessage?.nameColor || null,
        }
      ]
    })
  }

  function removeMessage(index: number) {
    if (data === null) return;
    saveData({
      ...data,
      messages: data.messages.filter((m, i) =>
        i !== index,
      ),
    })
  }

  return (
    <main className="flex min-h-screen bg-stone-900 text-stone-50">
      <div className="container mx-auto px-1">
        {data?.messages.map((message, i) =>
          <Message message={message} saveMessage={m => saveMessage(i, m)} usedNames={usedNames} key={i}/>,
        )}
        <Button variant="ghost" onClick={addMessage}>+ Add line</Button>
      </div>
    </main>
  );
}

function Message({message, saveMessage, usedNames}: {
  message: Message,
  saveMessage: (m: Message) => void,
  usedNames: string[],
}) {
  const isSkill = skillNames.includes(message.name);

  function handleNameSelect(params: NameOption | null) {
    saveMessage({
      ...message,
      name: params?.name ?? "",
      nameColor: params?.color || null,
      check: params?.name && !skillNames.includes(params?.name)
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
      check: message.check && {
        ...message.check,
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
    <div className="pl-8 leading-7 [&:not(:first-child)]:mt-1">
      <span className="-ml-8 -mb-2 inline-flex flex-wrap items-center">
        <NameInput value={{name: message.name, color: message.nameColor ?? undefined}}
                   onSelect={handleNameSelect}
                   usedNames={usedNames}/>

        {isSkill && !message.check &&
          <Button variant="ghost" onClick={() => handleCheckToggle(true)} className="ml-0.5 text-stone-500">
            + Check
          </Button>
          // <Toggle className="ml-1"
          //         aria-label="Toggle skill check"
          //         pressed={message.check !== undefined}
          //         onPressedChange={handleCheckToggle}>
          //   <Dices className="w-4 h-4 text-stone-500"/>
          // </Toggle>
        }

        {message.check &&
          <span className="text-stone-500 inline-flex items-center">
            <Select onValueChange={handleCheckDifficultySelect} value={message.check.difficulty}>
              <SelectTrigger>
                <SelectValue/>:
              </SelectTrigger>
              <SelectContent className="w-60">
                {difficulties.map(difficulty =>
                  <SelectItem value={difficulty} key={difficulty}>{difficulty}</SelectItem>,
                )}
                <SelectItem value="none" className="text-rose-400">Remove skill check</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleCheckResultSelect} value={message.check.result}>
              <SelectTrigger>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Failure">Failure</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
              </SelectContent>
            </Select>
          </span>
        }
      </span>

      <span className="text-speech"> &ndash; </span>
      {!isSkill && <span className="text-speech">"</span>}
      {/*<span className="text-speech min-w-1" dangerouslySetInnerHTML={{__html: message.text}} contentEditable*/}
      {/*      onBlur={handleTextInput}></span>*/}
      <TextEditor content={message.text} onUpdate={handleTextUpdate}/>
      {!isSkill && <span className="text-speech">"</span>}
    </div>
  );
}
