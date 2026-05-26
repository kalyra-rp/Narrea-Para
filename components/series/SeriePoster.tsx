import Link from "next/link";
import type { Serie } from "@/lib/types";

type Props = {
  serie: Serie;
  episodesCount: number;
  imageUrl?: string | null;
  /** Index dans la rangée — sert à décaler l'animation d'arrivée. */
  index?: number;
};

const durationLabels: Record<Serie["duration"], string> = {
  express: "Express",
  moyen: "Moyen",
  saga: "Saga",
};

const durationTextColors: Record<Serie["duration"], string> = {
  express: "text-emerald-600",
  moyen: "text-amber-600",
  saga: "text-pink-600",
};

export default function SeriePoster({
  serie,
  episodesCount,
  imageUrl,
  index,
}: Props) {
  const [c1, c2] = serie.coverColors;
  const hasImage = Boolean(imageUrl);
  const delayMs = Math.min(index ?? 0, 6) * 60;

  return (
    <Link
      href={`/series/${serie.slug}`}
      className="group flex w-[150px] shrink-0 snap-start flex-col animate-rise-in sm:w-[170px] md:w-[180px]"
      style={delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-lg transition duration-300 ease-out [@media(hover:hover)]:group-hover:-translate-y-1 [@media(hover:hover)]:group-hover:scale-[1.03] [@media(hover:hover)]:group-hover:shadow-xl"
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
              className="absolute inset-0 flex items-center justify-center text-5xl drop-shadow-md"
            >
              {serie.emoji}
            </span>
          </>
        )}

        {/* Badge durée */}
        <span
          className={`absolute right-2 top-2 inline-flex items-center rounded-full bg-white/85 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-sm ${durationTextColors[serie.duration]}`}
        >
          {durationLabels[serie.duration]}
        </span>

        {/* Voile bas pour lisibilité du compteur d'épisodes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 via-black/15 to-transparent"
        />

        <span className="absolute bottom-2 left-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-white">
          ▶ {episodesCount} défi{episodesCount > 1 ? "s" : ""}
        </span>
      </div>

      <h3 className="mt-2.5 font-display text-sm font-semibold leading-tight text-ink sm:text-base">
        {serie.title}
      </h3>
    </Link>
  );
}
