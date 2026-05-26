import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Profile = {
  display_name: string | null;
  instagram_handle: string | null;
  is_admin: boolean | null;
};

// À appeler en haut d'une page membre (Server Component) qu'on veut
// réserver aux utilisateurs connectés (admin ou non).
// Renvoie vers /connexion si personne n'est connecté.
export async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name, instagram_handle, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[requireUser] Erreur Supabase :", error.message);
  }

  return { user, profile: (profile ?? null) as Profile | null };
}

// À appeler tout en haut de chaque page admin (Server Component).
// Garantit qu'on a un utilisateur connecté ET admin avant de rendre
// quoi que ce soit. Lève via `redirect()` sinon — donc le code qui suit
// l'appel n'est exécuté que si l'utilisateur est bien admin.
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[requireAdmin] Erreur Supabase :", error.message);
    redirect("/");
  }
  if (!profile?.is_admin) {
    redirect("/");
  }

  return user;
}
