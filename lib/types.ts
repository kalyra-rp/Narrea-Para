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

// Les 3 catégories du Steam Workshop de Kalyra.
export type CreationCategory = "parafolk" | "maison" | "terrain";

export type Creation = {
  id: string;
  title: string;
  slug: string;
  category: CreationCategory;
  description: string;
  // URL publique vers le bucket Storage "creation-images"
  imageUrl: string | null;
  // Lien externe vers la page Steam Workshop
  workshopUrl: string;
  tags: string[];
  // petit compteur affiché sur la carte, ex. "⬇️ 1.2k"
  counterLabel: string | null;
  featured: boolean;
  position: number;
  createdAt: string;
};
