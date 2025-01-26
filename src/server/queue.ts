import PgBoss, {type Db, type Job} from 'pg-boss';
import {env} from '~/env';
import type {DiscoData} from '~/lib/disco-data';

export const boss = new PgBoss(env.DATABASE_URL);
boss.on('error', console.error);
await boss.start();

export const queue = 'render-video';
type RenderVideoData = {
  videoId: string
  discoData: DiscoData
  convertToGif: boolean
}
export type RenderVideoJob = Job<RenderVideoData>

export async function startJob(data: RenderVideoData): Promise<void> {
  await boss.send(queue, data, {id: data.videoId});
}

export async function jobIsPending(id: string): Promise<boolean> {
  const job = await boss.getJobById(queue, id);
  return job!.state === 'created';
}

export async function getJobPosition(id: string): Promise<number> {

  const sql = `
      SELECT count(*) as count
      FROM pgboss.job
      WHERE name = $1
        AND state IN ('active', 'created')
        AND created_on < (SELECT created_on FROM pgboss.job WHERE id = $2)`;

  // @ts-expect-error untyped method
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const db = await boss.getDb() as Db;
  const result = await db.executeSql(sql, [queue, id]) as { rows: { count: string }[] };
  return parseFloat(result.rows[0]!.count);
}
