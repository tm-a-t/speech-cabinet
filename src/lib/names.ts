export const skills = [
  'Logic',
  'Encyclopedia',
  'Rhetoric',
  'Drama',
  'Conceptualization',
  'Visual Calculus',
  'Volition',
  'Inland empire',
  'Empathy',
  'Authority',
  'Esprit de Corps',
  'Suggestion',
  'Endurance',
  'Physical Instrument',
  'Pain Threshold',
  'Electrochemistry',
  'Shivers',
  'Half Light',
  'Hand/Eye Coordination',
  'Perception',
  'Reaction Speed',
  'Savoir Faire',
  'Interfacing',
  'Composure',
]

export const characters = [
  'You',
  'Acele',
  'Alain',
  'Alice DeMettrie',
  'Andre',
  'Annette',
  'Bird\'s Nest Roy',
  'Bloated Corpse of a Drunk',
  'Call Me Mañana',
  'Chester McLaine',
  'Cindy the Skull',
  'Cleaning Lady',
  'Coalition Warship Archer',
  'Cuno',
  'Cunoesse',
  'DJ Flacio',
  'DJ Mesh',
  'Dolores Dei',
  'Don\'t Call Abigail',
  'East-Insulindian Repeater Station',
  'Easy Leo',
  'Echo Maker',
  'Egg Head',
  'Elizabeth',
  'Eugene',
  'Evrart Claire',
  'Fat Angus',
  'Frittte Clerk',
  'Fuck the World',
  'Garte, the Cafeteria Manager',
  'Gary, the Cryptofascist',
  'Gaston Martin',
  'Glen',
  'Gorący Kubek',
  'Horse-Faced Woman',
  'Idiot Doom Spiral',
  'Insulindian Phasmid',
  'Jamrock Public Library',
  'Jean Vicquemare',
  'Measurehead',
  'Judit Minot',
  'Jules Pidieu',
  'Kim Kitsuragi',
  'Klaasje (Miss Oranje Disco Dancer)',
  'Cuno\'s Dad',
  'Lena, the Cryptozoologist\'s wife',
  'Lilienne\'s Twin',
  'Lilienne\'s Other Twin',
  'Lilienne, the Net Picker',
  'Little Lily',
  'Mack Torson',
  'Man on Water Lock',
  'Man With Sunglasses',
  'Measurehead\'s Babe',
  'Mega Rich Light-Bending Guy',
  'Mikael Heidelstam',
  'Morell, the Cryptozoologist',
  'Mysterious Pair of Eyes',
  'Nix Gottlieb',
  'Noid',
  'Novelty Dicemaker',
  'Paledriver',
  'Phillis de Paule',
  'Pissf****t',
  'Plaisance',
  'Racist Lorry Driver',
  'Raul Kortenaer',
  'Real Estate Agent',
  'Joyce Messier',
  'René Arnoux',
  'Rosemary',
  'Ruby, the Instigator',
  'Ruud Hoenkloewen',
  'Scab Leader',
  'Shanky',
  'Siileng',
  'Sleeping Dockworker',
  'Smoker on the Balcony',
  'Soona, the Programmer',
  'Steban, the Student Communist',
  'Sunday Friend',
  'Sylvie',
  'The Deserter',
  'The Hanged Man',
  'The Pigs',
  'Theo',
  'Tiago',
  'Titus Hardie',
  'Tommy Le Homme',
  'Trant Heidelstam',
  'Washerwoman',
  'Working Class Corpse',
  'Working Class Woman',
]

export const skillColorClass: Record<string, string> = {
  'Logic': 'text-intellect',
  'Encyclopedia': 'text-intellect',
  'Rhetoric': 'text-intellect',
  'Drama': 'text-intellect',
  'Conceptualization': 'text-intellect',
  'Visual Calculus': 'text-intellect',
  'Volition': 'text-psyche',
  'Inland empire': 'text-psyche',
  'Empathy': 'text-psyche',
  'Authority': 'text-psyche',
  'Esprit de Corps': 'text-psyche',
  'Suggestion': 'text-psyche',
  'Endurance': 'text-physique',
  'Physical Instrument': 'text-physique',
  'Pain Threshold': 'text-physique',
  'Electrochemistry': 'text-physique',
  'Shivers': 'text-physique',
  'Half Light': 'text-physique',
  'Hand/Eye Coordination': 'text-motorics',
  'Perception': 'text-motorics',
  'Reaction Speed': 'text-motorics',
  'Savoir Faire': 'text-motorics',
  'Interfacing': 'text-motorics',
  'Composure': 'text-motorics',
}

export const harryPortraitNames = [
  'You',
  'You, shaved',
  'You, without expression',
  'You, shaved, without expression',
  'You, fascist',
  'You, shaved fascist',
  'You, obscured',
]

export const allPortraitNames = [
  ...harryPortraitNames,
  ...skills,
  ...characters.filter(name => name !== 'You'),
]
