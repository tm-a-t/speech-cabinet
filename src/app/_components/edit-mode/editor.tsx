import {Message, SavedData} from "~/app/_lib/data-types";
import {Button} from '~/app/_components/ui/button';
import React from 'react';
import {MessageEditor} from "./message-editor";
import {uniqueValues} from '~/app/_lib/utils';

export function Editor({data, saveData}: { data: SavedData, saveData: (data: SavedData) => void }) {
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
        {
          text: '',
          name: secondLastMessage?.name ?? lastMessage?.name ?? 'You',
        },
      ],
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

  return (
    <div className="container mx-auto pl-6 pr-4 sm:px-12 max-w-xl pb-64 pt-16 h-full min-h-dvh tape-background">
      {data?.messages.map((message, index) =>
        <MessageEditor
          message={message}
          saveMessage={m => saveMessage(index, m)}
          removeMessage={() => removeMessage(index)}
          usedNames={usedNames}
          key={index + message.name + message.text[0]}/>,
      )}
      <Button variant="ghost" onClick={addMessage} className="mt-4 text-zinc-500 w-full pl-3">+ Add line</Button>
    </div>
  );
}
