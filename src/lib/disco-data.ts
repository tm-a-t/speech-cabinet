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
  showParticles: z.boolean().default(true),
  music: z.string().nullable(),
  skipMusicIntro: z.boolean(),
  version: z.literal('0.1'),
});
export type DiscoData = z.infer<typeof discoData>


/* Default data */

export const getDefaultData = () => discoData.parse({
  messages: [
    // {
    //   name: 'Garte, the Cafeteria Manager',
    //   text: '"No, I\'m not the *bartender*. I\'m the cafeteria manager."',
    // },
    // {
    //   name: 'Empathy',
    //   text: 'He\'s very animated all of a sudden. This is clearly a touchy subject for him.',
    //   check: {
    //     difficulty: 'Medium',
    //     result: 'Success',
    //   },
    // },
    {
      name: 'You',
      text: '',
    }
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
});


/* Convertion */

export function toDiscoData(input: string): DiscoData | null {
  try {
    const object: unknown = JSON.parse(input);
    return discoData.parse(object);
  } catch (_error) {
    // Parsing JSON or parsing the object failed
    return null;
  }
}

export function serialize(data: DiscoData): string {
  return JSON.stringify(
    {
      ...data,
      messages: data.messages.map(({id: _, ...rest}) => rest)
    }
  )
}
