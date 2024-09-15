import {Message, SavedData} from '~/app/_lib/data-types';

export const startDelay = 2000;
const endDelay = 1000;

export function totalDuration(data: SavedData) {
  const messageDurationSum = data.messages.map(getMessageDuration).reduce((a, b) => a + b, 0)
  return startDelay + messageDurationSum + endDelay;
}

export function getMessageDuration(message: Message) {
  return 20 * message.text.length + 500;
}
