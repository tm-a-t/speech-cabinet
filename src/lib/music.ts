import type {DiscoData} from '~/lib/disco-data';
import {getColorClass} from '~/lib/utils';

type OstItem = { name: string, url: string | null }

export const ost: OstItem[] = [
  {name: 'No music', url: null},
  {name: 'Instrument of Surrender', url: '/music/Sea Power - Instrument of Surrender.m4a'},
  {name: 'Whirling-In-Rags, 8 AM', url: '/music/Sea Power - Whirling-In-Rags, 8 AM.m4a'},
  {name: 'Detective Arriving on the Scene', url: '/music/Sea Power - Detective Arriving on the Scene.m4a'},
  {name: 'Tiger King', url: '/music/Sea Power - Tiger King.m4a'},
  {name: 'Your Body Betrays Your Degeneracy', url: '/music/Sea Power - Your Body Betrays Your Degeneracy.m4a'},
  {name: 'Precinct 41 Major Crime Unit', url: '/music/Sea Power - Precinct 41 Major Crime Unit.m4a'},
  {name: 'The Insulindian Miracle', url: '/music/Sea Power - The Insulindian Miracle.m4a'},
  {name: 'Polyhedrons', url: '/music/Sea Power - Polyhedrons.m4a'},
  {name: 'Live With Me', url: '/music/Sea Power - Live With Me.m4a'},
  {name: 'The Field Autopsy', url: '/music/Sea Power - The Field Autopsy.m4a'},
  {name: 'Miss Oranje Disco Dancer', url: '/music/Sea Power - Miss Oranje Disco Dancer.m4a'},
  {name: 'Rue de Saint-Ghislaine 32B', url: '/music/Sea Power - Rue de Saint-Ghislaine 32B.m4a'},
  {name: 'The Doomed Commercial Area', url: '/music/Sea Power - The Doomed Commercial Area.m4a'},
  {name: 'The Cryptozoologists', url: '/music/Sea Power - The Cryptozoologists.m4a'},
  {name: 'Whirling-In-Rags, 8 PM', url: '/music/Sea Power - Whirling-In-Rags, 8 PM.m4a'},
  {name: 'Disco Elysium, Pt. 1', url: '/music/Sea Power - Disco Elysium, Pt. 1.m4a'},
  {name: 'Disco Elysium, Pt. 2', url: '/music/Sea Power - Disco Elysium, Pt. 2.m4a'},
  {
    name: 'Ecstatic Vibrations, Totally Transcendent',
    url: '/music/Sea Power - Ecstatic Vibrations, Totally Transcendent.m4a',
  },
  {
    name: 'Saint-Brune 1147 (Small Pinewood Church)',
    url: '/music/Sea Power - Saint-Brune 1147 (Small Pinewood Church).m4a',
  },
  {name: 'Martinaise, Terminal B', url: '/music/Sea Power - Martinaise, Terminal B.m4a'},
  {name: 'We Are Not Checkmated', url: '/music/Sea Power - We Are Not Checkmated.m4a'},
  {name: 'Hope in Work and Joy in Leisure', url: '/music/Sea Power - Hope in Work and Joy in Leisure.m4a'},
  {name: 'Burn, Baby, Burn', url: '/music/Sea Power - Burn, Baby, Burn.m4a'},
  {name: 'Whirling-In-Rags 12 PM', url: '/music/Sea Power - Whirling-In-Rags 12 PM.m4a'},
  {name: 'La Revacholiere', url: '/music/Sea Power - La Revacholiere.m4a'},
  {name: 'Krenel, Downwell, Somatosensor', url: '/music/Sea Power - Krenel, Downwell, Somatosensor.m4a'},
  {name: 'Off We Go Into The Wild Pale Yonder', url: '/music/Sea Power - Off We Go Into The Wild Pale Yonder.m4a'},
  {name: 'ZA/UM', url: '/music/Sea Power - ZA/UM.m4a'},
];

export function getCharacterSoundName(name: string, data: DiscoData): string | null {
  const colorClass = getColorClass(name, data);
  switch (colorClass) {
    case 'text-intellect':
      return '/sounds/intellect.mp3';
    case 'text-psyche':
      return '/sounds/psyche.mp3';
    case 'text-physique':
      return '/sounds/physique.mp3';
    case 'text-motorics':
      return '/sounds/motorics.mp3';
    default:
      return null;
  }
}

export function playSound(path: string | null | undefined) {
  if (!path) return;
  const audio = document.createElement('audio');
  audio.src = path;
  document.body.appendChild(audio);
  void audio.play();
}

export function playMusic(path: string | null, skipIntro: boolean): HTMLAudioElement {
  const audio = document.createElement('audio');
  audio.src = path ?? '';
  audio.volume = .2;
  audio.loop = true;
  if (skipIntro) {
    audio.currentTime = 37;  // a random default, seems to work ok in general
  }
  document.body.appendChild(audio);
  void audio.play();
  return audio;
}

export function stopMusic(audio: HTMLAudioElement) {
  audio.remove();
}
