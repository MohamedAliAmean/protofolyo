"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateProfile(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("profile")
    .update({
      full_name: String(formData.get("full_name") ?? ""),
      title: String(formData.get("title") ?? ""),
      stack_line: String(formData.get("stack_line") ?? ""),
      location: String(formData.get("location") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      short_pitch: String(formData.get("short_pitch") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      linkedin: String(formData.get("linkedin") ?? ""),
      github: String(formData.get("github") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      profile_image_url: String(formData.get("profile_image_url") ?? ""),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/profile");
}

export async function saveExperience(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const id = formData.get("id") as string | null;
  const points = String(formData.get("points") ?? "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const payload = {
    company: String(formData.get("company") ?? ""),
    role: String(formData.get("role") ?? ""),
    period: String(formData.get("period") ?? ""),
    location: String(formData.get("location") ?? ""),
    stack: String(formData.get("stack") ?? ""),
    points,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  if (id) {
    const { error } = await supabase.from("experience").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("experience").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function saveProject(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const id = formData.get("id") as string | null;
  const href = String(formData.get("href") ?? "").trim();

  const payload = {
    title: String(formData.get("title") ?? ""),
    period: String(formData.get("period") ?? ""),
    stack: String(formData.get("stack") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    description: String(formData.get("description") ?? ""),
    href: href || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function saveSkillGroup(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const id = formData.get("id") as string | null;

  const payload = {
    title: String(formData.get("title") ?? ""),
    items: String(formData.get("items") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  if (id) {
    const { error } = await supabase.from("skill_groups").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("skill_groups").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function deleteSkillGroup(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("skill_groups").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function signOut() {
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function replyToConversation(formData: FormData) {
  await requireAdmin();
  const conversationId = String(formData.get("conversation_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!conversationId || !content) {
    throw new Error("Conversation and message are required");
  }

  const { sendAdminMessage } = await import("@/lib/chat");
  await sendAdminMessage(conversationId, content);
  revalidatePath("/admin/messages");
}
