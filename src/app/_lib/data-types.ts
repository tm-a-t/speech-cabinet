export type DiscoData = {
  messages: Array<Message>
  overrides: {
    checks: Record<string, boolean>
    colorClass: Record<string, string>
    portraitUrl: Record<string, string>
  }
  showPortraits: boolean
  music: string | null
  skipMusicIntro: boolean
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

export const defaultData: DiscoData = {
  messages: [

  ],
  overrides: {
    checks: {},
    colorClass: {},
    portraitUrl: {},
  },
  showPortraits: true,
  music: null,
  skipMusicIntro: true,
  version: '0.1',
}
