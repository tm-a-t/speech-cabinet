'use server';

import {SavedData} from "./data-types";
import {totalDuration, totalTimeLimit} from '~/app/_lib/time';
import {PuppeteerScreenRecorder} from 'puppeteer-screen-recorder/build/main';
import puppeteer from 'puppeteer';
import {env} from '~/env';
import {db} from "~/server/db";
import {getVideoPath, sleep} from '~/app/_lib/utils';
import * as fs from 'fs';

export async function startRender(data: SavedData) {
  const dbModel = await db.video.create({data: {}})
  void render(data, dbModel.id)
  return dbModel.id

  // timecut({
  //   duration: totalDuration(data),
  //   output: filename,
  //   tempDir: id,
  //   url: 'https://localhost:3000/render?' + params,
  //   viewport: {
  //     width: 720,
  //     height: 1280,
  //   },
  // }).then(() => {
  //   console.log('okay')
  // });
}

async function render(data: SavedData, id: string) {
  const params = new URLSearchParams({data: JSON.stringify(data)}).toString();
  const filename = getVideoPath(id);

  const browser = await puppeteer.launch({
    args: [`--window-size=1080,1920`, '--enable-gpu', '--use-angle'],
    defaultViewport: {
      width: 1080,
      height: 1920,
    },
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/render?' + params);
  // eslint-expect-error @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-member-access
  const recorder = new PuppeteerScreenRecorder(page, {
    ffmpeg_Path: env.FFMPEG_PATH,
    format: 'png',
    fps: 30,
    recordDurationLimit: totalTimeLimit,
  });
  await recorder.start(filename);
  await sleep(totalDuration(data));
  await recorder.stop();
  await browser.close();
  await db.video.update({where: {id}, data: {isReady: true}})
}

export async function getVideoStatus(id: string): Promise<boolean> {
  const video = await db.video.findFirst({where: {id}});
  return video?.isReady ?? true;
}
