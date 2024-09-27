import { NextResponse, type NextRequest } from "next/server";
import * as fs from "fs";
import { getVideoPath } from "~/lib/utils";

export const dynamic = "force-static";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!/^[0-9A-F\-]+$/i.test(params.id)) {
    return new NextResponse(null, { status: 400 });
  }
  const videoPath = getVideoPath(params.id);
  if (!fs.existsSync(videoPath)) {
    return new NextResponse(null, { status: 400 });
  }
  const file = fs.readFileSync(videoPath);
  return new NextResponse(file, { headers: { "content-type": "video/mp4" } });
}
