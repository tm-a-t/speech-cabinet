import {ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uniqueValues<T>(array: Array<T>): T[] {
  return [...new Set(array)]
}
