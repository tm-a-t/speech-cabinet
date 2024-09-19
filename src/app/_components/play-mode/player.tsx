'use client';

import {Message, DiscoData} from "../../_lib/data-types";
import {MessageView} from '~/app/_components/play-mode/message-view';
import React, {useEffect, useState} from 'react';
import {getMessageDuration, startDelay} from "../../_lib/time";
import {cn, getDefaultPortraitUrl, getPortraitUrl} from "~/app/_lib/utils";
import {Skeleton} from '~/app/_components/ui/skeleton';
import {playCharacterSound, playMusic, stopMusic} from '~/app/_lib/music';

export function Player({data}: { data: DiscoData }) {
  const playerHeight = 1920;

  const [shownMessages, setShownMessages] = useState<Message[]>([]);
  const [isLastMessageShown, setIsLastMessageShown] = useState(false);
  // can't figure out the math, this is the position when the background doesn't scroll
  const [yPosition, setYPosition] = useState(1540);

  const [messagePortraits, setMessagePortraits] = useState<Array<string | null>>([]);
  const [shownPortrait, setShownPortrait] = useState<string | null>(null);

  useEffect(() => {
    setYPosition(playerHeight - (document.getElementById('messages')?.clientHeight ?? 0));
    setShownPortrait(messagePortraits[shownMessages.length - 1] ?? null);

    if (shownMessages.length < data.messages.length) {
      const lastMessage = shownMessages[shownMessages.length - 1];
      const delay = lastMessage ? getMessageDuration(lastMessage) : startDelay;
      const timer = setTimeout(() => {
        playCharacterSound(data.messages[shownMessages.length]!.name, data);
        setShownMessages([
          ...shownMessages,
          data.messages[shownMessages.length]!,
        ]);
        setIsLastMessageShown(false);
        setTimeout(() => setIsLastMessageShown(true), 100);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [shownMessages, messagePortraits]);

  useEffect(() => {
    void Promise.all(
      data.messages.map(async message => {
        const url = getPortraitUrl(message.name, data);
        return (await fetch(url)).status === 200 ? url : null;
      }),
    ).then(result => setMessagePortraits(result));

    const music = playMusic(data.music, data.skipMusicIntro);
    return () => stopMusic(music);
  }, []);

  return (
    <div className="relative w-[1080px] h-[1920px] overflow-hidden">
      <div id="tape-background" className="tape-background absolute left-0 right-0 bottom-0"
           style={{top: yPosition - playerHeight, transition: 'top .3s cubic-bezier(.1, .3, .7, .9)'}}></div>
      {data.showPortraits && shownMessages.length && shownPortrait !== null && <div className="absolute aspect-portrait z-20 w-[27rem] h-auto top-32 left-4 flex items-center justify-center">
        <img src="/frame.png" className="absolute top-1/2 -translate-y-1/2" alt=""/>
        {shownPortrait
          ? <img src={shownPortrait} alt="" className="absolute px-6 w-full"/>
          : <Skeleton className="aspect-portrait"/>
        }
      </div>}
      <div id="messages" className={"absolute px-20 py-48 text-[2.75rem] leading-[4.5rem]"}
           style={{top: yPosition + 'px', transition: 'top .3s cubic-bezier(.1, .3, .7, .9)'}}>
        {shownMessages.map((message, index) =>
          <MessageView
            message={message}
            data={data}
            className={!isLastMessageShown && index + 1 === shownMessages.length ? "opacity-0" : ""}
            key={index + message.name + message.text}/>,
        )}
      </div>
    </div>
  );
}

