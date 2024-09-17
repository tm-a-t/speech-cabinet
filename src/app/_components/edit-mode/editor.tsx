import {Message, DiscoData} from "~/app/_lib/data-types";
import {Button} from '~/app/_components/ui/button';
import React from 'react';
import {MessageEditor} from "./message-editor";
import {uniqueValues} from '~/app/_lib/utils';

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
        {
          text: '',
          name: secondLastMessage?.name ?? lastMessage?.name ?? 'You',
        },
      ],
    });
  }

  return (
    <div className="container mx-auto px-6 sm:px-12 max-w-xl pb-64 pt-28 lg:pt-12 h-full min-h-dvh tape-background">
      {data?.messages.map((message, index) =>
        <MessageEditor
          message={message}
          saveMessage={m => saveMessage(index, m)}
          removeMessage={() => removeMessage(index)}
          data={data}
          saveData={saveData}
          usedNames={usedNames}
          key={index + message.name + message.text[0]}/>,
      )}
      <Button variant="ghost" onClick={addMessage} className="mt-4 opacity-30 hover:opacity-100 transition-opacity block pl-3">+ Add line</Button>
    </div>
  );
}
