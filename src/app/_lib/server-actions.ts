'use server';

import {DiscoData} from "./data-types";
import {db} from "~/server/db";
import {getJobPosition, jobIsPending, startJob} from '~/server/queue';

export async function startRender(data: DiscoData): Promise<{ id: string, queuePosition: number }> {
  const dbModel = await db.video.create({data: {}});
  const id = dbModel.id;
  await startJob({videoId: id, discoData: data});
  const queuePosition = await getVideoQueuePosition(id);
  return {id, queuePosition};
}

export async function getVideoQueuePosition(id: string): Promise<number> {
  if (!await jobIsPending(id)) {
    return 0;
  }
  return await getJobPosition(id);
}

export async function getVideoProgress(id: string): Promise<number> {
  const video = await db.video.findFirst({where: {id}});
  return video?.progress ?? 0;
}

export async function getVideoStatus(id: string): Promise<boolean> {
  const video = await db.video.findFirst({where: {id}});
  return video?.isReady ?? true;
}
