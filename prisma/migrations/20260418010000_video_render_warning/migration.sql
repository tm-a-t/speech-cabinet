-- #20: worker surfaces a non-fatal note (e.g. missing music asset) to the UI.
ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "renderWarning" TEXT;
