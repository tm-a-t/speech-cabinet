'use client';

import {Message, SavedData} from "../../_lib/data-types";
import {MessageView} from '~/app/_components/play-mode/message-view';
import {useEffect, useState} from 'react';
import { getMessageDuration, startDelay } from "./time";

export function Player({data}: { data: SavedData }) {
  const playerHeight = 1280;
  const [shownMessages, setShownMessages] = useState<Message[]>([]);
  const [isLastMessageShown, setIsLastMessageShown] = useState(false);
  const [yPosition, setYPosition] = useState(playerHeight);

  useEffect(() => {
    setYPosition(playerHeight - (document.getElementById('messages')?.clientHeight ?? 0));
    if (shownMessages.length < data.messages.length) {
      const lastMessage = shownMessages[shownMessages.length - 1];
      const delay = lastMessage ? getMessageDuration(lastMessage) : startDelay;
      setTimeout(() => {
        setShownMessages([
          ...shownMessages,
          data.messages[shownMessages.length]!,
        ]);
        setIsLastMessageShown(false);
        setTimeout(() => setIsLastMessageShown(true), 100)
      }, delay);
    }
  });

  return (
    <div className="relative w-[720px] h-[1280px] overflow-hidden bg-stone-900 m-auto">
      <div id="messages" className={"absolute px-8 py-32 text-2xl leading-[2.75rem]"}
           style={{top: yPosition + 'px', transition: 'top .3s cubic-bezier(.1, .3, .7, .9)'}}>
        {shownMessages.map((message, index) =>
          <MessageView
            message={message}
            className={!isLastMessageShown && index + 1 === shownMessages.length ? "opacity-0" : ""}
            key={index + message.name + message.text[0]}/>
        )}
      </div>
    </div>
  );
}

