import Link from "next/link";
import DeleteBadgeButton from "@/components/admin/DeleteBadgeButton";
import DeleteDefiButton from "@/components/admin/DeleteDefiButton";
import DeleteSerieButton from "@/components/admin/DeleteSerieButton";
import LogoutButton from "@/components/admin/LogoutButton";
import { requireAdmin } from "@/lib/admin-auth";
import { getBadges } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import type { Badge } from "@/lib/types";

type DefiAdminRow = {
  id: string;
  title: string;
  episode_number: number;
  difficulty: number;
  serie_id: string;
};

type SerieAdminRow = {
  id: string;
  title: string;
  genre_id: string;
  duration: "express" | "moyen" | "saga";
  featured: boolean | null;
  created_at: string;
};

type GenreAdminRow = {
  id: string;
  label: string;
  position: number;
};

const durationLabels: Record<SerieAdminRow["duration"], string> = {
  express: "Express",
  moyen: "Moyen",
  saga: "Saga",
};

const badgeConditionLabels: Record<Badge["conditionType"], string> = {
  completions_count: "Défis terminés",
  genre_explorer: "Genres explorés",
  serie_complete: "Séries complètes",
};

const TH_CLASS =
  "px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink/55";
const TD_CLASS = "px-5 py-3.5 text-sm text-ink/80";
const ROW_CLASS = "transition-colors even:bg-ink/[0.018]";
const MODIFIER_BTN_CLASS =
  "inline-flex items-center justify-center rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm transition hover:shadow-md";

function pluralize(n: number, singular: string, plural: string): string {
  return `${n} ${n > 1 ? plural : singular}`;
}

