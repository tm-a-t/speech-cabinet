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
    <div className="container mx-auto px-1 max-w-xl mb-64">
      <h1 className="text-2xl mt-8">Disco Elysium Dialogue Builder</h1>
      <p className="mt-3 mb-12">Edit some lines and export dialogue animation.</p>

      {data?.messages.map((message, index) =>
        <MessageEditor
          message={message}
          saveMessage={m => saveMessage(index, m)}
          removeMessage={() => removeMessage(index)}
          usedNames={usedNames}
          key={index + message.name + message.text[0]}/>,
      )}
      <Button variant="secondary" onClick={addMessage} className="mt-10">+ Add line</Button>
    </div>
  );
}
