import { getBadges } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import type { Badge } from "@/lib/types";

export const XP_PAR_DEFI = 100;

export const RANKS = [
  { label: "Apprenti", minXp: 0, emoji: "🌱" },
  { label: "Créateur", minXp: 300, emoji: "🎨" },
  { label: "Artisan", minXp: 700, emoji: "🛠️" },
  { label: "Expert", minXp: 1500, emoji: "🏆" },
  { label: "Paramaster", minXp: 3000, emoji: "👑" },
] as const;

export type Rank = (typeof RANKS)[number];

export type UserStats = {
  totalXp: number;
  completionsCount: number;
  rank: Rank;
  nextRank: Rank | null;
  xpVersProchainRang: number;
};

export type BadgeWithUnlock = Badge & { unlocked: boolean };

export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("[getUserStats] Erreur Supabase :", error.message);
  }

  const completionsCount = count ?? 0;
  const totalXp = completionsCount * XP_PAR_DEFI;

  let rank: Rank = RANKS[0];
  for (const r of RANKS) {
    if (totalXp >= r.minXp) rank = r;
  }
  const currentIdx = RANKS.indexOf(rank);
  const nextRank =
    currentIdx < RANKS.length - 1 ? RANKS[currentIdx + 1] : null;
  const xpVersProchainRang = nextRank ? nextRank.minXp - totalXp : 0;

  return { totalXp, completionsCount, rank, nextRank, xpVersProchainRang };
}

export async function getUserBadges(
  userId: string,
): Promise<BadgeWithUnlock[]> {
  const supabase = await createClient();

  const [badges, completionsResult] = await Promise.all([
    getBadges(),
    supabase.from("completions").select("defi_id").eq("user_id", userId),
  ]);

  const completedDefiIds = (
    (completionsResult.data ?? []) as { defi_id: string }[]
  ).map((r) => r.defi_id);
  const completionsCount = completedDefiIds.length;

  // Cas "aucune complétion" : seuls les badges à seuil 0 sont débloqués.
  if (completionsCount === 0) {
    return badges.map((b) => ({ ...b, unlocked: b.conditionValue === 0 }));
  }

  // Pour chaque défi terminé, on remonte serie_id.
  const { data: completedDefisData } = await supabase
    .from("defis")
    .select("id, serie_id")
    .in("id", completedDefiIds);
  const completedDefis = (completedDefisData ?? []) as {
    id: string;
    serie_id: string;
  }[];

  // Genres distincts touchés (defi → serie → genre).
  const completedSerieIds = Array.from(
    new Set(completedDefis.map((d) => d.serie_id)),
  );
  const { data: relatedSeriesData } = await supabase
    .from("series")
    .select("id, genre_id")
    .in("id", completedSerieIds);
  const uniqueGenreIds = new Set(
    ((relatedSeriesData ?? []) as { id: string; genre_id: string }[]).map(
      (s) => s.genre_id,
    ),
  );

  // Combien de défis au TOTAL par série (parmi celles touchées) ?
  const { data: allDefisInSeriesData } = await supabase
    .from("defis")
    .select("serie_id")
    .in("serie_id", completedSerieIds);
  const totalPerSerie: Record<string, number> = {};
  for (const d of (allDefisInSeriesData ?? []) as { serie_id: string }[]) {
    totalPerSerie[d.serie_id] = (totalPerSerie[d.serie_id] ?? 0) + 1;
  }

  // Combien la personne en a fait par série ?
  const userPerSerie: Record<string, number> = {};
  for (const d of completedDefis) {
    userPerSerie[d.serie_id] = (userPerSerie[d.serie_id] ?? 0) + 1;
  }

  // Une série est "complétée" si tous ses défis sont terminés.
  const seriesFullyCompletedCount = Object.entries(totalPerSerie).filter(
    ([sid, total]) => total > 0 && userPerSerie[sid] === total,
  ).length;

  return badges.map((b) => {
    let unlocked = false;
    switch (b.conditionType) {
      case "completions_count":
        unlocked = completionsCount >= b.conditionValue;
        break;
      case "genre_explorer":
        unlocked = uniqueGenreIds.size >= b.conditionValue;
        break;
      case "serie_complete":
        unlocked = seriesFullyCompletedCount >= b.conditionValue;
        break;
    }
    return { ...b, unlocked };
  });
}
