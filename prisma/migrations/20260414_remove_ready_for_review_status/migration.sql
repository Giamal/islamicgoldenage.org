-- Remove the transitional "ready_for_review" status from ContentStatus.
-- Existing records are safely downgraded to "draft" before enum replacement.

UPDATE "ContentEntity"
SET "status" = 'draft'
WHERE "status" = 'ready_for_review';

ALTER TYPE "ContentStatus" RENAME TO "ContentStatus_old";

CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published', 'archived');

ALTER TABLE "ContentEntity"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "ContentStatus"
USING ("status"::text::"ContentStatus"),
ALTER COLUMN "status" SET DEFAULT 'draft';

DROP TYPE "ContentStatus_old";

