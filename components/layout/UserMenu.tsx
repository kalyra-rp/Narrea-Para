"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  displayName: string;
  isAdmin: boolean;
};

export default function UserMenu({ displayName, isAdmin }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  // Fermeture du menu : clic extérieur + touche Échap.
  // Les listeners ne sont attachés que pendant que le menu est ouvert.
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-primary gap-2 py-1 pl-1 pr-3"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-xs font-bold text-white"
        >
          {initial}
        </span>
        <span className="hidden max-w-[10rem] truncate sm:inline">
          {displayName}
        </span>
        <span aria-hidden="true" className="text-white/80">
          ⌄
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Menu membre"
          className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-lg"
        >
          <MenuLink href="/ma-liste" emoji="🔖" label="Ma liste" />
          <MenuLink href="/profil" emoji="👤" label="Mon profil" />
          <MenuLink
            href="/profil/parametres"
            emoji="⚙️"
            label="Paramètres"
          />
          {isAdmin && (
            <MenuLink href="/admin" emoji="🛠️" label="Admin" />
          )}

          <div className="my-2 border-t border-ink/10" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "Déconnexion…" : "Se déconnecter"}
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  emoji,
  label,
}: {
  href: string;
  emoji: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/[0.04] hover:text-ink"
    >
      <span aria-hidden="true">{emoji}</span>
      <span>{label}</span>
    </Link>
  );
}
