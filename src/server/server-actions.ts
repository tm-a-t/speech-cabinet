'use server';

import type {DiscoData} from "~/lib/disco-data";
import {db} from "~/server/db";
import {boss, getJobPosition, jobIsPending, queue, startJob, type RenderVideoData} from '~/server/queue';
import type PgBoss from 'pg-boss';

/** Job still `created` — nothing has called `boss.work` for this queue. */
const UNCLAIMED_JOB_NOTICE_MS = 12_000;
/** Job is `active` but DB progress never moved from 0 (Chrome boot vs hung worker). */
const ACTIVE_NO_PROGRESS_NOTICE_MS = 90_000;

function renderWorkerNotice(
  job: PgBoss.JobWithMetadata<RenderVideoData> | null,
  videoProgress: number,
): string | null {
  const now = Date.now();
  if (job?.state === 'created') {
    const age = now - job.createdOn.getTime();
    if (age > UNCLAIMED_JOB_NOTICE_MS) {
      return 'This render is still waiting in the queue. A separate video worker must be running and using the same database as this app (for example `yarn work` while developing, or the worker container when using Docker).';
    }
    return null;
  }
  if (job?.state === 'active' && videoProgress === 0) {
    const startMs = job.startedOn?.getTime?.() ?? 0;
    const refMs = startMs > 0 ? startMs : job.createdOn.getTime();
    if (now - refMs > ACTIVE_NO_PROGRESS_NOTICE_MS) {
      return 'Rendering has not reported any progress for a while. Check the worker logs and confirm it is connected to this deployment’s database.';
    }
  }
  return null;
}

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

export type VideoProgressResult =
  | { status: 'progress'; progress: number; notice: string | null }
  | { status: 'finished'; warning: string | null };

export async function getVideoProgress(id: string): Promise<VideoProgressResult> {
  const video = await db.video.findFirst({where: {id}});
  if (video?.isReady) {
    return {status: 'finished', warning: video.renderWarning ?? null};
  }
  const progress = video?.progress ?? 0;
  const job = await boss.getJobById<RenderVideoData>(queue, id);
  const notice = renderWorkerNotice(job, progress);
  return {status: 'progress', progress, notice};
}
