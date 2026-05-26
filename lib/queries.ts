import { createClient } from "@/lib/supabase/server";
import type {
  Badge,
  Creation,
  CreationCategory,
  Defi,
  Genre,
  Serie,
} from "@/lib/types";

// =====================================================================
// GENRES
// =====================================================================

type GenreRow = {
  id: string;
  label: string;
  slug: string;
  accent: string;
  emoji: string;
  position: number;
};

function mapGenre(row: GenreRow): Genre {
  return {
    id: row.id,
    label: row.label,
    slug: row.slug,
    accent: row.accent,
    emoji: row.emoji,
  };
}

export async function getGenres(): Promise<Genre[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("genres")
    .select("id, label, slug, accent, emoji, position")
    .order("position", { ascending: true });

  if (error) {
    console.error("[getGenres] Erreur Supabase :", error.message);
    return [];
  }

  return (data ?? []).map(mapGenre);
}

// =====================================================================
// SERIES
// =====================================================================

type SerieRow = {
  id: string;
  title: string;
  slug: string;
  genre_id: string;
  description: string;
  emoji: string;
  cover_color_1: string;
  cover_color_2: string;
  duration: "express" | "moyen" | "saga";
  featured: boolean | null;
};

const SERIE_COLUMNS =
  "id, title, slug, genre_id, description, emoji, cover_color_1, cover_color_2, duration, featured";

function mapSerie(row: SerieRow): Serie {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    genreId: row.genre_id,
    description: row.description,
    emoji: row.emoji,
    coverColors: [row.cover_color_1, row.cover_color_2],
    duration: row.duration,
    featured: row.featured ?? false,
  };
}

export async function getSeries(): Promise<Serie[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("series")
    .select(SERIE_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getSeries] Erreur Supabase :", error.message);
    return [];
  }
  return (data ?? []).map(mapSerie);
}

export async function getFeaturedSeries(): Promise<Serie[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("series")
    .select(SERIE_COLUMNS)
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getFeaturedSeries] Erreur Supabase :", error.message);
    return [];
  }
  return (data ?? []).map(mapSerie);
}

export async function getSeriesByGenre(genreId: string): Promise<Serie[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("series")
    .select(SERIE_COLUMNS)
    .eq("genre_id", genreId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getSeriesByGenre] Erreur Supabase :", error.message);
    return [];
  }
  return (data ?? []).map(mapSerie);
}

export async function getSerieById(id: string): Promise<Serie | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("series")
    .select(SERIE_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getSerieById] Erreur Supabase :", error.message);
    return null;
  }
  return data ? mapSerie(data) : null;
}

export async function getSerieBySlug(slug: string): Promise<Serie | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("series")
    .select(SERIE_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[getSerieBySlug] Erreur Supabase :", error.message);
    return null;
  }
  return data ? mapSerie(data) : null;
}

// =====================================================================
// DEFIS
// =====================================================================

type DefiRow = {
  id: string;
  title: string;
  slug: string;
  serie_id: string;
  episode_number: number;
  difficulty: number;
  description: string;
  rules: string[] | null;
  hashtags: string[] | null;
  signature: string | null;
  image_url: string | null;
};

const DEFI_COLUMNS =
  "id, title, slug, serie_id, episode_number, difficulty, description, rules, hashtags, signature, image_url";

function clampDifficulty(value: number): 1 | 2 | 3 | 4 | 5 {
  const n = Math.max(1, Math.min(5, Math.round(value)));
  return n as 1 | 2 | 3 | 4 | 5;
}

function mapDefi(row: DefiRow): Defi {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    serieId: row.serie_id,
    episodeNumber: row.episode_number,
    difficulty: clampDifficulty(row.difficulty),
    description: row.description,
    rules: row.rules ?? [],
    hashtags: row.hashtags ?? [],
    signature: row.signature,
    imageUrl: row.image_url,
  };
}

export async function getDefiById(id: string): Promise<Defi | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("defis")
    .select(DEFI_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getDefiById] Erreur Supabase :", error.message);
    return null;
  }
  return data ? mapDefi(data) : null;
}

export async function getDefisBySerie(serieId: string): Promise<Defi[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("defis")
    .select(DEFI_COLUMNS)
    .eq("serie_id", serieId)
    .order("episode_number", { ascending: true });

  if (error) {
    console.error("[getDefisBySerie] Erreur Supabase :", error.message);
    return [];
  }
  return (data ?? []).map(mapDefi);
}

export async function getDefiBySlug(
  serieSlug: string,
  defiSlug: string,
): Promise<Defi | null> {
  const supabase = await createClient();

  // 1) Trouver la série par son slug pour récupérer son id.
  const { data: serieRow, error: serieError } = await supabase
    .from("series")
    .select("id")
    .eq("slug", serieSlug)
    .maybeSingle();

  if (serieError) {
    console.error("[getDefiBySlug] Erreur série :", serieError.message);
    return null;
  }
  if (!serieRow) return null;

  // 2) Chercher le défi par son slug ET vérifier qu'il appartient bien à la série.
  const { data, error } = await supabase
    .from("defis")
    .select(DEFI_COLUMNS)
    .eq("slug", defiSlug)
    .eq("serie_id", serieRow.id)
    .maybeSingle();

  if (error) {
    console.error("[getDefiBySlug] Erreur défi :", error.message);
    return null;
  }
  return data ? mapDefi(data) : null;
}

// =====================================================================
// HELPERS (non listés mais nécessaires aux vignettes de l'accueil)
// =====================================================================

