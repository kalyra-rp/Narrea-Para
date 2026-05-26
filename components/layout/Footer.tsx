import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-ink/10 bg-cream/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Image
              src="/logo.png"
              alt="Narrea"
              width={1000}
              height={300}
              sizes="160px"
              style={{ height: 44, width: "auto" }}
            />
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Du petit défi express aux grandes sagas sur plusieurs
              générations : donne vie à tes Parafolks.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <Link href="/a-propos" className="text-ink/70 transition hover:text-ink">
              À propos
            </Link>
            <span aria-hidden="true" className="text-ink/30">·</span>
            <Link
              href="/participer"
              className="text-ink/70 transition hover:text-ink"
            >
              Comment participer
            </Link>
            <span aria-hidden="true" className="text-ink/30">·</span>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Instagram
            </a>
          </nav>
        </div>

        <p className="mt-10 text-center text-xs leading-relaxed text-ink/45">
          Narrea est un projet indépendant et non officiel créé par des fans.
          Ce site n&apos;est ni affilié à, ni approuvé par Paralives ou
          Paralives Studio. Paralives est une marque de ses propriétaires
          respectifs.
        </p>
      </div>
    </footer>
  );
}
