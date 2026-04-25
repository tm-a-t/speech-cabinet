import { type Message, type DiscoData, } from "~/lib/disco-data";


export const totalTimeLimit = 4 * 60 * 1000;

export const startDelay = 0;
const endDelay = 1500;

export const activeCheckTapeRollDuration = 1100;

export type MessageTimelineItem = {
  message: Message;
  index: number;
  startMs: number;
  preDisplayDurationMs: number;
  displayDurationMs: number;
};

export function totalDuration(data: DiscoData): number {
  const messageDurationSum = data.messages
    .map(message => getMessagePreDisplayDuration(message) + getMessageDisplayDuration(message))
    .reduce((a, b) => a + b, 0);
  return startDelay + messageDurationSum + endDelay;
}

export function getFallbackMessageDuration(message: Message): number {
  const textLength = message.name.length + message.text.replace(/<[^>]*>/g, '').length;
  const delayForActiveCheckResult = message.check?.active ? 1000 : 0;
  const containsImages = message.text.includes("<img");  // a quick estimation so we don't use any api
  const delayForImages = containsImages ? 3000 : 0;

  return 1000
    + delayForActiveCheckResult
    + 20 * textLength
    + delayForImages;
}

export function getMessageDisplayDuration(message: Message): number {
  return message.narration?.durationMs ?? getFallbackMessageDuration(message);
}

export function getMessagePreDisplayDuration(message: Message): number {
  return message.check?.active ? activeCheckTapeRollDuration : 0;
}

export function getMessageTimeline(data: DiscoData): MessageTimelineItem[] {
  let cursorMs = startDelay;

  return data.messages.map((message, index) => {
    const preDisplayDurationMs = getMessagePreDisplayDuration(message);
    const displayDurationMs = getMessageDisplayDuration(message);
    const startMs = cursorMs + preDisplayDurationMs;

    cursorMs = startMs + displayDurationMs;

    return {
      message,
      index,
      startMs,
      preDisplayDurationMs,
      displayDurationMs,
    };
  });
}

export function getMessageDuration(message: Message): number {
  return getMessagePreDisplayDuration(message) + getMessageDisplayDuration(message);
}
