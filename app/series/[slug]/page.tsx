import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefisBySerie, getGenres, getSerieBySlug } from "@/lib/queries";
import type { Serie } from "@/lib/types";

const durationLabels: Record<Serie["duration"], string> = {
  express: "Express",
  moyen: "Moyen",
  saga: "Saga",
};

export default async function SeriePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const serie = await getSerieBySlug(slug);
  if (!serie) {
    notFound();
  }

  const [genres, episodes] = await Promise.all([
    getGenres(),
    getDefisBySerie(serie.id),
  ]);
  const genre = genres.find((g) => g.id === serie.genreId);

  const [c1, c2] = serie.coverColors;
  const lastEpisodeImage =
    episodes.length > 0 ? episodes[episodes.length - 1].imageUrl : null;

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-6 pt-8 pb-16 sm:pt-10 sm:pb-20">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-ink/60 transition hover:text-ink"
        >
          ← Accueil
        </Link>

        {/* Bannière de série */}
        <section
          className="mt-6 animate-rise-in surface-card overflow-hidden p-5 sm:p-6 md:p-8"
          style={{ boxShadow: "0 20px 50px -25px rgba(255, 106, 136, 0.20)" }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            {/* Visuel : image du dernier défi OU dégradé+emoji */}
            <div className="mx-auto w-full max-w-xs md:mx-0 md:w-64 md:shrink-0">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-md">
                {lastEpisodeImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lastEpisodeImage}
                    alt={serie.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(150deg, ${c1}, ${c2})`,
                    }}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center text-7xl drop-shadow-md sm:text-8xl"
                    >
                      {serie.emoji}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Infos */}
            <div className="flex-1 text-center md:text-left">
              {genre && (
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: `${genre.accent}1f`,
                    color: genre.accent,
                  }}
                >
                  {genre.label}
                </span>
              )}

              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
                {serie.title}
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-ink/75 sm:text-base">
                {serie.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-ink/70 md:justify-start">
                <span className="inline-flex items-center rounded-full bg-ink/5 px-2.5 py-1">
                  {durationLabels[serie.duration]}
                </span>
                <span className="inline-flex items-center rounded-full bg-ink/5 px-2.5 py-1">
                  ▶ {episodes.length} défi{episodes.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Liste des épisodes */}
        <section className="mt-12">
          <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            <span
              aria-hidden="true"
              className="inline-block h-7 w-1.5 rounded-full sm:h-8"
              style={{ backgroundColor: genre?.accent ?? "#A78BFA" }}
            />
            <span>Les défis</span>
          </h2>

          {episodes.length === 0 ? (
            <p className="mt-5 surface-card p-8 text-center text-sm text-ink/60">
              Les défis arrivent bientôt ! 🎬
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-3">
              {episodes.map((defi, idx) => (
                <li
                  key={defi.id}
                  className="animate-rise-in"
                  style={{ animationDelay: `${Math.min(idx, 6) * 80}ms` }}
                >
                  <Link
                    href={`/series/${serie.slug}/${defi.slug}`}
                    className="surface-card group flex items-center gap-4 p-4 transition [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-md sm:gap-5 sm:p-5"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
                      {defi.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={defi.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-100 to-violet-100 font-display text-2xl font-bold text-ink/80">
                          {defi.episodeNumber}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-ink/50">
                        Épisode {defi.episodeNumber}
                      </p>
                      <h3 className="mt-0.5 font-display text-base font-bold leading-tight text-ink sm:text-lg">
                        {defi.title}
                      </h3>
                      <p
                        className="mt-0.5 text-xs text-amber-500 sm:text-sm"
                        aria-label={`Difficulté ${defi.difficulty} sur 5`}
                      >
                        {"⭐".repeat(defi.difficulty)}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-sm text-ink/70">
                        {defi.description}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="hidden text-2xl font-light text-ink/30 transition-transform [@media(hover:hover)]:group-hover:translate-x-1 sm:block"
                    >
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
