"use client";

import { type DiscoData, type Message } from "~/lib/disco-data";
import { MessageView } from "~/components/player/message-view";
import React, { useEffect, useMemo, useState } from "react";
import {
  activeCheckTapeRollDuration,
  getMessageDuration,
  startDelay,
} from "~/lib/time";
import { getPortraitUrl, uniqueValues } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import {
  getActiveCheckSoundName,
  getCharacterSoundName,
  playMusic,
  playSound,
  stopMusic,
} from "~/lib/music";
import { AshesBackground } from "~/components/player/ashes-background";

const messageTransition = "top .3s cubic-bezier(.1, .3, .7, .9)";

const portraitFrameUrl = '/layout/frame.png'
const activeChecks = {
  Failure:  {
    text: '/effects/check-failure.svg',
    background: '/effects/check-failure-background.png',
    dice: '/effects/check-failure-dice.svg',
  },
  Success: {
    text: '/effects/check-success.svg',
    background: '/effects/check-success-background.png',
    dice: '/effects/check-success-dice.svg',
  },
}
const activeCheckUrls = Object.values(activeChecks).flatMap(Object.values) as string[];

export function Player({ data }: { data: DiscoData }) {
  const playerHeight = 1920;

  const [shownMessages, setShownMessages] = useState<{
    all: Message[];
    last: Message | null,
    lastIsShown: boolean;
  }>({ all: [], last: null, lastIsShown: true });
  const [yPosition, setYPosition] = useState(1536); // 1536 = playerHeight - 2x padding

  const [tapeIsRolling, setTapeIsRolling] = useState(false);
  const [tapeOffset, setTapeOffset] = useState(0);

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
    if (!tapeIsRolling) return;
    const timer = setTimeout(() => {
      setTapeOffset(t => t + 16000);
    }, 100);  // wait so last message starts fading
    return () => clearTimeout(timer);
  }, [tapeIsRolling]);

  useEffect(() => {
    if (!imagesArePreloaded || !soundsArePreloaded) return;

    setYPosition(
      playerHeight - (document.getElementById("messages")?.clientHeight ?? 0),
    );
    const index = shownMessages.all.length;

    if (tapeIsRolling || index >= data.messages.length) return;

    const lastMessage = shownMessages.all[index - 1];
    const delay = lastMessage ? getMessageDuration(lastMessage) : startDelay;

    const timer = setTimeout(() => {
      const newMessage = data.messages[index]!

      const showNewMessage = () => {
        const all = [...shownMessages.all, newMessage];
        playSound(messageSounds[index]);
        setTapeIsRolling(false);
        setShownMessages({ all, last: newMessage, lastIsShown: false });
        setTimeout(() => setShownMessages({ all, last: newMessage, lastIsShown: true }), 100);
      }

      const isActiveCheck = newMessage.check?.active ?? false;
      if (isActiveCheck) {
        playSound(getActiveCheckSoundName(newMessage));
        setTapeIsRolling(true);
        setTimeout(() => {
          showNewMessage();
        }, activeCheckTapeRollDuration);
        return;
      }

      showNewMessage();

    }, delay);

    return () => clearTimeout(timer);
  }, [soundsArePreloaded, imagesArePreloaded, shownMessages, data, messageSounds, tapeOffset, tapeIsRolling]);

  useEffect(() => {
    const uniqueImages = [...uniqueValues(messagePortraits), portraitFrameUrl, ...activeCheckUrls];
    void Promise.allSettled(uniqueImages.map(preloadImage))
      .then(() => setImagesArePreloaded(true));
    const uniqueSounds = uniqueValues([...messageSounds, ...data.messages.map(getActiveCheckSoundName)]).filter(v => v !== null);
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
          top: yPosition - playerHeight - tapeOffset,
          transition: tapeIsRolling
            ? 'top 1s ease-in-out'
            : messageTransition,
        }}
      ></div>

      {data.showParticles && <AshesBackground />}

      <div className="absolute top-0 left-0 right-0">
        <div className="relative z-10 min-h-64 overflow-hidden">
          {data.cover &&
            <div className="bg-black w-full [&_img]:w-full [&_img]:max-h-[48rem] [&_img]:object-contain" dangerouslySetInnerHTML={{__html: data.cover.content}}></div>
          }
        </div>

        {data.showPortraits &&
          shownMessages.all.length &&
          !tapeIsRolling &&
          shownPortrait !== "" && (
            <div className="ml-4 -mt-16 relative z-30 flex aspect-portrait w-[27rem] items-center justify-center">
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
      </div>


      {!tapeIsRolling && shownMessages.last?.check?.active && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-end">
          <img
            src={activeChecks[shownMessages.last.check.result].background}
            className={`fixed bottom-0 -z-10 ${shownMessages.lastIsShown ? "opacity-0" : ""}`}
            style={{
              transition: "opacity .7s .4s ease-in",
            }}
            alt=""
          />
          <img
            src={activeChecks[shownMessages.last.check.result].dice}
            className={`h-60 ${shownMessages.lastIsShown ? "opacity-0" : ""}`}
            style={{
              transition: "opacity .4s 1s ease-in",
            }}
            alt=""
          />
          <img
            src={activeChecks[shownMessages.last.check.result].text}
            className={`mb-48 h-20 ${shownMessages.lastIsShown ? "pl-[60rem] opacity-0" : ""}`}
            style={{
              transition: "all .3s 1s ease-in",
            }}
            alt=""
          />
        </div>
      )}

      <div
        id="messages"
        className={
          "absolute w-full px-20 py-48 text-[2.75rem] leading-[4.5rem]"
        }
        style={{
          top: yPosition + "px",
          transition: messageTransition,
        }}
      >
        {shownMessages.all.map((message, index) => (
          <MessageView
            message={message}
            data={data}
            className={
              tapeIsRolling
                ? "opacity-60"
                : shownMessages.lastIsShown ||
                    index + 1 !== shownMessages.all.length
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
