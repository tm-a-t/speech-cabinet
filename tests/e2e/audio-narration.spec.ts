import { expect, test, type Locator, type Page } from "@playwright/test";
import { stat } from "node:fs/promises";
import path from "node:path";

const audioFixtureDir = path.join(process.cwd(), "tests", "fixtures", "audio");
const hqVoice5s = path.join(audioFixtureDir, "hq-voice-5s-48k-24bit-mono.wav");
const hqVoice15s = path.join(audioFixtureDir, "hq-voice-15s-48k-24bit-mono.wav");

type SavedNarration = {
  src: string;
  durationMs: number;
  name?: string;
  mimeType?: string;
  sizeBytes?: number;
};

type SavedMessage = {
  name: string;
  text: string;
  narration?: SavedNarration;
};

type SavedData = {
  messages: SavedMessage[];
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByTestId("narration-trigger").first()).toBeVisible();
});

test("uploads a professional-style WAV and preserves it through .disco export/import", async ({ page }, testInfo) => {
  await attachAudioToLine(page, 0, hqVoice15s);

  await expect(page.getByText("hq-voice-15s-48k-24bit-mono.wav")).toBeVisible();
  await expect(page.getByText(/15s · 2\.1 MB/)).toBeVisible();
  await expect(page.getByText(/Total embedded audio: 2\.1 MB/)).toBeVisible();
  await expect(page.getByTestId("narration-trigger").first()).toHaveAttribute("data-state", "attached");

  const savedData = await waitForSavedData(
    page,
    (data) => data.messages[0]?.narration !== undefined,
  );
  const narration = getNarration(savedData, 0);
  expect(narration.name).toBe("hq-voice-15s-48k-24bit-mono.wav");
  expect(narration.durationMs).toBeGreaterThanOrEqual(14_900);
  expect(narration.durationMs).toBeLessThanOrEqual(15_100);
  expect(narration.src).toContain("data:audio/");

  await page.keyboard.press("Escape");
  await page.getByTestId("narration-trigger").first().click();
  await expect(page.getByText("hq-voice-15s-48k-24bit-mono.wav")).toBeVisible();

  const exportedPath = await exportDisco(page, testInfo.outputPath("narrated.disco"));
  const exportedSize = (await stat(exportedPath)).size;
  expect(exportedSize).toBeGreaterThan(2_800_000);

  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await importDisco(page, exportedPath);

  await page.getByTestId("narration-trigger").first().click();
  await expect(page.getByText("hq-voice-15s-48k-24bit-mono.wav")).toBeVisible();
  await expect(page.getByText(/15s · 2\.1 MB/)).toBeVisible();
});

test("records separate smaller clips line by line with fake microphone input", async ({ page }) => {
  await page.getByRole("button", { name: "+ Add line" }).click();

  const firstPanelBefore = await openNarrationPanel(page, 0);
  await page.getByRole("button", { name: "Record" }).click();
  await expect(page.getByTestId("narration-recording-badge")).toBeVisible();
  await expect(page.getByTestId("narration-trigger").first()).toHaveAttribute("data-state", "recording");

  const dragHandle = page.getByTestId("narration-drag-handle");
  await dragBy(page, dragHandle, 120, 70);
  const firstPanelAfter = await page.getByRole("dialog").boundingBox();
  expect(firstPanelAfter?.x).toBeGreaterThan((firstPanelBefore?.x ?? 0) + 40);
  expect(firstPanelAfter?.y).toBeGreaterThan((firstPanelBefore?.y ?? 0) + 20);

  await page.waitForTimeout(3_000);
  await page.getByRole("button", { name: "Stop" }).click();
  await expect(page.getByText("Recorded narration")).toBeVisible();
  await page.keyboard.press("Escape");

  await openNarrationPanel(page, 1);
  await page.getByRole("button", { name: "Record" }).click();
  await expect(page.getByTestId("narration-recording-badge")).toBeVisible();
  await page.waitForTimeout(1_500);
  await page.getByRole("button", { name: "Stop" }).click();
  await expect(page.getByText("Recorded narration")).toBeVisible();

  const savedData = await waitForSavedData(
    page,
    (data) => data.messages.filter((message) => message.narration).length === 2,
  );
  const narrations = savedData.messages
    .map((message) => message.narration)
    .filter((narration): narration is SavedNarration => narration !== undefined);
  expect(narrations).toHaveLength(2);
  const firstNarration = narrations[0]!;
  const secondNarration = narrations[1]!;
  expect(firstNarration.src).not.toEqual(secondNarration.src);
  expect(firstNarration.durationMs).toBeGreaterThan(secondNarration.durationMs);
  expect(firstNarration.sizeBytes).toBeGreaterThan(10_000);
  expect(secondNarration.sizeBytes).toBeGreaterThan(10_000);

  await page.getByTestId("remove-narration").click();
  const afterRemoval = await waitForSavedData(
    page,
    (data) =>
      data.messages[0]?.narration !== undefined &&
      data.messages[1]?.narration === undefined,
  );
  expect(afterRemoval.messages[0]?.narration).toBeDefined();
  expect(afterRemoval.messages[1]?.narration).toBeUndefined();
});

