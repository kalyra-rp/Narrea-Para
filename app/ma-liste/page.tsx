import Link from "next/link";
import { requireUser } from "@/lib/admin-auth";
import { getUserFavoriDefis } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export default async function MaListePage() {
  await requireUser();

  const defis = await getUserFavoriDefis();

  // Une seule requête pour les séries concernées (slug + titre + couleurs).
  const serieIds = Array.from(new Set(defis.map((d) => d.serieId)));
  let seriesById = new Map<
    string,
    {
      slug: string;
      title: string;
      coverColors: [string, string];
      emoji: string;
    }
  >();
  if (serieIds.length > 0) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("series")
      .select("id, slug, title, cover_color_1, cover_color_2, emoji")
      .in("id", serieIds);

    if (data) {
      seriesById = new Map(
        (
          data as {
            id: string;
            slug: string;
            title: string;
            cover_color_1: string;
            cover_color_2: string;
            emoji: string;
          }[]
        ).map((s) => [
          s.id,
          {
            slug: s.slug,
            title: s.title,
            coverColors: [s.cover_color_1, s.cover_color_2],
            emoji: s.emoji,
          },
        ]),
      );
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="animate-rise-in font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Ma liste 🔖
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Les défis que tu as mis de côté pour plus tard.
        </p>

        {defis.length === 0 ? (
          <section
            className="mt-10 animate-rise-in surface-card flex flex-col items-center p-10 text-center"
            style={{ animationDelay: "120ms" }}
          >
            <span aria-hidden="true" className="text-5xl">
              🔖
            </span>
            <p className="mt-4 font-display text-lg font-bold text-ink">
              Ta liste est vide !
            </p>
            <p className="mt-2 max-w-sm text-sm text-ink/60">
              Explore les défis sur l&apos;accueil et clique sur « Ajouter à
              ma liste » pour garder tes préférés à portée de main.
            </p>
            <Link href="/" className="btn-primary mt-6">
              Explorer les défis
            </Link>
          </section>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {defis.map((defi, idx) => {
              const serie = seriesById.get(defi.serieId);
              if (!serie) return null;
              const [c1, c2] = serie.coverColors;

              return (
                <li
                  key={defi.id}
                  className="animate-rise-in"
                  style={{ animationDelay: `${Math.min(idx, 8) * 60}ms` }}
                >
                  <Link
                    href={`/series/${serie.slug}/${defi.slug}`}
                    className="group surface-card flex h-full flex-col overflow-hidden transition [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-md"
                  >
                    <div className="relative aspect-square w-full overflow-hidden">
                      {defi.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={defi.imageUrl}
                          alt={defi.title}
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
                            className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-md"
                          >
                            {serie.emoji}
                          </span>
                        </div>
                      )}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 via-black/15 to-transparent"
                      />
                      <p
                        className="absolute bottom-2 left-3 text-[11px] font-semibold text-amber-300"
                        aria-label={`Difficulté ${defi.difficulty} sur 5`}
                      >
                        {"⭐".repeat(defi.difficulty)}
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-ink/50">
                        {serie.title} · Ép. {defi.episodeNumber}
                      </p>
                      <h2 className="mt-1 font-display text-base font-bold leading-tight text-ink sm:text-lg">
                        {defi.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-ink/70">
                        {defi.description}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
