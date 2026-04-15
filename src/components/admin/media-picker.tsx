"use client";

import { useEffect, useMemo, useState } from "react";

import type { MediaAsset } from "@/lib/media/media-library";

type MediaPickerProps = {
  onInsert: (asset: MediaAsset) => void;
};

type UploadState = {
  alt: string;
  caption: string;
  credit: string;
  source: string;
};

const initialUploadState: UploadState = {
  alt: "",
  caption: "",
  credit: "",
  source: "",
};

export function MediaPicker({ onInsert }: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>(initialUploadState);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadAssets() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/media", {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to load media.");
        }
        const payload = (await response.json()) as { assets: MediaAsset[] };
        setAssets(payload.assets);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load media.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query.length === 0) {
      return assets;
    }

    return assets.filter((asset) =>
      [asset.filename, asset.alt, asset.caption, asset.credit, asset.source]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [assets, search]);

  async function handleUpload() {
    if (!selectedFile) {
      setError("Select an image before uploading.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", selectedFile);
    formData.set("alt", uploadState.alt);
    formData.set("caption", uploadState.caption);
    formData.set("credit", uploadState.credit);
    formData.set("source", uploadState.source);

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed.");
      }
      const payload = (await response.json()) as { asset: MediaAsset };
      setAssets((previous) => [payload.asset, ...previous]);
      setSelectedFile(null);
      setUploadState(initialUploadState);
      onInsert(payload.asset);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  const selectedAsset =
    selectedAssetId !== null
      ? assets.find((asset) => asset.id === selectedAssetId) ?? null
      : null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-3 space-y-3">
      <div className="space-y-2">
        <p className="text-sm font-semibold">Media library</p>
        <p className="text-xs text-[var(--muted)]">
          Upload images with metadata, then insert them into body content.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <input
          type="file"
          accept="image/*"
          onChange={(event) =>
            setSelectedFile(event.currentTarget.files?.[0] ?? null)
          }
          className="rounded-md border border-[var(--border)] px-2 py-1.5 text-xs"
        />
        <input
          value={uploadState.alt}
          onChange={(event) =>
            setUploadState((current) => ({ ...current, alt: event.target.value }))
          }
          placeholder="Alt text"
          className="rounded-md border border-[var(--border)] px-2 py-1.5 text-xs"
        />
        <input
          value={uploadState.caption}
          onChange={(event) =>
            setUploadState((current) => ({ ...current, caption: event.target.value }))
          }
          placeholder="Caption"
          className="rounded-md border border-[var(--border)] px-2 py-1.5 text-xs"
        />
        <input
          value={uploadState.credit}
          onChange={(event) =>
            setUploadState((current) => ({ ...current, credit: event.target.value }))
          }
          placeholder="Credit"
          className="rounded-md border border-[var(--border)] px-2 py-1.5 text-xs"
        />
        <input
          value={uploadState.source}
          onChange={(event) =>
            setUploadState((current) => ({ ...current, source: event.target.value }))
          }
          placeholder="Source URL or note"
          className="rounded-md border border-[var(--border)] px-2 py-1.5 text-xs"
        />
      </div>

      {selectedFile ? (
        <p className="text-xs text-[var(--muted)]">
          Selected file: <span className="font-medium">{selectedFile.name}</span>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload and insert"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (selectedAsset) {
              onInsert(selectedAsset);
            }
          }}
          disabled={!selectedAsset}
          className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
        >
          Insert selected media
        </button>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search existing media"
          className="flex-1 rounded-md border border-[var(--border)] px-2 py-1.5 text-xs"
        />
      </div>

      {error ? <p className="text-xs text-red-700">{error}</p> : null}

      {selectedAsset ? (
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-strong)] p-2 text-xs">
          <p className="font-semibold">Selected media preview</p>
          <p className="text-[var(--muted)]">
            Alt: {selectedAsset.alt || "none"} | Caption: {selectedAsset.caption || "none"} |
            Credit: {selectedAsset.credit || "none"}
          </p>
        </div>
      ) : null}

      <div className="max-h-56 overflow-y-auto rounded-md border border-[var(--border)]">
        {loading ? (
          <p className="p-3 text-xs text-[var(--muted)]">Loading media...</p>
        ) : filteredAssets.length === 0 ? (
          <p className="p-3 text-xs text-[var(--muted)]">No media yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {filteredAssets.map((asset) => (
              <li
                key={asset.id}
                className="flex items-center gap-3 px-3 py-2 text-xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.alt || ""}
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{asset.caption || asset.filename}</p>
                  <p className="truncate text-[var(--muted)]">
                    {asset.credit || asset.alt || "No metadata"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onInsert(asset)}
                  className="rounded border border-[var(--border)] px-2 py-1 font-semibold hover:border-[var(--accent)]"
                >
                  Insert
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`rounded border px-2 py-1 font-semibold ${
                    selectedAssetId === asset.id
                      ? "border-[var(--accent)] bg-[var(--surface-muted)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
