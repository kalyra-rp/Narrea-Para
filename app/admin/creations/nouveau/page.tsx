import Link from "next/link";
import { createCreation } from "@/app/admin/actions";
import CreationForm from "@/components/admin/CreationForm";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NouvelleCreationPage() {
  await requireAdmin();

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm font-medium text-ink/60 transition hover:text-ink"
        >
          ← Retour au tableau de bord
        </Link>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Nouvelle création
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Publie un nouveau drop Steam Workshop dans une des 3 catégories.
        </p>

        <div className="mt-6 surface-card p-6 sm:p-8">
          <CreationForm
            action={createCreation}
            submitLabel="Créer la création"
          />
        </div>
      </div>
    </main>
  );
}
