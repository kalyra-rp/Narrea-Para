import Link from "next/link";
import { updateProfile } from "@/app/profil/actions";
import { requireUser } from "@/lib/admin-auth";

const INPUT_CLASS =
  "rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink shadow-sm transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200";
const LABEL_CLASS = "flex flex-col gap-1.5 text-sm";
const LABEL_TEXT_CLASS = "font-semibold text-ink/80";

export default async function ParametresPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { profile } = await requireUser();
  const { saved } = await searchParams;

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/profil"
          className="inline-flex items-center text-sm font-medium text-ink/60 transition hover:text-ink"
        >
          ← Retour au profil
        </Link>

        <h1 className="mt-4 animate-rise-in font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          ⚙️ Paramètres
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Modifie ton pseudo et ton compte Instagram.
        </p>

        {saved === "1" && (
          <p
            role="status"
            className="mt-6 animate-rise-in rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
          >
            ✓ Tes informations ont été enregistrées.
          </p>
        )}

        <section
          className="mt-6 animate-rise-in surface-card p-6 sm:p-7"
          style={{ animationDelay: "120ms" }}
        >
          <h2 className="font-display text-lg font-bold text-ink">
            Mes informations
          </h2>
          <form action={updateProfile} className="mt-5 flex flex-col gap-5">
            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Pseudo</span>
              <input
                name="display_name"
                type="text"
                required
                defaultValue={profile?.display_name ?? ""}
                className={INPUT_CLASS}
              />
            </label>

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>
                @Instagram{" "}
                <span className="text-xs font-normal text-ink/50">
                  (optionnel — le « @ » est ajouté automatiquement)
                </span>
              </span>
              <input
                name="instagram_handle"
                type="text"
                defaultValue={profile?.instagram_handle ?? ""}
                placeholder="@ton.compte"
                className={INPUT_CLASS}
              />
            </label>

            <div className="mt-2">
              <button type="submit" className="btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
        </section>

        <p
          className="mt-10 animate-rise-in text-xs text-ink/50"
          style={{ animationDelay: "240ms" }}
        >
          🛠️ Plus d&apos;options arriveront bientôt — préférences,
          notifications, suppression du compte…
        </p>
      </div>
    </main>
  );
}
