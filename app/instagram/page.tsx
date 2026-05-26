import { siteConfig } from "@/lib/site-config";

const blocks = [
  {
    emoji: "🎬",
    title: "Comment ça marche",
    bodyNode: (handle: string, hashtag: string) => (
      <>
        Choisis un défi sur le site, relève-le dans ta partie, puis poste tes
        plus belles captures avec{" "}
        <strong className="font-semibold text-ink">{hashtag}</strong>
        {" "}(+ le hashtag du défi) et tague{" "}
        <strong className="font-semibold text-ink">{handle}</strong>.
      </>
    ),
  },
  {
    emoji: "🌟",
    title: "Sois mise à l'honneur",
    body:
      "Chaque semaine, je repartage mes créations coups de cœur en story, et les plus belles participations ont droit à un post dédié sur le compte ! ✨",
  },
  {
    emoji: "💛",
    title: "L'esprit Narrea",
    body:
      "Ici, zéro compétition toxique. Tous les niveaux sont les bienvenus, du premier build un peu bancal aux sagas de folie. On est là pour s'amuser et s'encourager. Bienveillance avant tout !",
  },
  {
    emoji: "📌",
    title: "Pour participer",
    body:
      "Mets ton compte en public le temps du défi (sinon je ne peux pas voir ta publication 😉) et n'oublie pas le hashtag !",
  },
];

export default function InstagramPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="w-full">
        <article className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Rejoins la communauté Narrea ! 💜
          </h1>

          <p className="mt-6 text-base leading-relaxed text-ink/80 sm:text-lg">
            Tout se passe sur Instagram — c&apos;est notre QG ! On y partage
            nos créations, on découvre celles des autres et on se motive
            ensemble.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {blocks.map((block) => (
              <section
                key={block.title}
                className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:p-6"
              >
                <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                  <span aria-hidden="true" className="mr-2">
                    {block.emoji}
                  </span>
                  {block.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/80 sm:text-base">
                  {block.bodyNode
                    ? block.bodyNode(
                        siteConfig.instagramHandle,
                        siteConfig.mainHashtag,
                      )
                    : block.body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#EC4899] to-[#A78BFA] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-105"
            >
              Suivre {siteConfig.instagramHandle}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
