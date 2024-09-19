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
  name: string
  text: string
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
    {name: 'Kim Kitsuragi', text: '"The boots are ceramic, vitreous enamel. They\'re fused to his skin from blood flowing downward postmortem. Removal of the boots is left for Processing."'},
    {
      name: 'Drama',
      text: 'It would be *clever* of you to omit the boots altogether, sire. If you are to *keep* them for yourself -- as you ought to. You have deserved them more than anyone else!',
      check: {
        difficulty: 'Easy',
        result: 'Success',
      }
    },
  ],
  overrides: {
    checks: {},
    colorClass: {},
    portraitUrl: {},
  },
  showPortraits: true,
  music: '/music/Sea Power - Instrument of Surrender.m4a',
  skipMusicIntro: true,
  version: '0.1',
};
