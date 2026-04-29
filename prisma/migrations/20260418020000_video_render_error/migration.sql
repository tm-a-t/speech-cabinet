-- #18: worker persists fatal failures (crash, RENDER_DEADLINE_MS timeout) so the UI
-- can switch from "Rendering..." to "Rendering failed" instead of polling forever.
ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "renderError" TEXT;
