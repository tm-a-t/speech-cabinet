import assert from "node:assert/strict";
import { getDefaultData, serialize, toDiscoData } from "~/lib/disco-data";
import {
  activeCheckTapeRollDuration,
  getFallbackMessageDuration,
  getMessageDisplayDuration,
  getMessageTimeline,
  totalDuration,
} from "~/lib/time";

const legacyData = getDefaultData();
assert.equal(toDiscoData(serialize(legacyData))?.messages[0]?.narration, undefined);

const narratedData = {
  ...legacyData,
  messages: [
    {
      ...legacyData.messages[0]!,
      narration: {
        src: "data:audio/webm;base64,AAAA",
        durationMs: 2500,
        name: "clip.webm",
        mimeType: "audio/webm",
        sizeBytes: 4,
      },
    },
    {
      name: "You",
      text: "Fallback timing",
      check: { difficulty: "Medium" as const, result: "Success" as const, active: true },
    },
  ],
};

const parsedData = toDiscoData(JSON.stringify(narratedData));
assert.ok(parsedData);
assert.equal(getMessageDisplayDuration(parsedData.messages[0]!), 2500);
assert.equal(
  getMessageDisplayDuration(parsedData.messages[1]!),
  getFallbackMessageDuration(parsedData.messages[1]!),
);

const timeline = getMessageTimeline(parsedData);
assert.equal(timeline[0]?.startMs, 0);
assert.equal(timeline[0]?.displayDurationMs, 2500);
assert.equal(timeline[1]?.startMs, 2500 + activeCheckTapeRollDuration);
assert.equal(
  totalDuration(parsedData),
  timeline.reduce((sum, item) => sum + item.preDisplayDurationMs + item.displayDurationMs, 0) + 1500,
);

assert.equal(
  toDiscoData(JSON.stringify({
    ...legacyData,
    messages: [{ name: "You", text: "", narration: { src: "data:text/plain;base64,AAAA", durationMs: 1 } }],
  })),
  null,
);

console.log("audio narration smoke tests passed");
