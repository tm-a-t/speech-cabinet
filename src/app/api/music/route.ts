import { NextResponse, type NextRequest } from "next/server";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { ost } from "~/lib/music";

export const dynamic = "force-dynamic";

export type MusicEntry = {
  name: string;
  url: string | null;
  exists: boolean;
};

export type MusicAvailability = {
  entries: MusicEntry[];
  anyExist: boolean;
};

/**
 * Lists every track in `src/lib/music.ts`'s `ost` list and reports which
 * of the corresponding files are actually present in `public/music/` at
 * request time. The Music picker uses this to grey out broken options so
 * users can't trigger the #20 "Rendering..." hang by selecting a track
 * whose audio file was never installed on the server.
 */
export async function GET(_: NextRequest): Promise<NextResponse<MusicAvailability>> {
  const musicDir = path.join(process.cwd(), "public", "music");
  let installed = new Set<string>();
  try {
    if (existsSync(musicDir) && statSync(musicDir).isDirectory()) {
      installed = new Set(readdirSync(musicDir));
    }
  } catch {
    // Permission / I/O error - treat as empty; callers see anyExist:false.
  }

  const entries: MusicEntry[] = ost.map((track) => {
    if (track.url === null) {
      return { name: track.name, url: null, exists: true };
    }
    // `ost` urls are `/music/<filename>`.
    const filename = decodeURIComponent(track.url.replace(/^\/music\//, ""));
    return {
      name: track.name,
      url: track.url,
      exists: installed.has(filename),
    };
  });

  const anyExist = entries.some((e) => e.url !== null && e.exists);
  return NextResponse.json({ entries, anyExist });
}
