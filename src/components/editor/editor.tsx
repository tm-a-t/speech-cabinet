import { type DiscoData, type Message, message} from "~/lib/disco-data";
import {Button} from '~/components/ui/button';
import React, { useContext } from 'react';
import {MessageView} from "./message-view";
import { uniqueValues} from '~/lib/utils';
import { totalDuration, totalTimeLimit } from "~/lib/time";
import { WatchButton } from "~/components/editor/watch-button";
import {
  CoverImageEditorContext,
  MessageEditorContext,
  TextEditorProvider,
} from "./text-editor-provider";
import { EditorContent } from "@tiptap/react";
import { useIsDesktop } from "~/lib/hooks/use-media-query";

export function Editor({data, saveData}: { data: DiscoData, saveData: (data: DiscoData) => void }) {
  const usedNames = uniqueValues(data?.messages.map(message => message.name)) ?? [];
  const isDesktop = useIsDesktop();

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
      {data.cover && <CoverEditor />}

      {data?.messages.map((message, index) => (
        <TextEditorProvider
          context={MessageEditorContext}
          key={message.id}
          content={message.text}
          placeholder="Type a line"
          onUpdate={(text) => saveMessage(index, { ...message, text })}
        >
          <MessageView
            message={message}
            saveMessage={(m) => saveMessage(index, m)}
            removeMessage={() => removeMessage(index)}
            moveMessageUp={() => moveMessageDown(index - 1)}
            moveMessageDown={() => moveMessageDown(index)}
            data={data}
            saveData={saveData}
            usedNames={usedNames}
          />
        </TextEditorProvider>
      ))}

      <hr className="mb-1 border-transparent md:mt-6 sm:border-zinc-700" />

      <div className="fixed md:static bottom-4 left-0 right-0 -ml-1 flex justify-between px-4 md:px-0">
        <Button
          variant={isDesktop ? "ghost" : "secondary"}
          size={isDesktop ? "default" : "lg"}
          onClick={addMessage}
          className={`block transition-opacity sm:pl-3 ${isDesktop && "opacity-30 hover:opacity-100"}`}
        >
          + Add line
        </Button>

        {data && <WatchButton data={data} />}
      </div>

      {totalDuration(data) > totalTimeLimit && (
        <div className="mt-12 px-2 font-serif leading-6 opacity-60 sm:px-0">
          <p>
            Sorry, Speech Cabinet only renders up to {totalTimeLimit / 1000}{" "}
            seconds of mp4 video. Your dialogue is{" "}
            {Math.ceil(totalDuration(data) / 1000)} seconds long.
          </p>
        </div>
      )}
    </>
  );
}

function CoverEditor() {
  const editor = useContext(CoverImageEditorContext);

  return <div className="mx-2 sm:mx-0 border-b sm:border-0 pb-2 sm:pb-0">
    <div className={`mb-2 sm:mb-8 ${editor?.isEmpty ? 'hidden' : ''}`}>
      <EditorContent editor={editor} className="text-sm [&_[data-placeholder]]:-mt-4 [&_img]:w-full w-full"></EditorContent>
    </div>
  </div>
}
