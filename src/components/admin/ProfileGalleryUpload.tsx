"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ProfileGalleryUpload({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    const supabase = createClient();
    const nextUrls = [...urls];

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          setError("Please upload image files only.");
          continue;
        }

        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `gallery/profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(path, file, { upsert: true });

        if (uploadError) {
          setError(uploadError.message);
          continue;
        }

        const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
        nextUrls.push(data.publicUrl);
      }

      onChange(nextUrls);
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= urls.length) return;
    const next = [...urls];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--line)] p-4">
      <div>
        <p className="text-sm font-medium text-navy-deep">Profile gallery</p>
        <p className="mt-1 text-xs text-ink-muted">
          Upload multiple photos. Visitors can swipe through them on the homepage.
        </p>
      </div>

      {urls.length === 0 ? (
        <p className="text-sm text-ink-muted">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {urls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="overflow-hidden rounded-xl border border-[var(--line)] bg-bg-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Gallery photo ${index + 1}`}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="text-[0.7rem] text-ink-muted">#{index + 1}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded-md border border-[var(--line)] px-2 py-1 text-xs disabled:opacity-40"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === urls.length - 1}
                    className="rounded-md border border-[var(--line)] px-2 py-1 text-xs disabled:opacity-40"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          void handleUpload(e.target.files);
          e.target.value = "";
        }}
        className="block w-full text-sm text-ink-muted"
      />
      {uploading ? <p className="text-sm text-accent">Uploading...</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