test("keeps mixed uploaded and recorded clips mapped line by line", async ({ page }, testInfo) => {
  await page.getByRole("button", { name: "+ Add line" }).click();
  await page.getByRole("button", { name: "+ Add line" }).click();

  await attachAudioToLine(page, 0, hqVoice5s);
  await page.keyboard.press("Escape");

  await openNarrationPanel(page, 1);
  await page.getByRole("button", { name: "Record" }).click();
  await page.waitForTimeout(1_500);
  await page.getByRole("button", { name: "Stop" }).click();
  await expect(page.getByText("Recorded narration")).toBeVisible();

  const savedData = await waitForSavedData(
    page,
    (data) =>
      data.messages[0]?.narration !== undefined &&
      data.messages[1]?.narration !== undefined &&
      data.messages[2]?.narration === undefined,
  );
  const uploadedNarration = getNarration(savedData, 0);
  const recordedNarration = getNarration(savedData, 1);
  expect(uploadedNarration.name).toBe("hq-voice-5s-48k-24bit-mono.wav");
  expect(recordedNarration.name).toBe("Recorded narration");
  expect(savedData.messages[2]?.narration).toBeUndefined();
  expect(uploadedNarration.durationMs).toBeGreaterThan(recordedNarration.durationMs);

  const exportedPath = await exportDisco(page, testInfo.outputPath("mixed-narration.disco"));
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await importDisco(page, exportedPath);

  const importedData = await readSavedData(page);
  expect(getNarration(importedData, 0).name).toBe("hq-voice-5s-48k-24bit-mono.wav");
  expect(getNarration(importedData, 1).name).toBe("Recorded narration");
  expect(importedData.messages[2]?.narration).toBeUndefined();
});

async function attachAudioToLine(page: Page, lineIndex: number, filePath: string) {
  await openNarrationPanel(page, lineIndex);
  await page.getByTestId("narration-file-input").setInputFiles(filePath);
  await expect(page.getByText(path.basename(filePath))).toBeVisible();
}

async function openNarrationPanel(page: Page, lineIndex: number) {
  await page.getByTestId("narration-trigger").nth(lineIndex).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  return page.getByRole("dialog").boundingBox();
}

async function exportDisco(page: Page, outputPath: string) {
  await page.getByText("File").click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("download-disco-file").click();
  const download = await downloadPromise;
  await download.saveAs(outputPath);
  return outputPath;
}

async function importDisco(page: Page, filePath: string) {
  await page.getByText("File").click();
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByTestId("open-disco-file").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(filePath);
  await expect(page.getByTestId("narration-trigger").first()).toBeVisible();
}

async function readSavedData(page: Page): Promise<SavedData> {
  await expect
    .poll(async () => page.evaluate(() => localStorage.getItem("data")))
    .not.toBeNull();
  const data = await page.evaluate(() => localStorage.getItem("data"));
  return JSON.parse(data!);
}

async function waitForSavedData(
  page: Page,
  predicate: (data: SavedData) => boolean,
): Promise<SavedData> {
  await expect
    .poll(async () => {
      const data = await readSavedData(page);
      return predicate(data);
    })
    .toBe(true);

  return readSavedData(page);
}

function getNarration(data: SavedData, messageIndex: number): SavedNarration {
  const narration = data.messages[messageIndex]?.narration;
  expect(narration).toBeDefined();
  return narration!;
}

async function dragBy(page: Page, locator: Locator, x: number, y: number) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 + x, box!.y + box!.height / 2 + y);
  await page.mouse.up();
}
