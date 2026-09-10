"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CvUpload({
  currentUrl,
  onUploaded,
}: {
  currentUrl: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(file: File) {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setUploading(true);
    setError("");
    const supabase = createClient();
    const path = `cv/mohamed-diab-cv.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(path, file, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    // Cache-bust so browsers pick up the newly uploaded PDF
    onUploaded(`${data.publicUrl}?v=${Date.now()}`);
    setUploading(false);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--line)] p-4">
      <div>
        <p className="text-sm font-medium text-navy-deep">CV / Resume (PDF)</p>
        <p className="mt-1 text-xs text-ink-muted">
          Upload a PDF. Visitors can download it from the homepage.
        </p>
      </div>

      {currentUrl ? (
        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm font-medium text-accent hover:underline"
        >
          View current CV
        </a>
      ) : (
        <p className="text-sm text-ink-muted">No CV uploaded yet.</p>
      )}

      <input
        type="file"
        accept="application/pdf,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="block w-full text-sm text-ink-muted"
      />
      {uploading ? <p className="text-sm text-accent">Uploading...</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
