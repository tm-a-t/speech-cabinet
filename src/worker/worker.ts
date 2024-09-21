/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */


import {boss, queue, type RenderVideoJob} from '~/server/queue';
import {type DiscoData, serialize} from '~/app/_lib/data-types';
import {getVideoPath} from '~/app/_lib/utils';
import {beforeDelay, totalDuration, totalTimeLimit} from '~/app/_lib/time';
import {db} from '~/server/db';
// @ts-expect-error
import WebVideoCreator, {VIDEO_ENCODER, logger} from 'web-video-creator';

const wvc = new WebVideoCreator();
wvc.config({
  // mp4Encoder: VIDEO_ENCODER.NVIDIA.H264,
  debug: true,
  browserDebug: true,
  compatibleRenderingMode: true,
  ffmpegDebug: true,
  ffmpegExecutablePath: 'ffmpeg',
  browserExecutablePath: process.env.CHROME_PATH ?? (() => {throw new Error('plz set CHROME_PATH 👉👈🥺')})(),
});

async function renderVideo(data: DiscoData, id: string) {
  const params = new URLSearchParams({data: serialize(data)}).toString();
  const filename = getVideoPath(id);

  const video = wvc.createSingleVideo({
    url: 'http://localhost:3000/render?' + params,
    width: 1080,
    height: 1920,
    fps: 30,
    duration: Math.min(totalDuration(data), totalTimeLimit),
    startTime: beforeDelay,
    outputPath: filename,
  });
  video.on("progress", async (progress: number) => {
    await db.video.update({where: {id}, data: {progress: Math.floor(progress)}}).catch(console.error);
  });
  await video.startAndWait()
  await db.video.update({where: {id}, data: {isReady: true}});
}

async function runWorker() {
  await boss.start();
  await boss.createQueue(queue);

  await boss.work(queue, async (jobs: RenderVideoJob[]) => {
    const job = jobs[0]!;  // Only one job by default
    console.log(`received job ${job.id} with data ${JSON.stringify(job.data)}`);
    await renderVideo(job.data.discoData, job.data.videoId);
  });
}

runWorker()
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