export default async function AdminPage() {
  const user = await requireAdmin();

  const supabase = await createClient();

  const [defisResult, seriesResult, genresResult, badges, profileResult] =
    await Promise.all([
      supabase
        .from("defis")
        .select("id, title, episode_number, difficulty, serie_id")
        .order("episode_number", { ascending: true }),
      supabase
        .from("series")
        .select("id, title, genre_id, duration, featured, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("genres").select("id, label, position").order("position"),
      getBadges(),
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

  const queryError =
    defisResult.error ?? seriesResult.error ?? genresResult.error;

  const defisRaw = (defisResult.data ?? []) as DefiAdminRow[];
  const seriesRaw = (seriesResult.data ?? []) as SerieAdminRow[];
  const genresRaw = (genresResult.data ?? []) as GenreAdminRow[];

  const adminDisplayName =
    (profileResult.data?.display_name as string | undefined) ?? user.email;

  const seriesById = new Map<string, string>(
    seriesRaw.map((s) => [s.id, s.title]),
  );
  const genreLabelById = new Map<string, string>(
    genresRaw.map((g) => [g.id, g.label]),
  );

  const defiCountsBySerie: Record<string, number> = {};
  for (const d of defisRaw) {
    defiCountsBySerie[d.serie_id] = (defiCountsBySerie[d.serie_id] ?? 0) + 1;
  }

  const serieRows = seriesRaw.map((s) => ({
    id: s.id,
    title: s.title,
    genreLabel: genreLabelById.get(s.genre_id) ?? "—",
    duration: s.duration,
    featured: Boolean(s.featured),
    defiCount: defiCountsBySerie[s.id] ?? 0,
  }));

  const defiRows = defisRaw.map((d) => ({
    id: d.id,
    title: d.title,
    serieTitle: seriesById.get(d.serie_id) ?? "—",
    episodeNumber: d.episode_number,
    difficulty: d.difficulty,
  }));

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {/* En-tête */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-ink/60">
              Connectée en tant que{" "}
              <span className="font-semibold text-ink/80">
                {adminDisplayName}
              </span>
            </p>
          </div>
          <LogoutButton />
        </header>

        {queryError && (
          <p
            role="alert"
            className="mt-8 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            Erreur lors du chargement : {queryError.message}
          </p>
        )}

        {/* SECTION — Séries */}
        <section className="mt-10 surface-card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-ink/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Séries
              </h2>
              <p className="mt-0.5 text-xs text-ink/55">
                {pluralize(serieRows.length, "série", "séries")}
              </p>
            </div>
            <Link href="/admin/series/nouveau" className="btn-primary">
              + Nouvelle série
            </Link>
          </div>

          {serieRows.length === 0 ? (
            <p className="p-6 text-sm text-ink/55">
              Aucune série pour l&apos;instant.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-ink/[0.025]">
                  <tr>
                    <th className={TH_CLASS}>Titre</th>
                    <th className={TH_CLASS}>Genre</th>
                    <th className={TH_CLASS}>Durée</th>
                    <th className={TH_CLASS}>À l&apos;honneur</th>
                    <th className={TH_CLASS}>Défis</th>
                    <th className={`${TH_CLASS} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {serieRows.map((row) => (
                    <tr key={row.id} className={ROW_CLASS}>
                      <td className={`${TD_CLASS} font-semibold text-ink`}>
                        {row.title}
                      </td>
                      <td className={TD_CLASS}>{row.genreLabel}</td>
                      <td className={TD_CLASS}>
                        {durationLabels[row.duration]}
                      </td>
                      <td className={TD_CLASS}>
                        {row.featured ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                            Oui
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink/40">
                            Non
                          </span>
                        )}
                      </td>
                      <td className={TD_CLASS}>{row.defiCount}</td>
                      <td className={TD_CLASS}>
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/series/${row.id}`}
                            className={MODIFIER_BTN_CLASS}
                          >
                            Modifier
                          </Link>
                          <DeleteSerieButton
                            id={row.id}
                            title={row.title}
                            defiCount={row.defiCount}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECTION — Défis */}
        <section className="mt-8 surface-card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-ink/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Défis
              </h2>
              <p className="mt-0.5 text-xs text-ink/55">
                {pluralize(defiRows.length, "défi", "défis")}
              </p>
            </div>
            <Link href="/admin/defis/nouveau" className="btn-primary">
              + Nouveau défi
            </Link>
          </div>

          {defiRows.length === 0 ? (
            <p className="p-6 text-sm text-ink/55">
              Aucun défi pour l&apos;instant.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-ink/[0.025]">
                  <tr>
                    <th className={TH_CLASS}>Titre</th>
                    <th className={TH_CLASS}>Série</th>
                    <th className={TH_CLASS}>Épisode</th>
                    <th className={TH_CLASS}>Difficulté</th>
                    <th className={`${TH_CLASS} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {defiRows.map((row) => (
                    <tr key={row.id} className={ROW_CLASS}>
                      <td className={`${TD_CLASS} font-semibold text-ink`}>
                        {row.title}
                      </td>
                      <td className={TD_CLASS}>{row.serieTitle}</td>
                      <td className={TD_CLASS}>{row.episodeNumber}</td>
                      <td
                        className={`${TD_CLASS} text-amber-500`}
                        aria-label={`Difficulté ${row.difficulty} sur 5`}
                      >
                        {"⭐".repeat(row.difficulty)}
                      </td>
                      <td className={TD_CLASS}>
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/defis/${row.id}`}
                            className={MODIFIER_BTN_CLASS}
                          >
                            Modifier
                          </Link>
                          <DeleteDefiButton id={row.id} title={row.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECTION — Badges */}
        <section className="mt-8 surface-card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-ink/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Badges
              </h2>
              <p className="mt-0.5 text-xs text-ink/55">
                {pluralize(badges.length, "badge", "badges")}
              </p>
            </div>
            <Link href="/admin/badges/nouveau" className="btn-primary">
              + Nouveau badge
            </Link>
          </div>

          {badges.length === 0 ? (
            <p className="p-6 text-sm text-ink/55">
              Aucun badge pour l&apos;instant.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-ink/[0.025]">
                  <tr>
                    <th className={TH_CLASS}>Badge</th>
                    <th className={TH_CLASS}>Condition</th>
                    <th className={TH_CLASS}>Valeur</th>
                    <th className={TH_CLASS}>Position</th>
                    <th className={`${TH_CLASS} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {badges.map((badge) => (
                    <tr key={badge.id} className={ROW_CLASS}>
                      <td className={TD_CLASS}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl" aria-hidden="true">
                            {badge.emoji}
                          </span>
                          <div>
                            <p className="font-semibold text-ink">
                              {badge.label}
                            </p>
                            <p className="text-[11px] text-ink/45">
                              {badge.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={TD_CLASS}>
                        {badgeConditionLabels[badge.conditionType]}
                      </td>
                      <td className={TD_CLASS}>{badge.conditionValue}</td>
                      <td className={TD_CLASS}>{badge.position}</td>
                      <td className={TD_CLASS}>
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/badges/${badge.id}`}
                            className={MODIFIER_BTN_CLASS}
                          >
                            Modifier
                          </Link>
                          <DeleteBadgeButton
                            id={badge.id}
                            label={badge.label}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
