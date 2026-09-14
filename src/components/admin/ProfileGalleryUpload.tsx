"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveProfileMedia } from "@/app/admin/actions";

export function ProfileGalleryUpload({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  async function persist(nextUrls: string[]) {
    setSaving(true);
    setError("");
    setSavedMsg("");
    try {
      await saveProfileMedia({ galleryUrls: nextUrls });
      onChange(nextUrls);
      setSavedMsg("Gallery saved.");
      setTimeout(() => setSavedMsg(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save gallery");
    } finally {
      setSaving(false);
    }
  }

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

      await persist(nextUrls);
    } finally {
      setUploading(false);
    }
  }

  async function removeAt(index: number) {
    await persist(urls.filter((_, i) => i !== index));
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= urls.length) return;
    const next = [...urls];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    await persist(next);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--line)] p-4">
      <div>
        <p className="text-sm font-medium text-navy-deep">Profile gallery</p>
        <p className="mt-1 text-xs text-ink-muted">
          Upload multiple photos. They are saved automatically after upload.
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
                    onClick={() => void move(index, -1)}
                    disabled={index === 0 || saving}
                    className="rounded-md border border-[var(--line)] px-2 py-1 text-xs disabled:opacity-40"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(index, 1)}
                    disabled={index === urls.length - 1 || saving}
                    className="rounded-md border border-[var(--line)] px-2 py-1 text-xs disabled:opacity-40"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => void removeAt(index)}
                    disabled={saving}
                    className="rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-500 disabled:opacity-40"
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
      {uploading || saving ? (
        <p className="text-sm text-accent">
          {uploading ? "Uploading..." : "Saving..."}
        </p>
      ) : null}
      {savedMsg ? <p className="text-sm text-accent">{savedMsg}</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
