import { type Message, type DiscoData, } from "~/lib/disco-data";


export const totalTimeLimit = 4 * 60 * 1000;

export const startDelay = 0;
const endDelay = 1500;

export const activeCheckTapeRollDuration = 1100;

export function totalDuration(data: DiscoData): number {
  const messageDurationSum = data.messages.map(getMessageDuration).reduce((a, b) => a + b, 0);
  return startDelay + messageDurationSum + endDelay;
}

export function getMessageDuration(message: Message): number {
  const textLength = message.name.length + message.text.replace(/<[^>]*>/g, '').length;
  const delayForActiveCheck = message.check?.active ? activeCheckTapeRollDuration + 1000 : 0;
  const containsImages = message.text.includes("<img");  // a quick estimation so we don't use any api
  const delayForImages = containsImages ? 3000 : 0;

  return 1000
    + delayForActiveCheck
    + 20 * textLength
    + delayForImages;
}
