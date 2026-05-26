import Link from "next/link";
import FavoriButton from "@/components/gamification/FavoriButton";
import type { Serie } from "@/lib/types";

const durationLabels: Record<Serie["duration"], string> = {
  express: "Express",
  moyen: "Moyen",
  saga: "Saga",
};

type Props = {
  serie: Serie;
  genreLabel: string | null;
  imageUrl: string | null;
  episodesCount: number;
  latestDefiId: string | null;
  isFavori: boolean;
  isLoggedIn: boolean;
};

export default function FeaturedHero({
  serie,
  genreLabel,
  imageUrl,
  episodesCount,
  latestDefiId,
  isFavori,
  isLoggedIn,
}: Props) {
  const [c1, c2] = serie.coverColors;
  const hasImage = Boolean(imageUrl);

  return (
    <section className="w-full">
      <div
        className="mx-auto max-w-6xl px-6 pb-12 animate-rise-in"
        style={{ animationDelay: "480ms" }}
      >
        <div
          className="grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-ink/10 bg-white/80 p-6 backdrop-blur-sm sm:p-8 md:grid-cols-[1fr_1fr] md:gap-10"
          style={{ boxShadow: "0 20px 50px -20px rgba(255, 106, 136, 0.25)" }}
        >
          {/* Visuel — au-dessus en mobile, à droite en desktop */}
          <div className="order-1 md:order-2">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-md"
              style={
                hasImage
                  ? undefined
                  : { background: `linear-gradient(150deg, ${c1}, ${c2})` }
              }
            >
              {hasImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl ?? ""}
                  alt={serie.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Texte */}
          <div className="order-2 flex flex-col justify-center md:order-1">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-100 to-violet-100 px-3 py-1 text-xs font-bold text-ink">
              <span>★ Série à la une</span>
              {genreLabel && (
                <span className="text-ink/60">· {genreLabel}</span>
              )}
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {serie.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-ink/70 sm:text-base">
              {serie.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink/70">
              <span className="inline-flex items-center rounded-full bg-ink/5 px-2.5 py-1">
                {durationLabels[serie.duration]}
              </span>
              <span className="inline-flex items-center rounded-full bg-ink/5 px-2.5 py-1">
                ▶ {episodesCount} défi{episodesCount > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href={`/series/${serie.slug}`} className="btn-primary">
                ▶ Découvrir la série
              </Link>
              {latestDefiId && (
                <FavoriButton
                  defiId={latestDefiId}
                  isFavori={isFavori}
                  isLoggedIn={isLoggedIn}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
