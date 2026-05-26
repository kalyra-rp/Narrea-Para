import { siteConfig } from "@/lib/site-config";

export default function AProposPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="w-full">
        <article className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Salut, bienvenue chez Narrea ! 👋
          </h1>

          <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-ink/80 sm:text-lg">
            <p>
              Moi c&apos;est{" "}
              <strong className="font-semibold text-ink">
                {siteConfig.creator}
              </strong>
              , et Narrea c&apos;est mon petit projet de passionnée. J&apos;attends
              Paralives depuis looongtemps 😅, et plus le jeu approchait, plus
              une idée me trottait dans la tête : j&apos;ai tellement de choses
              que je veux tester en jeu… autant les transformer en défis et
              les partager avec vous !
            </p>

            <p>
              Tu connais ce moment où tu lances ta partie… et où tu ne sais
              pas trop quoi faire ? Narrea est là pour ça. J&apos;imagine des
              séries de défis — comme des séries à binge-watcher, mais à
              jouer ! Chaque série a un thème, chaque épisode est un défi. Du
              petit challenge express à la grande saga sur plusieurs
              générations.
            </p>

            <p>
              L&apos;idée, c&apos;est de jouer, de s&apos;amuser, et surtout de
              partager nos créations ensemble. Parce que c&apos;est tellement
              plus fun à plusieurs. Bienvenue dans l&apos;aventure ! ✨
            </p>
          </div>

          <p className="mt-10 text-sm italic text-ink/50">
            Narrea est un projet indépendant et non officiel, créé par amour
            du jeu.
          </p>
        </article>
      </section>
    </main>
  );
}
