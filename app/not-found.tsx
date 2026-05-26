import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="w-full">
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center sm:py-24">
          <span aria-hidden="true" className="text-7xl animate-rise-in">
            🎬
          </span>

          <h1
            className="mt-6 animate-rise-in font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            style={{ animationDelay: "100ms" }}
          >
            Oups, cette page s&apos;est échappée !
          </h1>

          <p
            className="mt-4 animate-rise-in text-base text-ink/70 sm:text-lg"
            style={{ animationDelay: "200ms" }}
          >
            On dirait que ce défi n&apos;est plus à l&apos;affiche.
            Reviens à l&apos;accueil pour découvrir les nouvelles séries.
          </p>

          <Link
            href="/"
            className="btn-primary mt-8 animate-rise-in"
            style={{ animationDelay: "300ms" }}
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
