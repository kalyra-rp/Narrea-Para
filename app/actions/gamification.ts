"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getUserIdOrRedirect(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/connexion");
  }
  return user.id;
}

export async function toggleFavori(defiId: string): Promise<void> {
  const userId = await getUserIdOrRedirect();
  const supabase = await createClient();

  const { data: existing, error: lookupError } = await supabase
    .from("favoris")
    .select("defi_id")
    .eq("user_id", userId)
    .eq("defi_id", defiId)
    .maybeSingle();

  if (lookupError) {
    console.error("[toggleFavori] lookup :", lookupError.message);
    throw new Error(`Action impossible : ${lookupError.message}`);
  }

  if (existing) {
    const { error } = await supabase
      .from("favoris")
      .delete()
      .eq("user_id", userId)
      .eq("defi_id", defiId);
    if (error) {
      console.error("[toggleFavori] delete :", error.message);
      throw new Error(`Retrait du favori impossible : ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from("favoris")
      .insert({ user_id: userId, defi_id: defiId });
    if (error) {
      console.error("[toggleFavori] insert :", error.message);
      throw new Error(`Ajout aux favoris impossible : ${error.message}`);
    }
  }

  // Le layout couvre la page du défi, /ma-liste, l'accueil, etc.
  revalidatePath("/", "layout");
}

export async function toggleCompletion(defiId: string): Promise<void> {
  const userId = await getUserIdOrRedirect();
  const supabase = await createClient();

  const { data: existing, error: lookupError } = await supabase
    .from("completions")
    .select("defi_id")
    .eq("user_id", userId)
    .eq("defi_id", defiId)
    .maybeSingle();

  if (lookupError) {
    console.error("[toggleCompletion] lookup :", lookupError.message);
    throw new Error(`Action impossible : ${lookupError.message}`);
  }

  if (existing) {
    const { error } = await supabase
      .from("completions")
      .delete()
      .eq("user_id", userId)
      .eq("defi_id", defiId);
    if (error) {
      console.error("[toggleCompletion] delete :", error.message);
      throw new Error(`Retrait impossible : ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from("completions")
      .insert({ user_id: userId, defi_id: defiId });
    if (error) {
      console.error("[toggleCompletion] insert :", error.message);
      throw new Error(`Marquage impossible : ${error.message}`);
    }
  }

  revalidatePath("/", "layout");
}
