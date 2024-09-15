import {ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

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
