"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const INPUT_CLASS =
  "rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink shadow-sm transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:opacity-60";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="w-full">
        <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col items-center text-center animate-rise-in">
            <Image
              src="/logo.png"
              alt="Narrea"
              width={1000}
              height={300}
              priority
              sizes="200px"
              style={{ height: 56, width: "auto" }}
            />
            <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              🛠️ Connexion admin
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              Espace réservé à l&apos;administration de Narrea.
            </p>
          </div>

          <div
            className="mt-7 surface-card animate-rise-in p-6 sm:p-7"
            style={{ animationDelay: "120ms" }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-ink/80">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={INPUT_CLASS}
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-ink/80">Mot de passe</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={INPUT_CLASS}
                />
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-2 w-full justify-center py-3"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
