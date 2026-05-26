import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCreation } from "@/app/admin/actions";
import CreationForm from "@/components/admin/CreationForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getCreationById } from "@/lib/queries";

export default async function EditCreationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const creation = await getCreationById(id);
  if (!creation) {
    notFound();
  }

  const boundUpdate = updateCreation.bind(null, creation.id);

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
          Modifier la création
        </h1>
        <p className="mt-1 text-sm text-ink/60">{creation.title}</p>

        <div className="mt-6 surface-card p-6 sm:p-8">
          <CreationForm
            creation={creation}
            action={boundUpdate}
            submitLabel="Enregistrer les modifications"
          />
        </div>
      </div>
    </main>
  );
}
