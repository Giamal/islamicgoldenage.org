-- Add localized subtitle field for entity hero subheading support.
ALTER TABLE "ContentEntityLocalization"
ADD COLUMN "subtitle" TEXT NOT NULL DEFAULT '';
