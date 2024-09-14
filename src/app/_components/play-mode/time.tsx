import {Message, SavedData} from '~/app/_lib/data-types';

export const startDelay = 100;
const endDelay = 1000;

export function totalDuration(data: SavedData) {
  const messageDurationSum = data.messages.map(getMessageDuration).reduce((a, b) => a + b, 0)
  return startDelay + messageDurationSum + endDelay;
}

export function getMessageDuration(message: Message) {
  return 15 * message.text.length;
}
