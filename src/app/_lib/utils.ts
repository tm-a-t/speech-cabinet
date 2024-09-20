import {type ClassValue, clsx} from 'clsx';
import type {DiscoData} from './data-types';
import {allPortraitNames, skillColorClass} from '~/app/_lib/names';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function uniqueValues<T>(array: Array<T>): T[] {
  return [...new Set(array)];
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function debounce<T extends (...args: A) => R, A extends unknown[], R>(callback: T, ms = 500): (...args: A) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: A) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(args), ms);
  };
}

export function getVideoPath(videoId: string): string {
  return 'temp/' + videoId + '.mp4';
}

export function downloadFile(path: string, name: string): void {
  const link = document.createElement("a");
  link.setAttribute('download', name);
  link.href = path;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function formatTime(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} `
    + `${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

function pad(num: number): string {
  return `00${num}`.slice(-2);
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
