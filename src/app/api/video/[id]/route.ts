import {db} from '~/server/db';
import {NextRequest, NextResponse} from 'next/server';
import * as fs from 'fs';
import {getVideoPath} from '~/app/_lib/utils';

// cache this route
// export const dynamic = 'force-static';

export async function GET(
  request: NextRequest,
  {params}: { params: { id: string } },
) {
  const video = await db.video.findFirst({where: {id: params.id}});
  if (!video?.isReady) {
    return new NextResponse(null, {status: 400});
  }
  const file = fs.readFileSync(getVideoPath(params.id));
  return new NextResponse(file, {headers: {'content-type': 'video/mp4'}});
}
