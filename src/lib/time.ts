import type {Message, DiscoData} from '~/lib/disco-data';


export const totalTimeLimit = 20 * 1000;

export const startDelay = 0;
const endDelay = 1000;

export function totalDuration(data: DiscoData): number {
  const messageDurationSum = data.messages.map(getMessageDuration).reduce((a, b) => a + b, 0);
  return startDelay + messageDurationSum + endDelay;
}

export function getMessageDuration(message: Message): number {
  return 20 * (message.text.length + message.name.length) + 1000;
}
