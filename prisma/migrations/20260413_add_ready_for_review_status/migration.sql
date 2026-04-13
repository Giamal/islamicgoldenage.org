-- Adds a lightweight editorial state between draft and published.
ALTER TYPE "ContentStatus" ADD VALUE IF NOT EXISTS 'ready_for_review';
