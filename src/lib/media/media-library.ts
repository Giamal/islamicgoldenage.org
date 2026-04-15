import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export type MediaAsset = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  alt: string;
  caption: string;
  credit: string;
  source: string;
  createdAt: string;
};

const mediaDirectory = path.join(process.cwd(), "public", "uploads", "media");
const mediaManifestPath = path.join(process.cwd(), "data", "media-library.json");

async function ensureMediaStorage() {
  await mkdir(mediaDirectory, { recursive: true });
  await mkdir(path.dirname(mediaManifestPath), { recursive: true });
}

export async function readMediaLibrary(): Promise<MediaAsset[]> {
  await ensureMediaStorage();

  try {
    const raw = await readFile(mediaManifestPath, "utf8");
    const parsed = JSON.parse(raw) as MediaAsset[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export async function writeMediaLibrary(assets: MediaAsset[]) {
  await ensureMediaStorage();
  await writeFile(mediaManifestPath, JSON.stringify(assets, null, 2), "utf8");
}

export function resolveMediaFilePath(filename: string) {
  return path.join(mediaDirectory, filename);
}

export function toPublicMediaUrl(filename: string) {
  return `/uploads/media/${filename}`;
}

export async function readFileSize(filePath: string) {
  const details = await stat(filePath);
  return details.size;
}

