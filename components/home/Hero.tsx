import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-12 pb-8 text-center sm:pt-16 sm:pb-10">
        <span
          className="inline-flex items-center rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-medium text-ink/80 shadow-sm animate-rise-in"
        >
          🎮 Paralives — Early Access 2026
        </span>

        <h1
          className="mt-6 font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl animate-rise-in"
          style={{ animationDelay: "120ms" }}
        >
          Parafolks
          <br />
          <span className="bg-[linear-gradient(to_right,#FF6B6B,#FBBF24,#34D399,#A78BFA)] bg-clip-text text-transparent">
            Challenges
          </span>
        </h1>

        <p
          className="mt-5 max-w-2xl text-base text-ink/70 sm:text-lg animate-rise-in"
          style={{ animationDelay: "240ms" }}
        >
          Du petit défi express aux grandes sagas sur plusieurs générations :
          donne vie à tes Parafolks.
        </p>

        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-7 animate-rise-in"
          style={{ animationDelay: "360ms" }}
        >
          Rejoindre sur Instagram
        </a>
      </div>
    </section>
  );
}
