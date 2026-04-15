import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { MediaAsset } from "@/lib/media/types";

export const runtime = "nodejs";
const mediaBucket = "media";

function getSafeExtension(filename: string) {
  const extension = path.extname(filename).toLowerCase();
  if (extension.length > 10) {
    return "";
  }
  return extension;
}

function getSafeBasename(filename: string) {
  const base = path.basename(filename, path.extname(filename));
  const cleaned = base.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-");
  return cleaned.slice(0, 80).replace(/^-|-$/g, "") || "upload";
}

function toApiAsset(asset: {
  id: string;
  url: string;
  storagePath: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  alt: string | null;
  caption: string | null;
  credit: string | null;
  source: string | null;
  createdAt: Date;
}): MediaAsset {
  return {
    ...asset,
    createdAt: asset.createdAt.toISOString(),
  };
}

export async function GET() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ assets: assets.map(toApiAsset) });
}

export async function POST(request: Request) {
  let uploadedStoragePath: string | null = null;
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "Invalid file" }), {
        status: 400,
      });
    }
    if (!file.type || !file.type.startsWith("image/")) {
      return new Response(JSON.stringify({ error: "Only image uploads are allowed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getSafeExtension(file.name);
    const basename = getSafeBasename(file.name);
    const timestamp = Date.now();
    const uuid = randomUUID();
    const filename = `${timestamp}-${uuid}-${basename}${extension}`;
    const storagePath = `entities/${filename}`;
    const contentType = file.type || "application/octet-stream";

    const supabase = getSupabaseServerClient();
    const { error: uploadError } = await supabase.storage
      .from(mediaBucket)
      .upload(storagePath, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("MEDIA UPLOAD ERROR: Supabase upload failed", uploadError);
      return new Response(JSON.stringify({ error: "Upload failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    uploadedStoragePath = storagePath;

    const { data: publicUrlData } = supabase.storage
      .from(mediaBucket)
      .getPublicUrl(storagePath);
    const url = publicUrlData.publicUrl;

    const saved = await prisma.mediaAsset.create({
      data: {
        url,
        storagePath,
        filename,
        mimeType: contentType,
        sizeBytes: file.size,
        alt: String(formData.get("alt") ?? "").trim() || null,
        caption: String(formData.get("caption") ?? "").trim() || null,
        credit: String(formData.get("credit") ?? "").trim() || null,
        source: String(formData.get("source") ?? "").trim() || null,
      },
    });

    const asset: MediaAsset = toApiAsset(saved);
    return new Response(JSON.stringify({ success: true, url, asset }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("MEDIA UPLOAD ERROR:", error);

    if (uploadedStoragePath) {
      try {
        const supabase = getSupabaseServerClient();
        const { error: removeError } = await supabase.storage
          .from(mediaBucket)
          .remove([uploadedStoragePath]);
        if (removeError) {
          console.error(
            "MEDIA UPLOAD ERROR: failed to rollback uploaded file",
            removeError,
          );
        }
      } catch (rollbackError) {
        console.error(
          "MEDIA UPLOAD ERROR: rollback threw an exception",
          rollbackError,
        );
      }
    }

    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
