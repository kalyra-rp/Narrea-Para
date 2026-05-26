import Link from "next/link";
import { notFound } from "next/navigation";
import CompletionButton from "@/components/gamification/CompletionButton";
import FavoriButton from "@/components/gamification/FavoriButton";
import {
  getDefiBySlug,
  getSerieBySlug,
  getUserCompletionIds,
  getUserFavoriIds,
} from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";

export default async function DefiPage({
  params,
}: {
  params: Promise<{ slug: string; defi: string }>;
}) {
  const { slug, defi: defiSlug } = await params;

  const [serie, defi] = await Promise.all([
    getSerieBySlug(slug),
    getDefiBySlug(slug, defiSlug),
  ]);
  if (!serie || !defi) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  let isFavori = false;
  let isCompleted = false;
  if (isLoggedIn) {
    const [favoriIds, completionIds] = await Promise.all([
      getUserFavoriIds(),
      getUserCompletionIds(),
    ]);
    isFavori = favoriIds.includes(defi.id);
    isCompleted = completionIds.includes(defi.id);
  }

  const [c1, c2] = serie.coverColors;

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10 sm:pb-20">
        <Link
          href={`/series/${serie.slug}`}
          className="inline-flex items-center text-sm font-medium text-ink/60 transition hover:text-ink"
        >
          ← {serie.title}
        </Link>

        {/* Image en grand — focal point sur mobile */}
        <div
          className="mt-5 animate-rise-in aspect-square w-full overflow-hidden rounded-3xl shadow-lg"
          style={{ boxShadow: "0 25px 60px -25px rgba(255, 106, 136, 0.35)" }}
        >
          {defi.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={defi.imageUrl}
              alt={defi.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="relative h-full w-full"
              style={{ background: `linear-gradient(150deg, ${c1}, ${c2})` }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center text-8xl drop-shadow-md"
              >
                {serie.emoji}
              </span>
            </div>
          )}
        </div>

        {/* En-tête */}
        <header
          className="mt-7 animate-rise-in"
          style={{ animationDelay: "120ms" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-100 to-violet-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
            Épisode {defi.episodeNumber}{" "}
            <span className="font-medium normal-case tracking-normal text-ink/60">
              · {serie.title}
            </span>
          </span>

          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            {defi.title}
          </h1>

          <p
            className="mt-2 text-lg text-amber-500"
            aria-label={`Difficulté ${defi.difficulty} sur 5`}
          >
            {"⭐".repeat(defi.difficulty)}
          </p>

          <p className="mt-5 text-base leading-relaxed text-ink/80 sm:text-lg">
            {defi.description}
          </p>
        </header>

        {/* Actions — Instagram (CTA primaire) + favori + terminé */}
        <div
          className="mt-7 flex flex-col gap-3 animate-rise-in sm:flex-row sm:flex-wrap sm:items-center"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center sm:w-auto"
          >
            📸 Participer sur Instagram
          </a>
          <FavoriButton
            defiId={defi.id}
            isFavori={isFavori}
            isLoggedIn={isLoggedIn}
          />
          <CompletionButton
            defiId={defi.id}
            isCompleted={isCompleted}
            isLoggedIn={isLoggedIn}
          />
        </div>

        {/* Règles */}
        <section
          className="mt-10 animate-rise-in"
          style={{ animationDelay: "360ms" }}
        >
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            🎯 Règles du défi
          </h2>
          {defi.rules.length > 0 ? (
            <ul className="mt-4 surface-card divide-y divide-ink/5 overflow-hidden">
              {defi.rules.map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-4 sm:gap-4 sm:p-5"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-violet-200 text-xs font-bold text-ink/80"
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-ink/80 sm:text-base">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 surface-card p-5 text-sm text-ink/60">
              Pas de règles spécifiques pour ce défi — laisse libre cours à ta
              créativité ! ✨
            </p>
          )}
        </section>

        {/* Hashtags */}
        {defi.hashtags.length > 0 && (
          <section
            className="mt-8 animate-rise-in"
            style={{ animationDelay: "420ms" }}
          >
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink/60">
              Hashtags
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {defi.hashtags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full border border-ink/10 bg-gradient-to-r from-rose-50 to-violet-50 px-3 py-1.5 text-xs font-semibold text-ink/75"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Signature de Kalyra */}
        {defi.signature && (
          <aside
            className="mt-10 animate-rise-in rounded-3xl border border-rose-100/60 bg-gradient-to-br from-rose-50/80 to-violet-50/80 p-6 shadow-sm sm:p-7"
            style={{ animationDelay: "480ms" }}
          >
            <p className="text-sm italic leading-relaxed text-ink/80 sm:text-base">
              {defi.signature}
            </p>
            <p className="mt-4 text-right text-sm font-semibold text-ink/70">
              💛 {siteConfig.creator}
            </p>
          </aside>
        )}
      </div>
    </main>
  );
}
