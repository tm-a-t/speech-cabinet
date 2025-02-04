import { type Message, type DiscoData, message } from "~/lib/disco-data";


export const totalTimeLimit = 4 * 60 * 1000;

export const startDelay = 0;
const endDelay = 1500;

export function totalDuration(data: DiscoData): number {
  const messageDurationSum = data.messages.map(getMessageDuration).reduce((a, b) => a + b, 0);
  return startDelay + messageDurationSum + endDelay;
}

export function getMessageDuration(message: Message): number {
  // The message may contain complex tags, so we count pure text length with browser methods
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = message.text;
  const textLength = message.name.length + tempDiv.innerText.length;
  const containsImages = tempDiv.querySelector('img') !== null;
  tempDiv.remove();

  return 1000
    + 20 * textLength
    + (containsImages ? 2000 : 0);
}
