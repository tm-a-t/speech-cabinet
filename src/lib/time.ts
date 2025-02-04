import { type Message, type DiscoData, message } from "~/lib/disco-data";


export const totalTimeLimit = 4 * 60 * 1000;

export const startDelay = 0;
const endDelay = 1500;

export function totalDuration(data: DiscoData): number {
  const messageDurationSum = data.messages.map(getMessageDuration).reduce((a, b) => a + b, 0);
  return startDelay + messageDurationSum + endDelay;
}

export function getMessageDuration(message: Message): number {
  const textLength = message.name.length + message.text.replace(/<[^>]*>/g, '').length;
  const containsImages = message.text.includes("<img");  // a quick estimation so we don't use any api

  return 1000
    + 20 * textLength
    + (containsImages ? 3000 : 0);
}
