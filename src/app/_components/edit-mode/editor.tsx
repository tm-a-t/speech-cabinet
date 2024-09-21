import {type Message, type DiscoData, message} from "~/app/_lib/data-types";
import {Button} from '~/app/_components/ui/button';
import React, {useState} from 'react';
import {MessageEditor} from "./message-editor";
import {uniqueValues} from '~/app/_lib/utils';
import {totalDuration, totalTimeLimit} from '~/app/_lib/time';

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
    <div className="container mx-auto px-6 sm:px-24 max-w-2xl pb-64 pt-24 xl:pt-12 h-full min-h-dvh tape-background">
      {data?.messages.map((message, index) =>
        <MessageEditor
          message={message}
          saveMessage={m => saveMessage(index, m)}
          removeMessage={() => removeMessage(index)}
          moveMessageUp={() => moveMessageDown(index - 1)}
          moveMessageDown={() => moveMessageDown(index)}
          data={data}
          saveData={saveData}
          usedNames={usedNames}
          key={message.id}/>,
      )}
      <Button variant="ghost" onClick={addMessage}
              className="mt-4 -ml-1 opacity-30 hover:opacity-100 transition-opacity block sm:pl-3">+ Add line</Button>

      {totalDuration(data) > totalTimeLimit &&
        <div className="mt-12 opacity-60 px-2 sm:px-0 font-serif leading-6">
          <p>
            Sorry, your dialogue is {Math.ceil(totalDuration(data) / 1000)} seconds long.
            The site only renders up to {totalTimeLimit / 1000} seconds of mp4 video:
            it has just launched and I&apos;m not sure it will handle the load.
          </p>
          <p className="mt-2">
            You can edit the dialogue and preview the video as usual.
            I will increase the rendering limit if the site doesn&apos;t crash in the first few days.
            The lines are cached in your browser, but you can download the file if you want to keep them safely.
          </p>
        </div>
      }
    </div>
  );
}
