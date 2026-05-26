import { siteConfig } from "@/lib/site-config";

const steps = [
  {
    emoji: "🍿",
    title: "Explore",
    body:
      "Parcours les séries par genre, comme sur ta plateforme de streaming préférée. Build, romance, sagas familiales… il y en a pour toutes les envies.",
  },
  {
    emoji: "▶️",
    title: "Choisis ton épisode",
    body:
      "Clique sur une série, regarde ses épisodes, et lance-toi sur le défi qui te tente !",
  },
  {
    emoji: "🎮",
    title: "Joue",
    body:
      "Relève le défi dans ta partie Paralives. Prends ton temps, amuse-toi, sois créative.",
  },
  {
    emoji: "📸",
    title: "Partage",
    bodyNode: (handle: string, hashtag: string) => (
      <>
        Poste tes plus belles captures sur Instagram avec{" "}
        <strong className="font-semibold text-ink">{hashtag}</strong>
        {" "}(+ les hashtags du défi) et tague{" "}
        <strong className="font-semibold text-ink">{handle}</strong>. Tu
        pourrais être mise à l&apos;honneur ! 🌟
      </>
    ),
  },
  {
    emoji: "🏅",
    title: "Bientôt…",
    body:
      "Crée ton profil, enregistre tes défis favoris, coche tes épisodes terminés et gagne des badges. La progression arrive très vite !",
  },
];

export default function ParticiperPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="w-full">
        <article className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            🎬 Comment ça marche
          </h1>
          <p className="mt-4 text-base text-ink/70 sm:text-lg">
            Comment ça marche ? C&apos;est super simple ! 🎬
          </p>

          <ol className="mt-10 flex flex-col gap-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:gap-5 sm:p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 font-display text-base font-bold text-ink sm:h-11 sm:w-11">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                    <span aria-hidden="true" className="mr-2">
                      {step.emoji}
                    </span>
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/80 sm:text-base">
                    {step.bodyNode
                      ? step.bodyNode(
                          siteConfig.instagramHandle,
                          siteConfig.mainHashtag,
                        )
                      : step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}
