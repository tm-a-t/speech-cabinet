import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const fixtureDir = path.join(process.cwd(), "tests", "fixtures", "audio");

type WavFixture = {
  filename: string;
  durationSeconds: number;
  sampleRate: number;
  bitDepth: 16 | 24;
  channels: 1;
  frequencyHz: number;
  amplitude: number;
};

const fixtures: WavFixture[] = [
  {
    filename: "hq-voice-5s-48k-24bit-mono.wav",
    durationSeconds: 5,
    sampleRate: 48_000,
    bitDepth: 24,
    channels: 1,
    frequencyHz: 220,
    amplitude: 0.35,
  },
  {
    filename: "hq-voice-15s-48k-24bit-mono.wav",
    durationSeconds: 15,
    sampleRate: 48_000,
    bitDepth: 24,
    channels: 1,
    frequencyHz: 220,
    amplitude: 0.35,
  },
  {
    filename: "hq-voice-30s-48k-24bit-mono.wav",
    durationSeconds: 30,
    sampleRate: 48_000,
    bitDepth: 24,
    channels: 1,
    frequencyHz: 220,
    amplitude: 0.35,
  },
  {
    filename: "fake-mic-12s-48k-16bit-mono.wav",
    durationSeconds: 12,
    sampleRate: 48_000,
    bitDepth: 16,
    channels: 1,
    frequencyHz: 440,
    amplitude: 0.25,
  },
];

export async function ensureAudioFixtures(): Promise<void> {
  await mkdir(fixtureDir, { recursive: true });

  for (const fixture of fixtures) {
    const filePath = path.join(fixtureDir, fixture.filename);
    const expectedSize = getWavSize(fixture);
    const existing = await stat(filePath).catch(() => null);

    if (existing?.size === expectedSize) continue;

    await writeFile(filePath, createSineWaveWav(fixture));
  }
}

function getWavSize(fixture: WavFixture): number {
  const bytesPerSample = fixture.bitDepth / 8;
  const sampleCount = fixture.durationSeconds * fixture.sampleRate;
  return 44 + sampleCount * fixture.channels * bytesPerSample;
}

function createSineWaveWav(fixture: WavFixture): Buffer {
  const bytesPerSample = fixture.bitDepth / 8;
  const sampleCount = fixture.durationSeconds * fixture.sampleRate;
  const dataSize = sampleCount * fixture.channels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(fixture.channels, 22);
  buffer.writeUInt32LE(fixture.sampleRate, 24);
  buffer.writeUInt32LE(fixture.sampleRate * fixture.channels * bytesPerSample, 28);
  buffer.writeUInt16LE(fixture.channels * bytesPerSample, 32);
  buffer.writeUInt16LE(fixture.bitDepth, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < sampleCount; i++) {
    const sample = Math.sin((2 * Math.PI * fixture.frequencyHz * i) / fixture.sampleRate);
    const offset = 44 + i * bytesPerSample;

    if (fixture.bitDepth === 16) {
      buffer.writeInt16LE(Math.round(sample * fixture.amplitude * 0x7fff), offset);
    } else {
      buffer.writeIntLE(Math.round(sample * fixture.amplitude * 0x7fffff), offset, 3);
    }
  }

  return buffer;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await ensureAudioFixtures();
  console.log(`Audio fixtures ready in ${fixtureDir}`);
}
