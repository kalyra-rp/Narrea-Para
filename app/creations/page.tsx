import { getCreations } from "@/lib/queries";
import type { Creation, CreationCategory } from "@/lib/types";

// Ordre d'affichage des catégories + libellés + emoji.
// Source unique de vérité pour la section publique.
const CATEGORIES: {
  key: CreationCategory;
  label: string;
  emoji: string;
  intro: string;
}[] = [
  {
    key: "parafolk",
    label: "Parafolks",
    emoji: "🧍",
    intro: "Des personnages prêts à rejoindre ton univers.",
  },
  {
    key: "maison",
    label: "Maisons",
    emoji: "🏠",
    intro: "Des foyers pensés pour raconter une histoire.",
  },
  {
    key: "terrain",
    label: "Terrains communautaires",
    emoji: "🌳",
    intro: "Des lieux de vie partagés à intégrer dans tes parties.",
  },
];

// Petites couleurs douces pour les pastilles de tags : on alterne
// les accents existants du design system pour rester cohérent.
const TAG_STYLES = [
  "bg-build/10 text-build",
  "bg-legacy/15 text-legacy",
  "bg-story/15 text-story",
  "bg-cult/15 text-cult",
  "bg-cas/15 text-cas",
  "bg-romance/15 text-romance",
];

export default async function CreationsPage() {
  const creations = await getCreations();

  // On groupe les créations par catégorie en respectant l'ordre déjà
  // imposé par getCreations() (position asc, puis created_at desc).
  const grouped = new Map<CreationCategory, Creation[]>();
  for (const c of CATEGORIES) {
    grouped.set(c.key, []);
  }
  for (const creation of creations) {
    grouped.get(creation.category)?.push(creation);
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* En-tête de page */}
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Mes créations 🎨
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink/75 sm:text-lg">
            Mes Parafolks, maisons et terrains à télécharger sur le Steam
            Workshop ! 💜 Chaque drop est testé, peaufiné et prêt à atterrir
            dans tes parties.
          </p>
        </header>

        {/* Sections empilées : une par catégorie. Choix « empilé » plutôt
            qu'onglets parce que les 3 catégories ont peu d'items au
            démarrage et qu'on veut tout voir d'un seul scroll sur mobile. */}
        <div className="mt-12 flex flex-col gap-14">
          {CATEGORIES.map((cat, catIndex) => {
            const items = grouped.get(cat.key) ?? [];

            return (
              <section
                key={cat.key}
                aria-labelledby={`cat-${cat.key}`}
                className="animate-rise-in"
                style={{ animationDelay: `${catIndex * 80}ms` }}
              >
                <header className="flex flex-col gap-1">
                  <h2
                    id={`cat-${cat.key}`}
                    className="font-display text-2xl font-bold text-ink sm:text-3xl"
                  >
                    <span aria-hidden="true">{cat.emoji}</span> {cat.label}
                  </h2>
                  <p className="text-sm text-ink/60 sm:text-base">
                    {cat.intro}
                  </p>
                </header>

                {items.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-dashed border-ink/15 bg-white/50 px-5 py-8 text-center text-sm text-ink/60">
                    Bientôt de nouvelles créations ici ! ✨
                  </p>
                ) : (
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((creation, i) => (
                      <CreationCard
                        key={creation.id}
                        creation={creation}
                        animationDelay={catIndex * 80 + i * 60}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

// =====================================================================
// CreationCard — carte d'une création (image, titre, desc, tags, CTA)
// =====================================================================

function CreationCard({
  creation,
  animationDelay,
}: {
  creation: Creation;
  animationDelay: number;
}) {
  return (
    <article
      className="surface-card flex animate-rise-in flex-col overflow-hidden transition hover:shadow-md"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Image carrée pour rester très lisible sur mobile. */}
      <div className="relative aspect-square w-full overflow-hidden bg-ink/5">
        {creation.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={creation.imageUrl}
            alt={creation.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-ink/30">
            🎨
          </div>
        )}

        {creation.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink shadow-sm backdrop-blur">
            ⭐ Coup de cœur
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-tight text-ink">
            {creation.title}
          </h3>
          {creation.counterLabel && (
            <span className="shrink-0 text-xs font-semibold text-ink/55">
              {creation.counterLabel}
            </span>
          )}
        </div>

        {creation.description && (
          <p className="text-sm leading-relaxed text-ink/70">
            {creation.description}
          </p>
        )}

        {creation.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {creation.tags.map((tag, i) => (
              <li
                key={tag}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  TAG_STYLES[i % TAG_STYLES.length]
                }`}
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-2">
          <a
            href={creation.workshopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            Voir sur le Workshop ↗
          </a>
        </div>
      </div>
    </article>
  );
}
