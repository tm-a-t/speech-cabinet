import {type ClassValue, clsx} from 'clsx';
import { type DiscoData, getDefaultData, toDiscoData } from "./disco-data";
import {allPortraitNames, skillColorClass} from '~/lib/names';
import {twMerge} from 'tailwind-merge';
import { redirect } from "next/navigation";
import type { Editor } from "@tiptap/core";

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
    timeoutId = setTimeout(() => callback(...args), ms);
  };
}

export function getVideoPath(videoId: string): string {
  return 'temp/' + videoId + '.mp4';
}

export function getGifPath(videoId: string): string {
  return getVideoPath(videoId) + '.gif';
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

export function restoreSavedData(): DiscoData {
  const dataSaveString = localStorage.getItem('data');
  if (!dataSaveString || dataSaveString === 'undefined' || dataSaveString === 'null') {
    return getDefaultData();
  }
  const dataSave = toDiscoData(dataSaveString);
  if (dataSave) {
    return dataSave;
  }
  redirect('/invalid-data');
}

export function addImage(editor: Editor | null, options?: {onCancel?: () => void}) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (!editor) return;
      const source = fileReader.result;
      if (!source) return;
      const src = typeof source === 'string' ? source : Buffer.from(source).toString();
      editor.chain().focus().setImage({ src: src }).run();
    };
  };
  fileInput.oncancel = () => {
    if (options?.onCancel) options.onCancel();
  };
  fileInput.click();
}
