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

export const dieFace = z.number().int().min(1).max(6);

export const message = z.object({
  name: z.string(),
  text: z.string(),
  check: z.object({
    difficulty: difficulties,
    result: results,
    active: z.boolean().default(false),
    die1: dieFace.optional(),
    die2: dieFace.optional(),
  }).optional(),
  id: z.number().default(() => Math.floor(Math.random() * 1_000_000)),
});
export type Message = z.infer<typeof message>;

export function getDefaultActiveCheckDice(result: Result): { die1: number; die2: number } {
  return result === 'Failure' ? { die1: 2, die2: 1 } : { die1: 5, die2: 6 };
}

export function resolveActiveCheckDice(check: {
  result: Result;
  active: boolean;
  die1?: number;
  die2?: number;
}): { die1: number; die2: number } {
  const defaults = getDefaultActiveCheckDice(check.result);
  return {
    die1: check.die1 ?? defaults.die1,
    die2: check.die2 ?? defaults.die2,
  };
}

const discoData = z.object({
  messages: z.array(message),
  overrides: z.object({
    checks: z.record(z.string(), z.boolean()),
    colorClass: z.record(z.string(), z.string()),
    portraitUrl: z.record(z.string(), z.string()),
  }),
  cover: z.object({
    content: z.string(),
  }).optional(),
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
  // #20: default to no music so a fresh install (where `public/music/` is empty because
  // those files are gitignored) does not hang the render worker on a 404. Users still
  // pick a track from Options > Music, and the Music menu greys out unavailable tracks.
  music: null,
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
