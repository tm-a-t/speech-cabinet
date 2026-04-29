import { ensureAudioFixtures } from "../../scripts/generate-audio-fixtures";

export default async function globalSetup() {
  await ensureAudioFixtures();
}
