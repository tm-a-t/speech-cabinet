import {ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {DiscoData} from './data-types';
import {characters, allPortraitNames, skillColorClass, skills} from '~/app/_lib/names';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uniqueValues<T>(array: Array<T>): T[] {
  return [...new Set(array)];
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function getVideoPath(videoId: string): string {
  return 'temp/' + videoId + '.mp4';
}

export function downloadFile(path: string, name: string) {
  const link = document.createElement("a");
  link.setAttribute('download', name);
  link.href = path;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function formatTime(): string {
  const pad = (n: number, s = 2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
  const d = new Date();

  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

export function getDefaultPortraitUrl(name: string): string {
  return '/portraits/' + name + '.png';
}

export function getPortraitUrl(name: string, data: DiscoData): string {
  return data.overrides.portraitUrl[name] ??
    (allPortraitNames.includes(name) ? getDefaultPortraitUrl(name) : '');
}

export function getColorClass(name: string, data: DiscoData): string {
  return data.overrides.colorClass[name] ?? skillColorClass[name] ?? '';
}
