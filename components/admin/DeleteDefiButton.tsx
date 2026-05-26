"use client";

import { useState, useTransition } from "react";
import { deleteDefi } from "@/app/admin/actions";

type Props = {
  id: string;
  title: string;
};

export default function DeleteDefiButton({ id, title }: Props) {
  const [pending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleClick() {
    if (
      !window.confirm(
        `Es-tu sûre de vouloir supprimer « ${title} » ?\nCette action est définitive.`,
      )
    ) {
      return;
    }
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await deleteDefi(id);
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : "Erreur inconnue");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Suppression…" : "Supprimer"}
      </button>
      {errorMsg && (
        <p className="mt-1 text-xs text-red-700" role="alert">
          {errorMsg}
        </p>
      )}
    </>
  );
}
