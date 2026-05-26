import { Fragment } from "react";
import FeaturedHero from "@/components/home/FeaturedHero";
import Hero from "@/components/home/Hero";
import SerieRow from "@/components/series/SerieRow";
import {
  getEpisodeCountsBySerie,
  getFeaturedSeries,
  getGenres,
  getLatestDefiImageBySerie,
  getSeries,
  getUserFavoriIds,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const [
    genres,
    allSeries,
    featuredSeries,
    episodeCounts,
    latestImages,
    favoriIds,
  ] = await Promise.all([
    getGenres(),
    getSeries(),
    getFeaturedSeries(),
    getEpisodeCountsBySerie(),
    getLatestDefiImageBySerie(),
    getUserFavoriIds(),
  ]);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  // Calcul "Série à la une" : la première série featured.
  const featuredSerie = featuredSeries[0] ?? null;
  const featuredGenre = featuredSerie
    ? (genres.find((g) => g.id === featuredSerie.genreId) ?? null)
    : null;

  // Récupère le dernier défi de la série à la une (pour le bouton favori).
  let latestDefiId: string | null = null;
  if (featuredSerie) {
    const { data: latestDefi } = await supabase
      .from("defis")
      .select("id")
      .eq("serie_id", featuredSerie.id)
      .order("episode_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    latestDefiId = (latestDefi?.id as string | undefined) ?? null;
  }

  const isFeaturedFavori = latestDefiId ? favoriIds.includes(latestDefiId) : false;
  const hasGenres = genres.length > 0;

  return (
    <main className="flex flex-1 flex-col">
      <Hero />

      {featuredSerie && (
        <FeaturedHero
          serie={featuredSerie}
          genreLabel={featuredGenre?.label ?? null}
          imageUrl={latestImages[featuredSerie.id] ?? null}
          episodesCount={episodeCounts[featuredSerie.id] ?? 0}
          latestDefiId={latestDefiId}
          isFavori={isFeaturedFavori}
          isLoggedIn={isLoggedIn}
        />
      )}

      {hasGenres ? (
        <div className="flex flex-col gap-16 py-12 sm:gap-20">
          {genres.map((genre, idx) => {
            const seriesOfGenre = allSeries.filter(
              (s) => s.genreId === genre.id,
            );
            return (
              <Fragment key={genre.id}>
                {idx > 0 && (
                  <div
                    aria-hidden="true"
                    className="mx-auto h-px w-full max-w-6xl px-6"
                  >
                    <div className="h-px w-full bg-[linear-gradient(to_right,transparent,rgba(42,36,64,0.10),transparent)]" />
                  </div>
                )}
                <SerieRow
                  genre={genre}
                  series={seriesOfGenre}
                  episodeCounts={episodeCounts}
                  latestImages={latestImages}
                />
              </Fragment>
            );
          })}
        </div>
      ) : (
        <section className="w-full">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-base text-ink/60">
              Bientôt de nouveaux genres !
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
