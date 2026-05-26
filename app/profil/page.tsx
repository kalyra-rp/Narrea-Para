import Link from "next/link";
import MemberLogoutButton from "@/components/auth/MemberLogoutButton";
import { requireUser } from "@/lib/admin-auth";
import { getUserBadges, getUserStats } from "@/lib/gamification";

export default async function ProfilPage() {
  const { user, profile } = await requireUser();
  const [stats, badges] = await Promise.all([
    getUserStats(user.id),
    getUserBadges(user.id),
  ]);

  const displayName = profile?.display_name ?? user.email ?? "Membre";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";
  const instagramHandle = profile?.instagram_handle ?? null;
  const instagramUrl = instagramHandle
    ? `https://instagram.com/${instagramHandle.replace(/^@/, "")}`
    : null;

  const rangeSize = stats.nextRank
    ? stats.nextRank.minXp - stats.rank.minXp
    : 1;
  const inRangeXp = stats.totalXp - stats.rank.minXp;
  const progressPercent = Math.min(
    100,
    Math.max(0, (inRangeXp / rangeSize) * 100),
  );

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* En-tête : avatar + identité */}
        <section className="animate-rise-in flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
          <span
            aria-hidden="true"
            className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-violet-400 font-display text-3xl font-bold text-white shadow-lg sm:h-24 sm:w-24 sm:text-4xl"
            style={{ boxShadow: "0 12px 30px -10px rgba(255, 106, 136, 0.45)" }}
          >
            {initial}
          </span>

          <div className="mt-4 sm:mt-0">
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {displayName}
            </h1>
            {instagramUrl && instagramHandle && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold text-rose-500 hover:text-rose-600"
              >
                {instagramHandle}
              </a>
            )}
            <p className="mt-1 text-xs text-ink/50">{user.email}</p>
          </div>
        </section>

        {/* Carte de progression */}
        <section
          className="mt-8 animate-rise-in surface-card overflow-hidden p-6 sm:p-7"
          style={{
            animationDelay: "120ms",
            boxShadow: "0 20px 50px -25px rgba(167, 139, 250, 0.25)",
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink/50">
            Rang actuel
          </p>

          <div className="mt-2 flex items-center gap-3">
            <span aria-hidden="true" className="text-4xl sm:text-5xl">
              {stats.rank.emoji}
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold leading-none text-ink sm:text-3xl">
                {stats.rank.label}
              </h2>
              <p className="mt-1 text-sm text-ink/60">
                {stats.totalXp} XP · {stats.completionsCount} défi
                {stats.completionsCount > 1 ? "s" : ""} terminé
                {stats.completionsCount > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {stats.nextRank ? (
            <>
              <div
                className="mt-5 h-3 w-full overflow-hidden rounded-full bg-ink/[0.07]"
                role="progressbar"
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-rose-400 via-rose-500 to-violet-500"
                  style={{
                    width: `${progressPercent}%`,
                    animation: "xp-fill 1.1s ease-out both",
                    animationDelay: "240ms",
                  }}
                />
              </div>
              <p className="mt-3 text-xs text-ink/60">
                Plus que{" "}
                <span className="font-bold text-ink">
                  {stats.xpVersProchainRang} XP
                </span>{" "}
                avant{" "}
                <span className="font-semibold text-ink/80">
                  {stats.nextRank.emoji} {stats.nextRank.label}
                </span>
              </p>
            </>
          ) : (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 px-4 py-1.5 text-sm font-semibold text-amber-800">
              ✨ Rang maximum atteint !
            </p>
          )}
        </section>

        {/* Badges */}
        {badges.length > 0 && (
          <section
            className="mt-10 animate-rise-in"
            style={{ animationDelay: "240ms" }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                🏅 Badges
              </h2>
              <p className="text-sm text-ink/60">
                {unlockedCount} / {badges.length} débloqués
              </p>
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {badges.map((badge, idx) => (
                <li
                  key={badge.id}
                  className={`animate-rise-in relative flex flex-col items-center rounded-2xl p-4 text-center transition ${
                    badge.unlocked
                      ? "border border-rose-100 bg-gradient-to-br from-rose-50 to-violet-50 shadow-sm"
                      : "border border-ink/10 bg-white/60"
                  }`}
                  style={{
                    animationDelay: `${Math.min(idx, 8) * 60}ms`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className={`text-4xl sm:text-5xl ${
                      badge.unlocked ? "" : "opacity-30 grayscale"
                    }`}
                  >
                    {badge.emoji}
                  </span>
                  <h3
                    className={`mt-2 font-display text-sm font-bold leading-tight ${
                      badge.unlocked ? "text-ink" : "text-ink/50"
                    }`}
                  >
                    {badge.label}
                  </h3>
                  <p
                    className={`mt-1 text-xs leading-snug ${
                      badge.unlocked ? "text-ink/70" : "text-ink/40"
                    }`}
                  >
                    {badge.description}
                  </p>
                  {badge.unlocked ? (
                    <p className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      ✓ Débloqué
                    </p>
                  ) : (
                    <p className="mt-2 inline-flex items-center rounded-full bg-ink/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink/40">
                      🔒 À débloquer
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Actions */}
        <section
          className="mt-12 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6 animate-rise-in"
          style={{ animationDelay: "360ms" }}
        >
          <Link href="/profil/parametres" className="btn-secondary">
            ⚙️ Modifier mes informations
          </Link>
          <MemberLogoutButton />
        </section>
      </div>
    </main>
  );
}
