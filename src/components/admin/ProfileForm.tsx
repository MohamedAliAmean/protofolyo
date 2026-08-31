"use client";

import { useState } from "react";
import { updateProfile } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import { ProfileImageUpload } from "@/components/admin/ProfileImageUpload";
import type { ProfileData } from "@/lib/types";

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [imageUrl, setImageUrl] = useState(profile.profileImageUrl);
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        formData.set("profile_image_url", imageUrl);
        await updateProfile(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="space-y-5"
    >
      <ProfileImageUpload currentUrl={imageUrl} onUploaded={setImageUrl} />
      <input type="hidden" name="profile_image_url" value={imageUrl} />

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
