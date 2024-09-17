'use server';

import {DiscoData} from "./data-types";
import {totalDuration, totalTimeLimit} from '~/app/_lib/time';
import {env} from '~/env';
import {db} from "~/server/db";
import {getVideoPath, sleep} from '~/app/_lib/utils';
// @ts-ignore
import WebVideoCreator, {VIDEO_ENCODER, logger} from 'web-video-creator';

const wvc = new WebVideoCreator();
wvc.config({
  // mp4Encoder: VIDEO_ENCODER.NVIDIA.H264,
  debug: true,
  browserDebug: true,
  ffmpegDebug: true,
  compatibleRenderingMode: true,
  ffmpegExecutablePath: 'ffmpeg',
  frameFormat: 'png',
});


export async function startRender(data: DiscoData) {
  const dbModel = await db.video.create({data: {}});
  void render(data, dbModel.id);
  return dbModel.id;
}

async function render(data: DiscoData, id: string) {
  const params = new URLSearchParams({data: JSON.stringify(data)}).toString();
  const filename = getVideoPath(id);

  const video = wvc.createSingleVideo({
    url: 'http://localhost:3000/render?' + params,
    width: 1080,
    height: 1920,
    fps: 30,
    duration: totalDuration(data),
    outputPath: filename,
  });
  video.once('completed', () => {
    void db.video.update({where: {id}, data: {isReady: true}}).then(() => {});
  })
  video.on("progress", (progress: number) => {
    void db.video.update({where: {id}, data: {progress: Math.floor(progress)}}).then(() => {});
  });
  video.start();

  // const browser = await puppeteer.launch({
  //   args: [`--window-size=1080,1920`, '--enable-gpu', '--use-angle'],
  //   defaultViewport: {
  //     width: 1080,
  //     height: 1920,
  //   },
  // });
  // const page = await browser.newPage();
  // await page.goto('http://localhost:3000/render?' + params);
  // // eslint-expect-error @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-member-access
  // const recorder = new PuppeteerScreenRecorder(page, {
  //   ffmpeg_Path: env.FFMPEG_PATH,
  //   format: 'png',
  //   fps: 30,
  //   recordDurationLimit: totalTimeLimit,
  // });
  // await recorder.start(filename);
  // await sleep(totalDuration(data));
  // await recorder.stop();
  // await browser.close();
}

export async function getVideoProgress(id: string): Promise<number> {
  const video = await db.video.findFirst({where: {id}});
  return video?.progress ?? 0;
}

export async function getVideoStatus(id: string): Promise<boolean> {
  const video = await db.video.findFirst({where: {id}});
  return video?.isReady ?? true;
}