// Renvoie { [serieId]: imageUrl } en prenant l'image du défi ayant
// le plus grand episode_number pour chaque série. Sert d'illustration
// par défaut pour la vignette d'une série sur l'accueil.
export async function getLatestDefiImageBySerie(): Promise<
  Record<string, string>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("defis")
    .select("serie_id, image_url, episode_number")
    .not("image_url", "is", null)
    .order("episode_number", { ascending: false });

  if (error) {
    console.error(
      "[getLatestDefiImageBySerie] Erreur Supabase :",
      error.message,
    );
    return {};
  }

  // Trié par episode_number décroissant : la première image rencontrée
  // pour chaque série est donc celle du dernier épisode.
  const result: Record<string, string> = {};
  for (const row of (data ?? []) as {
    serie_id: string;
    image_url: string | null;
    episode_number: number;
  }[]) {
    if (row.image_url && !(row.serie_id in result)) {
      result[row.serie_id] = row.image_url;
    }
  }
  return result;
}

// =====================================================================
// CREATIONS (drops Steam Workshop de Kalyra)
// =====================================================================

type CreationRow = {
  id: string;
  title: string;
  slug: string;
  category: CreationCategory;
  description: string;
  image_url: string | null;
  workshop_url: string;
  tags: string[] | null;
  counter_label: string | null;
  featured: boolean | null;
  position: number | null;
  created_at: string;
};

const CREATION_COLUMNS =
  "id, title, slug, category, description, image_url, workshop_url, tags, counter_label, featured, position, created_at";

function mapCreation(row: CreationRow): Creation {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    description: row.description,
    imageUrl: row.image_url,
    workshopUrl: row.workshop_url,
    tags: row.tags ?? [],
    counterLabel: row.counter_label,
    featured: row.featured ?? false,
    position: row.position ?? 0,
    createdAt: row.created_at,
  };
}

export async function getCreations(): Promise<Creation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("creations")
    .select(CREATION_COLUMNS)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getCreations] Erreur Supabase :", error.message);
    return [];
  }
  return ((data ?? []) as CreationRow[]).map(mapCreation);
}

export async function getCreationsByCategory(
  category: CreationCategory,
): Promise<Creation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("creations")
    .select(CREATION_COLUMNS)
    .eq("category", category)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getCreationsByCategory] Erreur Supabase :", error.message);
    return [];
  }
  return ((data ?? []) as CreationRow[]).map(mapCreation);
}

export async function getCreationById(id: string): Promise<Creation | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("creations")
    .select(CREATION_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getCreationById] Erreur Supabase :", error.message);
    return null;
  }
  return data ? mapCreation(data as CreationRow) : null;
}

// =====================================================================
// BADGES (définitions, lecture publique)
// =====================================================================

type BadgeRow = {
  id: string;
  label: string;
  description: string;
  emoji: string;
  condition_type: Badge["conditionType"];
  condition_value: number;
  position: number;
};

const BADGE_COLUMNS =
  "id, label, description, emoji, condition_type, condition_value, position";

function mapBadge(row: BadgeRow): Badge {
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    emoji: row.emoji,
    conditionType: row.condition_type,
    conditionValue: row.condition_value,
    position: row.position,
  };
}

export async function getBadges(): Promise<Badge[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("badges")
    .select(BADGE_COLUMNS)
    .order("position", { ascending: true });

  if (error) {
    console.error("[getBadges] Erreur Supabase :", error.message);
    return [];
  }
  return ((data ?? []) as BadgeRow[]).map(mapBadge);
}

export async function getBadgeById(id: string): Promise<Badge | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("badges")
    .select(BADGE_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getBadgeById] Erreur Supabase :", error.message);
    return null;
  }
  return data ? mapBadge(data as BadgeRow) : null;
}

// =====================================================================
// GAMIFICATION (favoris & complétions) — propres à l'utilisateur connecté
// =====================================================================

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// Renvoie les ids des défis que l'utilisateur a en favori.
// Tableau vide si personne n'est connecté — pas d'erreur.
export async function getUserFavoriIds(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favoris")
    .select("defi_id")
    .eq("user_id", userId);

  if (error) {
    console.error("[getUserFavoriIds] Erreur Supabase :", error.message);
    return [];
  }
  return ((data ?? []) as { defi_id: string }[]).map((r) => r.defi_id);
}

// Renvoie les ids des défis que l'utilisateur a marqués terminés.
export async function getUserCompletionIds(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("completions")
    .select("defi_id")
    .eq("user_id", userId);

  if (error) {
    console.error("[getUserCompletionIds] Erreur Supabase :", error.message);
    return [];
  }
  return ((data ?? []) as { defi_id: string }[]).map((r) => r.defi_id);
}

// Renvoie la liste complète des défis favoris de l'utilisateur
// (mappés Defi[], triés par created_at desc côté table defis).
export async function getUserFavoriDefis(): Promise<Defi[]> {
  const ids = await getUserFavoriIds();
  if (ids.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("defis")
    .select(DEFI_COLUMNS)
    .in("id", ids);

  if (error) {
    console.error("[getUserFavoriDefis] Erreur Supabase :", error.message);
    return [];
  }
  return ((data ?? []) as DefiRow[]).map(mapDefi);
}

// Renvoie { [serieId]: nombre d'épisodes } pour pouvoir afficher
// "N épisodes" sous chaque SeriePoster sans charger tous les défis.
export async function getEpisodeCountsBySerie(): Promise<
  Record<string, number>
> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("defis").select("serie_id");

  if (error) {
    console.error(
      "[getEpisodeCountsBySerie] Erreur Supabase :",
      error.message,
    );
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { serie_id: string }[]) {
    counts[row.serie_id] = (counts[row.serie_id] ?? 0) + 1;
  }
  return counts;
}
