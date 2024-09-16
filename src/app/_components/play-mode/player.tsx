'use client';

import {Message, SavedData} from "../../_lib/data-types";
import {MessageView} from '~/app/_components/play-mode/message-view';
import React, {useEffect, useState} from 'react';
import { getMessageDuration, startDelay } from "../../_lib/time";
import {cn, getDefaultPortraitUrl, getPortraitUrl } from "~/app/_lib/utils";
import {SkeletonImage} from '~/app/_components/ui/skeleton-image';

export function Player({data}: { data: SavedData }) {
  const playerHeight = 1920;

  const [shownMessages, setShownMessages] = useState<Message[]>([]);
  const [isLastMessageShown, setIsLastMessageShown] = useState(false);
  const [yPosition, setYPosition] = useState(900);

  const [messagePortraits, setMessagePortraits] = useState<Array<string | null>>([]);
  const [shownPortrait, setShownPortrait] = useState<string | null>(null);

  useEffect(() => {
    setYPosition(playerHeight - (document.getElementById('messages')?.clientHeight ?? 0));
    setShownPortrait(messagePortraits[shownMessages.length - 1] ?? null);

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
  }, [shownMessages, messagePortraits]);

  useEffect(() => {
    Promise.all(
      data.messages.map(async message => {
        const url = getPortraitUrl(message.name, data);
        return (await fetch(url)).status === 200 ? url : null;
      }),
    ).then(result => setMessagePortraits(result));
  }, []);

  return (
    <div className="relative w-[1080px] h-[1920px] overflow-hidden">
      <div id="tape-background" className="tape-background absolute left-0 right-0 bottom-0"
           style={{top: yPosition - playerHeight, transition: 'top .3s cubic-bezier(.1, .3, .7, .9)'}}></div>
      {data.showPortraits &&
        <SkeletonImage src={shownPortrait ?? ''} alt="" className={cn('absolute aspect-portrait z-20 w-96 top-32 left-5 border shadow-lg')}/>
      }
      <div id="messages" className={"absolute px-20 py-48 text-[2.75rem] leading-[4.5rem]"}
           style={{top: yPosition + 'px', transition: 'top .3s cubic-bezier(.1, .3, .7, .9)'}}>
        {shownMessages.map((message, index) =>
          <MessageView
            message={message}
            data={data}
            className={!isLastMessageShown && index + 1 === shownMessages.length ? "opacity-0" : ""}
            key={index + message.name + message.text[0]}/>
        )}
      </div>
    </div>
  );
}

