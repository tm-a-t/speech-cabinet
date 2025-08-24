import { type NextRequest } from "next/server";
import {
  type Check,
  difficulties,
  type Difficulty,
  type DiscoData,
  message,
  type Message,
  type Result,
  results,
} from "~/lib/disco-data";
import { allPortraitNames } from "~/lib/names";
import { type startRender } from "~/server/server-actions";
import type { AsyncReturnType } from "type-fest";

type ResponseBody = {
  scheduled: false;
} | {
  scheduled: true;
  job: AsyncReturnType<typeof startRender>;
};

export async function POST(
  request: NextRequest,
){
  const text = request.nextUrl.searchParams.get("text");
  if (text === null) {
    return Response.json({}, { status: 400 });
  }

  const data = parse(text);
  if (data === null) {
    return Response.json({scheduled: false} as ResponseBody, { status: 200 });
  }

  const format = request.nextUrl.searchParams.get("format") ?? 'gif';
  const startRender = (await import("~/server/server-actions")).startRender;
  const job = await startRender(data, format === "gif");
  return Response.json({scheduled: true, job} as ResponseBody, { status: 200 });
}

// Finds a skill check or just punctuation between a name and a line
const separatorRegex =
  /[\[(](?<difficulty>.+)\s*(?:-|:|--|—|–)\s*(?<result>.+)[\])]| - |:|--|—|–/;

const trimEndRegex = /\s*(-|:|--|—|–)\s*$/;
const trimStartRegex = /^\s*(-|:|--|—|–)\s*/;


const COULD_NOT_PARSE = "could not parse";
type COULD_NOT_PARSE = typeof COULD_NOT_PARSE;

function parse(text: string): DiscoData | null {
  const parsedLines: Array<Message | null | COULD_NOT_PARSE> = text
    .split("\n")
    .map((line) => {
      if (line.trim() === "") return null;

      const match = separatorRegex.exec(line);
      if (match == null) return COULD_NOT_PARSE;

      const check = parseCheck(match.groups?.difficulty, match.groups?.result);
      return message.parse({
        name: normalizeName(line.substring(0, match.index)),
        text: normalizeText(line.substring(match.index + match[0].length)),
        check,
      });
    });

  console.log(parsedLines);

  if (parsedLines.includes(COULD_NOT_PARSE)) return null;
  const messages = parsedLines.filter((line) => line !== null) as Message[];

  console.log(messages);

  if (
    messages.every(
      (message) =>
        !allPortraitNames.includes(message.name) || message.check === undefined,
    )
  ) {
    // probably false positive
    return null;
  }

  const customNames = messages
    .filter(
      (message) =>
        message.check !== undefined && !allPortraitNames.includes(message.name),
    )
    .map((message) => message.name);
  const overrides = {
    checks: Object.fromEntries(customNames.map((name) => [name, true])),
    colorClass: Object.fromEntries(
      customNames.map((name) => [name, "text-intellect"]),
    ),
    portraitUrl: {},
  };

  return {
    messages,
    overrides,
    showPortraits: true,
    showParticles: false,
    music: null,
    skipMusicIntro: false,
    version: "0.1",
  };
}

function normalizeName(inputName: string): string {
  const trimmedName = inputName.replace(trimEndRegex, '').trim();
  return allPortraitNames.find(name =>
    name.toLowerCase() === trimmedName.toLowerCase()
  ) ?? trimmedName;
}

function normalizeText(inputText: string): string {
  return inputText.replace(trimStartRegex, '').trim();
}

function parseCheck(
  inputDifficulty: string | undefined,
  inputResult: string | undefined,
): Check | undefined {
  if (inputDifficulty === undefined || inputResult === undefined)
    return undefined;

  const difficulty = parseDifficulty(inputDifficulty);
  const result = parseResult(inputResult);
  if (!difficulty || !result) return undefined;

  return {
    difficulty,
    result,
    active: false,
  };
}

function parseDifficulty(inputDifficulty: string): Difficulty | null {
  return (
    difficulties.options.find(
      (difficulty) =>
        difficulty.toLowerCase() === inputDifficulty.toLowerCase().trim(),
    ) ?? null
  );
}

function parseResult(inputResult: string): Result | null {
  return (
    results.options.find(
      (result) => result.toLowerCase() === inputResult.toLowerCase().trim(),
    ) ?? null
  );
}
