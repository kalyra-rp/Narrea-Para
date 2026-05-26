import Link from "next/link";
import { createBadge } from "@/app/admin/actions";
import BadgeForm from "@/components/admin/BadgeForm";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NouveauBadgePage() {
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
          Nouveau badge
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Définis une récompense que les membres pourront débloquer.
        </p>

        <div className="mt-6 surface-card p-6 sm:p-8">
          <BadgeForm action={createBadge} submitLabel="Créer le badge" />
        </div>
      </div>
    </main>
  );
}
