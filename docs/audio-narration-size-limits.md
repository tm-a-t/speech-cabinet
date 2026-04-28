# Audio Narration Size Limits

Audio narration v1 embeds clips directly in `DiscoData` as data URLs. This keeps
autosave and `.disco` import/export self-contained, but it is not expected to
scale indefinitely for full voiceover projects.

## Current Guardrails

- Soft warning: `3 MB` of original embedded audio bytes.
- Hard project warning: serialized project JSON around `7 MB`.
- These thresholds are intentionally conservative because data URLs add roughly
  one-third overhead before browser storage, download encoding, and queue payload
  costs.

## Line-By-Line Voiceover Requirement

A full voiceover commission should be delivered or prepared as one audio clip
per dialogue line. Speech Cabinet uses each clip's duration as that line's
timing, so a single full-session file cannot drive individual line timing
without being split first.

## Generated Fixture Sizes

The e2e suite generates deterministic WAV fixtures instead of committing large
binary files:

| Fixture | Format | Original size | Estimated data URL payload | Purpose |
| --- | --- | --- | --- | --- |
| `hq-voice-5s-48k-24bit-mono.wav` | 48 kHz / 24-bit / mono WAV | ~703 KB | ~938 KB | Short professional-style upload |
| `hq-voice-15s-48k-24bit-mono.wav` | 48 kHz / 24-bit / mono WAV | ~2.1 MB | ~2.8 MB | Long one-line professional-style upload |
| `hq-voice-30s-48k-24bit-mono.wav` | 48 kHz / 24-bit / mono WAV | ~4.1 MB | ~5.5 MB | Threshold pressure test |
| `fake-mic-12s-48k-16bit-mono.wav` | 48 kHz / 16-bit / mono WAV | ~1.1 MB | n/a | Fake microphone input for browser recording |

Browser-recorded clips are codec-dependent. Early manual testing produced a
12s recorded line around `185.2 KB`, which is much smaller than the fake input
WAV because Chromium's `MediaRecorder` output is compressed.

## E2E Size Matrix

| Scenario | Autosaves | Exports/imports `.disco` | Render job submits | MP4 narration mixes | Notes |
| --- | --- | --- | --- | --- | --- |
| One short high-quality WAV upload | Covered by e2e | Covered by e2e | Manual/optional | Manual/optional | Uses 5s 48 kHz / 24-bit mono WAV |
| One long high-quality WAV upload | Covered by e2e | Covered by e2e | Manual/optional | Manual/optional | Uses 15s 48 kHz / 24-bit mono WAV |
| Many short recorded clips | Covered by e2e | Covered in mixed e2e | Manual/optional | Manual/optional | Uses fake microphone and line-by-line assertions |
| Full-dialogue voiceover | Not suitable for v1 | Not suitable for v1 | v2 needed | v2 needed | Split by line, then store externally in v2 |

## V2 Threshold

If full voiceovers commonly exceed these guardrails, move clips out of project
JSON and store only stable clip references in `DiscoData`. Likely v2 options are
app-owned blob storage, a server-side upload step before rendering, and optional
compression/transcoding on upload or recording.
