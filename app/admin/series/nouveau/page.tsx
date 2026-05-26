import Link from "next/link";
import { createSerie } from "@/app/admin/actions";
import SerieForm from "@/components/admin/SerieForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getGenres } from "@/lib/queries";

export default async function NouvelleSeriePage() {
  await requireAdmin();
  const genres = await getGenres();

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
          Nouvelle série
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Crée une nouvelle série rattachée à un genre existant.
        </p>

        <div className="mt-6 surface-card p-6 sm:p-8">
          {genres.length === 0 ? (
            <p className="text-sm text-ink/60">
              Aucun genre n&apos;existe encore. Crée d&apos;abord un genre dans
              Supabase avant de pouvoir y rattacher une série.
            </p>
          ) : (
            <SerieForm
              genres={genres}
              action={createSerie}
              submitLabel="Créer la série"
            />
          )}
        </div>
      </div>
    </main>
  );
}
