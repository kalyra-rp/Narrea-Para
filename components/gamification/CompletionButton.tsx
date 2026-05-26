"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleCompletion } from "@/app/actions/gamification";

type Props = {
  defiId: string;
  isCompleted: boolean;
  isLoggedIn: boolean;
};

export default function CompletionButton({
  defiId,
  isCompleted,
  isLoggedIn,
}: Props) {
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
        await toggleCompletion(defiId);
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : "Erreur inconnue");
      }
    });
  }

  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60";
  const activeClass =
    "bg-emerald-600 text-white hover:brightness-105 hover:shadow-md";
  const inactiveClass =
    "border border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={isCompleted}
        className={`${baseClass} ${isCompleted ? activeClass : inactiveClass}`}
      >
        {pending
          ? "…"
          : isCompleted
            ? "✓ Terminé !"
            : "Marquer comme terminé"}
      </button>
      {errorMsg && (
        <p role="alert" className="text-xs text-red-700">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
