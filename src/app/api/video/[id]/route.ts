import { NextResponse, type NextRequest } from "next/server";
import * as fs from "fs";
import { getVideoPath } from "~/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!/^[0-9A-F\-]+$/i.test(params.id)) {
    return new NextResponse(null, { status: 400 });
  }
  const videoPath = getVideoPath(params.id);
  if (!fs.existsSync(videoPath)) {
    return new NextResponse(null, { status: 404 });
  }
  const file = await fs.openAsBlob(videoPath);
  return new NextResponse(file, { headers: { "content-type": "video/mp4" } });
}
