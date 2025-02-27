import {type DiscoData, type Message, message} from "~/lib/disco-data";
import {Button} from '~/components/ui/button';
import React from 'react';
import {MessageView} from "./message-view";
import {uniqueValues} from '~/lib/utils';
import { totalDuration, totalTimeLimit } from "~/lib/time";
import { WatchButton } from "~/components/editor/watch-button";
import { TextEditorProvider } from "./text-editor-provider";

export function Editor({data, saveData}: { data: DiscoData, saveData: (data: DiscoData) => void }) {
  const usedNames = uniqueValues(data?.messages.map(message => message.name)) ?? [];

  function saveMessage(index: number, message: Message) {
    if (data === null) return;
    saveData({
      ...data,
      messages: data.messages.map((m, i) =>
        i === index ? message : m,
      ),
    });
  }

  function removeMessage(index: number) {
    if (data === null) return;
    saveData({
      ...data,
      messages: data.messages.filter((_, i) =>
        i !== index,
      ),
    });
  }

  function addMessage() {
    if (data === null) return;

    const lastMessage = data.messages.length
      ? data.messages[data.messages.length - 1]
      : null;

    const secondLastMessage = data.messages.length > 1
      ? data.messages[data.messages.length - 2]
      : null;

    saveData({
      ...data,
      messages: [
        ...data.messages,
        message.parse({
          text: '',
          name: secondLastMessage?.name ?? lastMessage?.name ?? 'You',
        }),
      ],
    });
  }

  function moveMessageDown(index: number) {
    if (data === null) return;
    if (index < 0 || index + 1 >= data.messages.length) return;

    saveData({
      ...data,
      messages: data.messages.map((m, i) => {
        if (i === index) return data.messages[index + 1]!;
        if (i === index + 1) return data.messages[index]!;
        return m;
      }),
    });
  }

  return (
    <>
      {data?.messages.map((message, index) =>
        <TextEditorProvider key={message.id} content={message.text} onUpdate={text => saveMessage(index, {...message, text})}>
          <MessageView
            message={message}
            saveMessage={m => saveMessage(index, m)}
            removeMessage={() => removeMessage(index)}
            moveMessageUp={() => moveMessageDown(index - 1)}
            moveMessageDown={() => moveMessageDown(index)}
            data={data}
            saveData={saveData}
            usedNames={usedNames} />
        </TextEditorProvider>,
      )}

      <hr className="border-transparent sm:border-zinc-800 sm:mt-6 mb-1" />

      <div className="flex justify-between -ml-1">
        <Button variant="ghost" onClick={addMessage}
                className="opacity-30 hover:opacity-100 transition-opacity block sm:pl-3">+ Add line</Button>

        {data &&
          <WatchButton data={data} />
        }
      </div>

      {totalDuration(data) > totalTimeLimit &&
        <div className="mt-12 opacity-60 px-2 sm:px-0 font-serif leading-6">
          <p>
            Sorry, Speech Cabinet only renders up to {totalTimeLimit / 1000} seconds of mp4 video.
            Your dialogue is {Math.ceil(totalDuration(data) / 1000)} seconds long.
          </p>
        </div>
      }
    </>
  );
}
