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
import { env } from "~/env";
import { spawn } from 'child_process';

const wvc = new WebVideoCreator();
wvc.config({
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

async function renderVideo(data: DiscoData, id: string, convertToGif: boolean) {
  const params = new URLSearchParams({data: serialize(data)}).toString();
  const filename = getVideoPath(id);

  const video = wvc.createSingleVideo({
    url: WEB_URL + '/render?' + params,
    width: 1080,
    height: 1920,
    fps: 30,
    duration: Math.min(totalDuration(data), totalTimeLimit),
    outputPath: filename,
    pagePrepareFn: async (page: Page) => {
      const target = page.target;
      void target.tap('body');
    },
  });

  // Add music here because music added with <audio> in Player
  // does not work for some reason.
  // Constants derived from music.ts#playMusic, should refactor this later.
  if (data.music) {
    video.addAudio({
      url: WEB_URL + data.music,
      volume: 20,
      loop: true,
      seekStart: data.skipMusicIntro ? 37000 : 0,
    });
  }

  video.on("progress", async (progress: number) => {
    await db.video.update({where: {id}, data: {progress: Math.floor(progress)}}).catch(console.error);
  });
  await video.startAndWait();

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

  await db.video.update({where: {id}, data: {isReady: true}});
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
