import {z} from 'zod';


/* Types */

export const difficulties = z.enum([
  'Trivial',
  'Easy',
  'Medium',
  'Challenging',
  'Formidable',
  'Legendary',
  'Heroic',
  'Godly',
  'Impossible',
]);
export type Difficulty = z.infer<typeof difficulties>;
export const results = z.enum(['Success', 'Failure']);
export type Result = z.infer<typeof results>;

export const message = z.object({
  name: z.string(),
  text: z.string(),
  check: z.object({
    difficulty: difficulties,
    result: results,
  }).optional(),
  id: z.number().default(() => Math.floor(Math.random() * 1_000_000)),
});
export type Message = z.infer<typeof message>;

const discoData = z.object({
  messages: z.array(message),
  overrides: z.object({
    checks: z.record(z.string(), z.boolean()),
    colorClass: z.record(z.string(), z.string()),
    portraitUrl: z.record(z.string(), z.string()),
  }),
  showPortraits: z.boolean(),
  music: z.string().nullable(),
  skipMusicIntro: z.boolean(),
  version: z.literal('0.1'),
});
export type DiscoData = z.infer<typeof discoData>


/* Default data */

export const defaultData: DiscoData = {
  messages: [
    {
      name: 'Kim Kitsuragi',
      text: '"The boots are ceramic, vitreous enamel. They\'re fused to his skin from blood flowing downward postmortem. Removal of the boots is left for Processing."',
      id: 1,
    },
    {
      name: 'Drama',
      text: 'It would be *clever* of you to omit the boots altogether, sire. If you are to *keep* them for yourself -- as you ought to. You have deserved them more than anyone else!',
      check: {
        difficulty: 'Easy',
        result: 'Success',
      },
      id: 2,
    },
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
};



/* Convertion */

export function toDiscoData(input: string): DiscoData | null {
  try {
    const object: any = JSON.parse(input);
    return discoData.parse(object);
  }
  catch (_) {
    // Parsing JSON or parsing the object failed
    return null;
  }
}
