/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */


import {boss, queue, type RenderVideoJob} from '~/server/queue';
import {type DiscoData, serialize} from '~/lib/disco-data';
import { getGifPath, getVideoPath, sleep } from "~/lib/utils";
import {totalDuration, totalTimeLimit} from '~/lib/time';
import {db} from '~/server/db';
// @ts-expect-error untyped lib :(
import WebVideoCreator from 'web-video-creator';
// @ts-expect-error untyped lib :(
import { type Page } from "web-video-creator/core";
import { type Page as PuppeteerPage } from "puppeteer-core";
import { env } from "~/env";
import { spawn } from 'child_process';

const wvc = new WebVideoCreator();
wvc.config({
  browserVersion: '136.0.7103.113',
  debug: true,
  browserDebug: true,
  ffmpegDebug: true,
  ffmpegExecutablePath: 'ffmpeg',
  browserExecutablePath: env.CHROME_PATH === "auto" ? undefined : env.CHROME_PATH,
  allowUnsafeContext: true,
  browserUseGPU: false,
  compatibleRenderingMode: true,
});

const WEB_URL = env.WEB_URL ?? 'http://localhost:3000'
const GIF_FPS = 10
const GIF_WIDTH = 720

/** Wall-clock cap for `video.startAndWait()` so a stuck WebVideoCreator run does not block the worker forever (#18). */
const DEFAULT_RENDER_DEADLINE_MS = 60 * 60 * 1000;

function renderDeadlineMs(): number {
  const raw = process.env.RENDER_DEADLINE_MS;
  if (raw !== undefined && raw !== '') {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) {
      return n;
    }
  }
  return DEFAULT_RENDER_DEADLINE_MS;
}

function withDeadline<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  if (!Number.isFinite(ms) || ms <= 0) {
    return p;
  }
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new Error(`${label} exceeded ${String(ms)}ms (RENDER_DEADLINE_MS)`));
    }, ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e: unknown) => {
        clearTimeout(t);
        reject(e instanceof Error ? e : new Error(String(e)));
      },
    );
  });
}

/**
 * HEAD-probe a WEB_URL-relative asset. Returns true only on a 2xx response.
 * Used before wvc.addAudio() so a missing music file (#20) doesn't make the
 * Synthesizer's internal fetch throw inside startAndWait and hang the render.
 */
async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {method: 'HEAD'});
    return res.ok;
  } catch {
    return false;
  }
}

async function renderVideo(data: DiscoData, id: string, convertToGif: boolean) {
  try {
    const filename = getVideoPath(id);
    let renderWarning: string | null = null;

    const video = wvc.createSingleVideo({
      url: WEB_URL + '/render',
      width: 1080,
      height: 1920,
      fps: 30,
      duration: Math.min(totalDuration(data), totalTimeLimit),
      outputPath: filename,
      pagePrepareFn: async (page: Page) => {
        const puppeteerPage = page.target as PuppeteerPage;
        const serialized = serialize(data);
        await puppeteerPage.evaluate(({serialized}) => {
          localStorage.setItem('data', serialized);
          window.dispatchEvent(new Event('disco', {}));
        }, { serialized });
      },
    });

    // GIFs have no audio track (ffmpeg paletteuse drops audio), so there is no
    // reason to fetch the music file at all. Skipping unconditionally makes the
    // gif path bulletproof against #20 even if the user picked a missing track.
    if (data.music && !convertToGif) {
      const musicUrl = WEB_URL + data.music;
      if (await urlExists(musicUrl)) {
        video.addAudio({
          url: musicUrl,
          volume: 20,
          loop: true,
          seekStart: data.skipMusicIntro ? 37000 : 0,
        });
      } else {
        // Skip addAudio so wvc's Synthesizer doesn't 404 mid-render (#20).
        // The render still succeeds - just silent - and the UI surfaces this.
        renderWarning = `Rendered without music: "${data.music}" was not found on the server.`;
        console.warn(`[worker] ${renderWarning}`);
      }
    }

    video.on("progress", async (progress: number) => {
      await db.video.update({where: {id}, data: {progress: Math.floor(progress)}}).catch(console.error);
    });
    await withDeadline(
      video.startAndWait() as Promise<void>,
      renderDeadlineMs(),
      'video.startAndWait',
    );

    if (convertToGif) {
      await run(
        `ffmpeg`,
        `-i`, filename,
        `-vf`, `fps=${GIF_FPS},scale=${GIF_WIDTH}:-1:flags=lanczos,palettegen`,
        `${filename}.palette.png`,
        `-update`, `true`,
        `-nostdin`,
      );
      await run(
        `ffmpeg`,
        `-i`, filename,
        `-i`, `${filename}.palette.png`,
        `-lavfi`, `fps=${GIF_FPS},scale=${GIF_WIDTH}:-1:flags=lanczos [x]; [x][1:v] paletteuse`,
        `-nostdin`,
        getGifPath(id),
      );
    }

    await db.video.update({where: {id}, data: {isReady: true, renderWarning, renderError: null}});
  } catch (err) {
    // #18: surface fatal render failures to the UI instead of letting the client poll forever.
    const message = String(err).slice(0, 8000);
    await db.video.update({where: {id}, data: {renderError: message}}).catch(console.error);
    throw err;
  }
}

function run(command: string, ...args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args);

    p.stdout.on('data', (x: string | Uint8Array) => {
      process.stdout.write(x.toString());
    });
    p.stderr.on('data', (x: string | Uint8Array) => {
      process.stderr.write(x.toString());
    });
    p.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    p.on('error', (err) => {
      reject(err);
    });
  });
}

async function runWorker() {
  await boss.createQueue(queue);

  await boss.work(queue, async (jobs: RenderVideoJob[]) => {
    const job = jobs[0]!;  // Only one job by default
    console.log(`received job ${job.id} with data ${JSON.stringify(job.data)}`);
    await renderVideo(job.data.discoData, job.data.videoId, job.data.convertToGif ?? false);
  });
}

runWorker()
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
