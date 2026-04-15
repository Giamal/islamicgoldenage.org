import { randomUUID } from "node:crypto";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";

import {
  readFileSize,
  readMediaLibrary,
  resolveMediaFilePath,
  toPublicMediaUrl,
  type MediaAsset,
  writeMediaLibrary,
} from "@/lib/media/media-library";

function getSafeExtension(filename: string) {
  const extension = path.extname(filename).toLowerCase();
  if (extension.length > 10) {
    return "";
  }
  return extension;
}

export async function GET() {
  const assets = await readMediaLibrary();
  const sorted = [...assets].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
  return NextResponse.json({ assets: sorted });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const uploaded = formData.get("file");

  if (!(uploaded instanceof File)) {
    return NextResponse.json(
      { error: "A file is required." },
      { status: 400 },
    );
  }

  const extension = getSafeExtension(uploaded.name);
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = resolveMediaFilePath(filename);
  const buffer = Buffer.from(await uploaded.arrayBuffer());
  await writeFile(filePath, buffer);

  const sizeBytes = await readFileSize(filePath);
  const asset: MediaAsset = {
    id: randomUUID(),
    url: toPublicMediaUrl(filename),
    filename,
    mimeType: uploaded.type || "application/octet-stream",
    sizeBytes,
    alt: String(formData.get("alt") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim(),
    credit: String(formData.get("credit") ?? "").trim(),
    source: String(formData.get("source") ?? "").trim(),
    createdAt: new Date().toISOString(),
  };

  const existing = await readMediaLibrary();
  await writeMediaLibrary([asset, ...existing]);

  return NextResponse.json({ asset }, { status: 201 });
}

