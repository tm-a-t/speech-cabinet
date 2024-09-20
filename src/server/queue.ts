import PgBoss, {Job, Db, SendOptions} from 'pg-boss';
import {env} from '~/env';
import {DiscoData} from '~/app/_lib/data-types';

export const boss = new PgBoss(env.DATABASE_URL);
boss.on('error', console.error);

export const queue = 'render-video';
type RenderVideoData = {
  videoId: string
  discoData: DiscoData
}
export type RenderVideoJob = Job<RenderVideoData>

export async function startJob(data: RenderVideoData) {
  await boss.start();
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
    AND created_on < (SELECT created_on FROM pgboss.job WHERE id = $2)`

  // @ts-expect-error
  const result = await boss.getDb().executeSql(sql, [queue, id])
  return parseFloat(result.rows[0].count)
}
