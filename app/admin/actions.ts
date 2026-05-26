"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function extractDefiFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const serie_id = String(formData.get("serie_id") ?? "").trim();
  const episode_number = Number(formData.get("episode_number") ?? 0);
  const difficulty = Number(formData.get("difficulty") ?? 1);
  const description = String(formData.get("description") ?? "").trim();
  const rules = parseLines(String(formData.get("rules") ?? ""));
  const hashtags = parseLines(String(formData.get("hashtags") ?? ""));
  const signatureRaw = String(formData.get("signature") ?? "").trim();
  const imageUrlRaw = String(formData.get("image_url") ?? "").trim();

  return {
    title,
    slug,
    serie_id,
    episode_number,
    difficulty,
    description,
    rules,
    hashtags,
    signature: signatureRaw.length > 0 ? signatureRaw : null,
    image_url: imageUrlRaw.length > 0 ? imageUrlRaw : null,
  };
}

export async function createDefi(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = extractDefiFields(formData);

  const { error } = await supabase.from("defis").insert(fields);
  if (error) {
    console.error("[createDefi] Erreur Supabase :", error.message);
    throw new Error(`Création impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function updateDefi(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = extractDefiFields(formData);

  const { error } = await supabase.from("defis").update(fields).eq("id", id);
  if (error) {
    console.error("[updateDefi] Erreur Supabase :", error.message);
    throw new Error(`Modification impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteDefi(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("defis").delete().eq("id", id);
  if (error) {
    console.error("[deleteDefi] Erreur Supabase :", error.message);
    throw new Error(`Suppression impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
}

// =====================================================================
// SERIES
// =====================================================================

function extractSerieFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const genre_id = String(formData.get("genre_id") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim();
  const cover_color_1 = String(formData.get("cover_color_1") ?? "").trim();
  const cover_color_2 = String(formData.get("cover_color_2") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  // Une case à cocher absente du FormData = non cochée.
  const featured = formData.get("featured") !== null;

  return {
    title,
    slug,
    genre_id,
    description,
    emoji,
    cover_color_1,
    cover_color_2,
    duration,
    featured,
  };
}

export async function createSerie(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = extractSerieFields(formData);

  const { error } = await supabase.from("series").insert(fields);
  if (error) {
    console.error("[createSerie] Erreur Supabase :", error.message);
    throw new Error(`Création impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function updateSerie(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = extractSerieFields(formData);

  const { error } = await supabase.from("series").update(fields).eq("id", id);
  if (error) {
    console.error("[updateSerie] Erreur Supabase :", error.message);
    throw new Error(`Modification impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

// =====================================================================
// BADGES
// =====================================================================

function extractBadgeFields(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim();
  const condition_type = String(formData.get("condition_type") ?? "").trim();
  const condition_value = Number(formData.get("condition_value") ?? 0);
  const position = Number(formData.get("position") ?? 0);

  return {
    label,
    description,
    emoji,
    condition_type,
    condition_value,
    position,
  };
}

export async function createBadge(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (id.length === 0) {
    throw new Error("L'identifiant du badge est obligatoire.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("badges")
    .insert({ id, ...extractBadgeFields(formData) });

  if (error) {
    console.error("[createBadge] Erreur Supabase :", error.message);
    throw new Error(`Création impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function updateBadge(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("badges")
    .update(extractBadgeFields(formData))
    .eq("id", id);

  if (error) {
    console.error("[updateBadge] Erreur Supabase :", error.message);
    throw new Error(`Modification impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteBadge(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("badges").delete().eq("id", id);
  if (error) {
    console.error("[deleteBadge] Erreur Supabase :", error.message);
    throw new Error(`Suppression impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
}

// =====================================================================
// CREATIONS (drops Steam Workshop)
// =====================================================================

function extractCreationFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrlRaw = String(formData.get("image_url") ?? "").trim();
  const workshop_url = String(formData.get("workshop_url") ?? "").trim();
  const tags = parseLines(String(formData.get("tags") ?? ""));
  const counterLabelRaw = String(formData.get("counter_label") ?? "").trim();
  const featured = formData.get("featured") !== null;
  const position = Number(formData.get("position") ?? 0);

  return {
    title,
    slug,
    category,
    description,
    image_url: imageUrlRaw.length > 0 ? imageUrlRaw : null,
    workshop_url,
    tags,
    counter_label: counterLabelRaw.length > 0 ? counterLabelRaw : null,
    featured,
    position,
  };
}

export async function createCreation(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = extractCreationFields(formData);

  const { error } = await supabase.from("creations").insert(fields);
  if (error) {
    console.error("[createCreation] Erreur Supabase :", error.message);
    throw new Error(`Création impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function updateCreation(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = extractCreationFields(formData);

  const { error } = await supabase
    .from("creations")
    .update(fields)
    .eq("id", id);
  if (error) {
    console.error("[updateCreation] Erreur Supabase :", error.message);
    throw new Error(`Modification impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteCreation(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("creations").delete().eq("id", id);
  if (error) {
    console.error("[deleteCreation] Erreur Supabase :", error.message);
    throw new Error(`Suppression impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
}

// ⚠️ Supprimer une série supprime aussi tous ses défis,
// grâce à la contrainte ON DELETE CASCADE de la FK defis.serie_id.
// Si cette contrainte n'est pas posée côté base, la suppression
// échouera tant qu'il reste des défis liés.
export async function deleteSerie(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("series").delete().eq("id", id);
  if (error) {
    console.error("[deleteSerie] Erreur Supabase :", error.message);
    throw new Error(`Suppression impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
}
