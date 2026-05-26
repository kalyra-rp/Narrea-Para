"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

function normalizeInstagramHandle(value: string): string {
  const trimmed = value.trim().replace(/^@+/, "");
  return trimmed.length > 0 ? `@${trimmed}` : "";
}

export async function updateProfile(formData: FormData): Promise<void> {
  const { user } = await requireUser();

  const display_name = String(formData.get("display_name") ?? "").trim();
  const instagram_handle = normalizeInstagramHandle(
    String(formData.get("instagram_handle") ?? ""),
  );

  if (display_name.length === 0) {
    throw new Error("Le pseudo est obligatoire.");
  }

  const supabase = await createClient();
  // La RLS « chacun modifie son propre profil » s'applique côté base :
  // sans l'égalité id = auth.uid(), l'update est rejetée par Postgres.
  const { error } = await supabase
    .from("profiles")
    .update({ display_name, instagram_handle })
    .eq("id", user.id);

  if (error) {
    console.error("[updateProfile] Erreur Supabase :", error.message);
    throw new Error(`Mise à jour impossible : ${error.message}`);
  }

  revalidatePath("/", "layout");
  // Renvoie sur la même page avec un flag pour afficher un message
  // de confirmation côté UI.
  redirect("/profil/parametres?saved=1");
}
