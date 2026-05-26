export type Genre = {
  id: string;
  label: string;
  slug: string;
  accent: string;
  emoji: string;
};

export type Serie = {
  id: string;
  title: string;
  slug: string;
  genreId: string;
  description: string;
  emoji: string;
  coverColors: [string, string];
  duration: "express" | "moyen" | "saga";
  // mis en avant sur l'accueil
  featured?: boolean;
};

export type Badge = {
  id: string;
  label: string;
  description: string;
  emoji: string;
  conditionType: "completions_count" | "genre_explorer" | "serie_complete";
  conditionValue: number;
  position: number;
};

export type Defi = {
  id: string;
  title: string;
  slug: string;
  serieId: string;
  episodeNumber: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  rules: string[];
  hashtags: string[];
  // petit mot de Kalyra affiché en bas du défi
  signature: string | null;
  // URL publique vers le bucket Storage "defi-images"
  imageUrl: string | null;
};
