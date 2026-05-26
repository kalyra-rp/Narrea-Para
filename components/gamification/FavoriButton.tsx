"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFavori } from "@/app/actions/gamification";

type Props = {
  defiId: string;
  isFavori: boolean;
  isLoggedIn: boolean;
};

export default function FavoriButton({ defiId, isFavori, isLoggedIn }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleClick() {
    if (!isLoggedIn) {
      router.push("/connexion");
      return;
    }
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await toggleFavori(defiId);
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : "Erreur inconnue");
      }
    });
  }

  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60";
  const activeClass =
    "bg-rose-500 text-white hover:brightness-105 hover:shadow-md";
  const inactiveClass =
    "border border-ink/15 bg-white text-ink hover:shadow-md";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={isFavori}
        className={`${baseClass} ${isFavori ? activeClass : inactiveClass}`}
      >
        {pending
          ? "…"
          : isFavori
            ? "✓ Dans ma liste"
            : "🔖 Ajouter à ma liste"}
      </button>
      {errorMsg && (
        <p role="alert" className="text-xs text-red-700">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
