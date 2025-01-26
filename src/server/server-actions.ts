'use server';

import type {DiscoData} from "~/lib/disco-data";
import {db} from "~/server/db";
import {getJobPosition, jobIsPending, startJob} from '~/server/queue';

export async function startRender(data: DiscoData, convertToGif: boolean): Promise<{ id: string, queuePosition: number }> {
  const dbModel = await db.video.create({data: {}});
  const id = dbModel.id;
  await startJob({videoId: id, discoData: data, convertToGif: convertToGif});
  const queuePosition = await getVideoQueuePosition(id);
  console.log('something beautiful created', id)
  return {id, queuePosition};
}

export async function getVideoQueuePosition(id: string): Promise<number> {
  console.log('something beautiful checked', id)
  if (!await jobIsPending(id)) {
    return 0;
  }
  return await getJobPosition(id);
}

export async function getVideoProgress(id: string): Promise<number> {
  const video = await db.video.findFirst({where: {id}});
  return video?.progress ?? 0;
}
