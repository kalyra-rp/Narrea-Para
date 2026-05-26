import Link from "next/link";
import { createDefi } from "@/app/admin/actions";
import DefiForm from "@/components/admin/DefiForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getSeries } from "@/lib/queries";

export default async function NouveauDefiPage() {
  await requireAdmin();
  const series = await getSeries();

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
          Nouveau défi
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Crée un nouvel épisode rattaché à une série existante.
        </p>

        <div className="mt-6 surface-card p-6 sm:p-8">
          {series.length === 0 ? (
            <p className="text-sm text-ink/60">
              Aucune série n&apos;existe encore. Crée d&apos;abord une série
              avant de pouvoir y rattacher un défi.
            </p>
          ) : (
            <DefiForm
              series={series}
              action={createDefi}
              submitLabel="Créer le défi"
            />
          )}
        </div>
      </div>
    </main>
  );
}
