import {Message, DiscoData} from '~/app/_lib/data-types';


export const totalTimeLimit = 4 * 60 * 1000;

export const startDelay = 500;
const endDelay = 1000;

export function totalDuration(data: DiscoData) {
  const messageDurationSum = data.messages.map(getMessageDuration).reduce((a, b) => a + b, 0)
  return startDelay + messageDurationSum + endDelay;
}

export function getMessageDuration(message: Message) {
  return 30 * (message.text.length + message.name.length) + 1000;
}
