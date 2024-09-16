export type SavedData = {
  messages: Array<Message>
  overrides: {
    checks: {
      [character: string]: boolean
    }
    colorClass: {
      [character: string]: string
    }
    portraitUrl: {
      [character: string]: string
    }
  }
  showPortraits: boolean
  music: string | null
  version: '0.1'
}

export type Message = {
  text: string
  name: string
  check?: Check
}

export type Check = {
  difficulty: Difficulty
  result: Result
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

export const defaultData: SavedData = {
  messages: [

  ],
  overrides: {
    checks: {},
    colorClass: {},
    portraitUrl: {},
  },
  showPortraits: true,
  music: '/Sea Power - Instrument of Surrender.m4a',
  version: '0.1',
}
