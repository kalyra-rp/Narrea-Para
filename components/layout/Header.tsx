import Image from "next/image";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, is_admin")
      .eq("id", user.id)
      .maybeSingle();

    displayName =
      (profile?.display_name as string | null) ?? user.email ?? "Membre";
    isAdmin = Boolean(profile?.is_admin);
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-ink/10 bg-cream/70 shadow-[0_1px_0_rgba(42,36,64,0.04)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center" aria-label="Narrea — accueil">
          <Image
            src="/logo.png"
            alt="Narrea"
            width={1000}
            height={300}
            priority
            sizes="200px"
            style={{ height: 56, width: "auto" }}
          />
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium text-ink/75 sm:gap-6">
          {/* Liens publics : masqués sur mobile (un menu hamburger viendra plus tard).
              Sur < md, on garde uniquement le bouton d'auth pour éviter le débordement
              horizontal qui force le navigateur mobile à dézoomer. */}
          {/* Avec l'ajout de « Mes créations » on passe à 5 liens : on
              attend `lg` pour les afficher tous afin d'éviter les retours
              à la ligne sur tablettes étroites. Un menu hamburger viendra
              plus tard pour combler le trou < lg. */}
          <div className="hidden items-center gap-5 lg:flex">
            <Link href="/" className="transition-colors hover:text-ink">
              Accueil
            </Link>
            <Link href="/a-propos" className="transition-colors hover:text-ink">
              À propos
            </Link>
            <Link
              href="/creations"
              className="transition-colors hover:text-ink"
            >
              Mes créations
            </Link>
            <Link
              href="/participer"
              className="transition-colors hover:text-ink"
            >
              Comment participer
            </Link>
            <Link
              href="/instagram"
              className="transition-colors hover:text-ink"
            >
              Instagram
            </Link>
          </div>

          {user && displayName ? (
            <UserMenu displayName={displayName} isAdmin={isAdmin} />
          ) : (
            <Link href="/connexion" className="btn-primary">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
