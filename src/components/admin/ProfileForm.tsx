"use client";

import { useState } from "react";
import { updateProfile } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import { CvUpload } from "@/components/admin/CvUpload";
import { ProfileGalleryUpload } from "@/components/admin/ProfileGalleryUpload";
import type { ProfileData } from "@/lib/types";

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [galleryUrls, setGalleryUrls] = useState(
    profile.galleryUrls.length > 0
      ? profile.galleryUrls
      : profile.profileImageUrl
        ? [profile.profileImageUrl]
        : [],
  );
  const [cvUrl, setCvUrl] = useState(profile.cvUrl);
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        formData.set("profile_image_url", galleryUrls[0] ?? "");
        formData.set("gallery_urls", JSON.stringify(galleryUrls));
        formData.set("cv_url", cvUrl);
        await updateProfile(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="space-y-5"
    >
      <ProfileGalleryUpload urls={galleryUrls} onChange={setGalleryUrls} />
      <input type="hidden" name="profile_image_url" value={galleryUrls[0] ?? ""} />
      <input type="hidden" name="gallery_urls" value={JSON.stringify(galleryUrls)} />

      <CvUpload currentUrl={cvUrl} onUploaded={setCvUrl} />
      <input type="hidden" name="cv_url" value={cvUrl} />

      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Full name" name="full_name" defaultValue={profile.fullName} />
        <AdminField label="Title" name="title" defaultValue={profile.title} />
        <AdminField label="Stack line" name="stack_line" defaultValue={profile.stackLine} />
        <AdminField label="Location" name="location" defaultValue={profile.location} />
        <AdminField label="Email" name="email" type="email" defaultValue={profile.email} />
        <AdminField label="Phone" name="phone" defaultValue={profile.phone} />
        <AdminField label="WhatsApp URL" name="whatsapp" defaultValue={profile.whatsapp} />
        <AdminField label="LinkedIn" name="linkedin" defaultValue={profile.linkedin} />
        <AdminField label="GitHub" name="github" defaultValue={profile.github} />
      </div>

      <AdminField label="Short pitch" name="short_pitch" defaultValue={profile.shortPitch} rows={3} />
      <AdminField label="About summary" name="summary" defaultValue={profile.summary} rows={6} />

      <button
        type="submit"
        className="rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-btn-fg"
      >
        Save changes
      </button>
      {saved ? <p className="text-sm text-accent">Saved successfully.</p> : null}
    </form>
  );
}
