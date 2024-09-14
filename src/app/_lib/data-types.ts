export type SavedData = {
  messages: Array<Message>,
  version: '0.1',
}

export type Message = {
  text: string,
  name: string,
  check?: Check,
}

export type Check = {
  difficulty: Difficulty,
  result: Result,
}

export const difficulties = [
  'Trivial',
  'Easy',
  'Medium',
  'Challenging',
  'Formidable',
  'Legendary',
  'Heroic',
  'Godly',
  'Impossible',
] as const;
export type Difficulty = typeof difficulties[number];
export type Result = 'Success' | 'Failure';
