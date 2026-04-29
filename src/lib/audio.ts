import type { DiscoData, Narration } from "~/lib/disco-data";

export const narrationSoftLimitBytes = 3 * 1024 * 1024;
export const serializedProjectHardWarningBytes = 7 * 1024 * 1024;

const supportedRecordingMimeTypes = [
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/webm",
];

export function getSupportedRecordingMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return supportedRecordingMimeTypes.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  );
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read audio file."));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read audio file."));
    reader.readAsDataURL(blob);
  });
}

export function measureAudioDurationMs(src: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const cleanup = () => {
      audio.removeAttribute("src");
      audio.load();
    };
    audio.onloadedmetadata = () => {
      const durationMs = Math.round(audio.duration * 1000);
      cleanup();
      if (Number.isFinite(durationMs) && durationMs > 0) {
        resolve(durationMs);
      } else {
        reject(new Error("Could not determine audio duration."));
      }
    };
    audio.onerror = () => {
      cleanup();
      reject(new Error("Could not load audio metadata."));
    };
    audio.src = src;
  });
}

export function isSupportedAudioDataUrl(src: string): boolean {
  return /^data:audio\/[^;,]+[;,]/.test(src);
}

export async function createNarrationFromBlob(
  blob: Blob,
  options: { name?: string } = {},
): Promise<Narration> {
  const src = await blobToDataUrl(blob);
  if (!isSupportedAudioDataUrl(src)) {
    throw new Error("Please choose an audio file.");
  }

  return {
    src,
    durationMs: await measureAudioDurationMs(src),
    name: options.name,
    mimeType: blob.type || undefined,
    sizeBytes: blob.size,
  };
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0
    ? `${minutes}:${seconds.toString().padStart(2, "0")}`
    : `${seconds}s`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function getTotalNarrationSizeBytes(data: DiscoData): number {
  return data.messages
    .map(message => message.narration?.sizeBytes ?? 0)
    .reduce((sum, size) => sum + size, 0);
}

export function getNarrationClips(data: DiscoData): Narration[] {
  return data.messages
    .map(message => message.narration)
    .filter((narration): narration is Narration => narration !== undefined);
}
