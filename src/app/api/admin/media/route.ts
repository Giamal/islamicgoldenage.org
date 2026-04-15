import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

import {
  readMediaLibrary,
  toPublicMediaUrl,
  type MediaAsset,
} from "@/lib/media/media-library";

export const runtime = "nodejs";

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
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "Invalid file" }), {
        status: 400,
      });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "media");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const dbPath = path.join(process.cwd(), "data", "media-library.json");
    const dbDirectory = path.dirname(dbPath);
    if (!fs.existsSync(dbDirectory)) {
      fs.mkdirSync(dbDirectory, { recursive: true });
    }
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify([]), "utf8");
    }

    const extension = getSafeExtension(file.name);
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const sizeBytes = fs.statSync(filePath).size;
    const url = toPublicMediaUrl(filename);
    const asset: MediaAsset = {
      id: randomUUID(),
      url,
      filename,
      mimeType: file.type || "application/octet-stream",
      sizeBytes,
      alt: String(formData.get("alt") ?? "").trim(),
      caption: String(formData.get("caption") ?? "").trim(),
      credit: String(formData.get("credit") ?? "").trim(),
      source: String(formData.get("source") ?? "").trim(),
      createdAt: new Date().toISOString(),
    };

    const dbRaw = fs.readFileSync(dbPath, "utf8");
    const db = JSON.parse(dbRaw) as MediaAsset[];
    const normalized = Array.isArray(db) ? db : [];
    normalized.unshift(asset);
    fs.writeFileSync(dbPath, JSON.stringify(normalized, null, 2), "utf8");

    return new Response(JSON.stringify({ success: true, url, asset }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("MEDIA UPLOAD ERROR:", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
