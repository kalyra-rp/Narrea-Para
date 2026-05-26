import type { Genre, Serie } from "@/lib/types";
import SerieCarousel from "./SerieCarousel";
import SeriePoster from "./SeriePoster";

type Props = {
  genre: Genre;
  series: Serie[];
  episodeCounts: Record<string, number>;
  latestImages: Record<string, string>;
};

// Au-dessous de ce seuil, on n'utilise plus le carrousel (flèches +
// overflow desktop). On bascule sur une simple ligne flex statique
// qui laisse les vignettes posées à gauche sans chrome de scroll
// — moins "perdu" que le carrousel à moitié vide.
const CAROUSEL_THRESHOLD = 4;

export default function SerieRow({
  genre,
  series,
  episodeCounts,
  latestImages,
}: Props) {
  const useCarousel = series.length >= CAROUSEL_THRESHOLD;
  const posters = series.map((serie, index) => (
    <SeriePoster
      key={serie.id}
      serie={serie}
      episodesCount={episodeCounts[serie.id] ?? 0}
      imageUrl={latestImages[serie.id] ?? null}
      index={index}
    />
  ));

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          <span
            aria-hidden="true"
            className="inline-block h-7 w-1.5 rounded-full sm:h-8"
            style={{ backgroundColor: genre.accent }}
          />
          <span>{genre.label}</span>
        </h2>
      </div>

      {series.length === 0 ? (
        <div className="mx-auto mt-5 max-w-6xl px-6">
          <p className="surface-card p-5 text-sm text-ink/60">
            Bientôt de nouvelles séries dans ce genre !
          </p>
        </div>
      ) : useCarousel ? (
        <div className="mt-5">
          <SerieCarousel>{posters}</SerieCarousel>
        </div>
      ) : (
        // Peu d'items : sur mobile on garde un scroll tactile fluide
        // (au cas où 3 vignettes n'entrent pas dans 375px), sur desktop
        // on bascule en flex statique posé à gauche, sans flèches.
        <div className="mt-5 flex snap-x snap-proximity gap-4 overflow-x-auto scroll-pl-6 px-6 pb-4 scrollbar-hide md:snap-none md:overflow-visible md:pb-1">
          {posters}
        </div>
      )}
    </section>
  );
}
