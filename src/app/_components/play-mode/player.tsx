'use client';

import {Message, SavedData} from "../../_lib/data-types";
import {MessageView} from '~/app/_components/play-mode/message-view';
import {useEffect, useState} from 'react';
import { getMessageDuration, startDelay } from "../../_lib/time";

export function Player({data}: { data: SavedData }) {
  const playerHeight = 1280;
  const [shownMessages, setShownMessages] = useState<Message[]>([]);
  const [isLastMessageShown, setIsLastMessageShown] = useState(false);
  const [yPosition, setYPosition] = useState(900);

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
  }, [shownMessages]);

  return (
    <div className="relative w-[720px] h-[1280px] overflow-hidden">
      <div id="tape-background" className="tape-background absolute left-0 right-0 bottom-0"
           style={{top: yPosition - playerHeight, transition: 'top .3s cubic-bezier(.1, .3, .7, .9)'}}></div>
      <div id="messages" className={"absolute px-12 py-48 text-3xl leading-[3rem]"}
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

