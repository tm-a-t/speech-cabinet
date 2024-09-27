"use client";

import { type DiscoData, type Message } from "~/lib/disco-data";
import { MessageView } from "~/components/play-mode/message-view";
import React, { useEffect, useMemo, useState } from "react";
import { getMessageDuration, startDelay } from "~/lib/time";
import { getPortraitUrl, uniqueValues } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import {
  getCharacterSoundName,
  playMusic,
  playSound,
  stopMusic,
} from "~/lib/music";
import NextImage from "next/image";
import portraitFrame from "../../../public/layout/frame.png";

export function Player({ data }: { data: DiscoData }) {
  const playerHeight = 1920;

  const [shownMessages, setShownMessages] = useState<Message[]>([]);
  const [isLastMessageShown, setIsLastMessageShown] = useState(false);
  const [yPosition, setYPosition] = useState(1536); // 1536 = playerHeight - 2x padding

  const messageSounds = useMemo(
    () =>
      data.messages.map((message) => getCharacterSoundName(message.name, data)),
    [data],
  );
  const messagePortraits = useMemo(
    () => data.messages.map((message) => getPortraitUrl(message.name, data)),
    [data],
  );
  const [shownPortrait, setShownPortrait] = useState<string | null>(null);

  useEffect(() => {
    setYPosition(
      playerHeight - (document.getElementById("messages")?.clientHeight ?? 0),
    );
    setShownPortrait(messagePortraits[shownMessages.length - 1] ?? null);

    if (shownMessages.length < data.messages.length) {
      const lastMessage = shownMessages[shownMessages.length - 1];
      const delay = lastMessage ? getMessageDuration(lastMessage) : startDelay;
      const timer = setTimeout(() => {
        playSound(messageSounds[shownMessages.length]);
        setShownMessages([
          ...shownMessages,
          data.messages[shownMessages.length]!,
        ]);
        setIsLastMessageShown(false);
        setTimeout(() => setIsLastMessageShown(true), 100);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [shownMessages, messagePortraits, messageSounds, data]);

  useEffect(() => {
    // Preload images
    uniqueValues(messagePortraits).forEach((url) => {
      if (url) new Image().src = url;
    });

    // Preload sounds
    uniqueValues(messageSounds).forEach((url) => {
      if (url) new Audio().src = url;
    });

    const music = playMusic(data.music, data.skipMusicIntro);
    return () => {
      if (music) stopMusic(music);
    };
  }, [data.music, data.skipMusicIntro, messagePortraits, messageSounds]);

  return (
    <div className="relative h-[1920px] w-[1080px] overflow-hidden font-disco">
      <div
        id="tape-background"
        className="tape-background absolute bottom-0 left-0 right-0"
        style={{
          top: yPosition - playerHeight,
          transition: "top .3s cubic-bezier(.1, .3, .7, .9)",
        }}
      ></div>
      {data.showPortraits && shownMessages.length && shownPortrait != "" && (
        <div className="aspect-portrait absolute left-4 top-32 z-20 flex h-auto w-[27rem] items-center justify-center">
          <NextImage
            src={portraitFrame}
            className="absolute top-1/2 -translate-y-1/2"
            alt=""
          />
          {shownPortrait ? (
            <NextImage
              src={shownPortrait}
              alt=""
              className="absolute w-full px-6"
              width={720}
              height={1000}
            />
          ) : (
            <Skeleton className="aspect-portrait" />
          )}
        </div>
      )}

      <div
        id="messages"
        className={"absolute px-20 py-48 text-[2.75rem] leading-[4.5rem]"}
        style={{
          top: yPosition + "px",
          transition: "top .3s cubic-bezier(.1, .4, .6, .9)",
        }}
      >
        {shownMessages.map((message, index) => (
          <MessageView
            message={message}
            data={data}
            className={
              !isLastMessageShown && index + 1 === shownMessages.length
                ? "opacity-0"
                : ""
            }
            key={index + message.name + message.text}
          />
        ))}
      </div>
    </div>
  );
}
