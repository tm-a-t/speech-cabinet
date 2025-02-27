"use client";

import { type DiscoData, type Message } from "~/lib/disco-data";
import { MessageView } from "~/components/player/message-view";
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
import { AshesBackground } from "~/components/player/ashes-background";

const portraitFrameUrl = '/layout/frame.png'

export function Player({ data }: { data: DiscoData }) {
  const playerHeight = 1920;

  const [shownMessages, setShownMessages] = useState<{
    all: Message[];
    lastIsShown: boolean;
  }>({ all: [], lastIsShown: true });
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
  const shownPortrait = messagePortraits[shownMessages.all.length - 1] ?? null;

  const [imagesArePreloaded, setImagesArePreloaded] = useState(false);
  const [soundsArePreloaded, setSoundsArePreloaded] = useState(false);

  useEffect(() => {
    if (!imagesArePreloaded || !soundsArePreloaded) return;

    setYPosition(
      playerHeight - (document.getElementById("messages")?.clientHeight ?? 0),
    );
    const index = shownMessages.all.length;

    if (index < data.messages.length) {
      const lastMessage = shownMessages.all[index - 1];
      const delay = lastMessage ? getMessageDuration(lastMessage) : startDelay;
      const timer = setTimeout(() => {
        const all = [...shownMessages.all, data.messages[index]!];
        playSound(messageSounds[index]);
        setShownMessages({ all, lastIsShown: false });
        setTimeout(() => setShownMessages({ all, lastIsShown: true }), 100);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [soundsArePreloaded, imagesArePreloaded, shownMessages, data, messageSounds]);

  useEffect(() => {
    const uniqueImages = [...uniqueValues(messagePortraits), portraitFrameUrl];
    void Promise.allSettled(uniqueImages.map(preloadImage))
      .then(() => setImagesArePreloaded(true));
    const uniqueSounds = uniqueValues(messageSounds).filter(v => v !== null);
    void Promise.allSettled(uniqueSounds.map(preloadAudio))
      .then(() => setSoundsArePreloaded(true));

    const music = playMusic(data.music, data.skipMusicIntro);
    return () => {
      if (music) stopMusic(music);
    };
  }, [data, messagePortraits, messageSounds]);

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

      {data.showParticles && <AshesBackground/>}

      {data.showPortraits && shownMessages.all.length && shownPortrait !== '' && (
        <div className="aspect-portrait absolute left-4 top-32 z-20 flex h-auto w-[27rem] items-center justify-center">
          <img
            src={portraitFrameUrl}
            className="absolute top-1/2 -translate-y-1/2"
            alt=""
          />
          {shownPortrait ? (
            <img
              key={shownPortrait}
              src={shownPortrait}
              alt=""
              className="absolute w-full px-6"
            />
          ) : (
            <Skeleton className="aspect-portrait w-full" />
          )}
        </div>
      )}

      <div
        id="messages"
        className={"absolute px-20 py-48 text-[2.75rem] leading-[4.5rem] w-full"}
        style={{
          top: yPosition + "px",
          transition: "top .3s cubic-bezier(.1, .4, .6, .9)",
        }}
      >
        {shownMessages.all.map((message, index) => (
          <MessageView
            message={message}
            data={data}
            className={
              shownMessages.lastIsShown || index + 1 !== shownMessages.all.length
                ? "opacity-100 [&:not(:last-child)]:opacity-60"
                : ""
            }
            key={message.id}
          />
        ))}
      </div>
    </div>
  );
}

function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = image.onabort = () => reject(Error());
    image.src = src;
  });
}

function preloadAudio(src: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();

    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = audio.onabort = () => reject(Error());
    audio.src = src;
  });
}
