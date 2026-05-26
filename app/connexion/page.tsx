"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const INPUT_CLASS =
  "rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink shadow-sm transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:opacity-60";
const LABEL_CLASS = "flex flex-col gap-1.5 text-sm";
const LABEL_TEXT_CLASS = "font-semibold text-ink/80";

function normalizeInstagramHandle(value: string): string {
  const trimmed = value.trim().replace(/^@+/, "");
  return trimmed.length > 0 ? `@${trimmed}` : "";
}

function translateSignupError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "Cet email est déjà utilisé.";
  }
  if (m.includes("password") && m.includes("characters")) {
    return "Le mot de passe doit faire au moins 6 caractères.";
  }
  if (m.includes("invalid") && m.includes("email")) {
    return "L'adresse email n'est pas valide.";
  }
  return message;
}

type Mode = "login" | "signup";

export default function ConnexionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");

  return (
    <main className="flex flex-1 flex-col">
      <section className="w-full">
        <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16">
          {/* Logo + tagline */}
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
              Rejoins l&apos;aventure Narrea 💜
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              {mode === "login"
                ? "Heureuse de te revoir !"
                : "Crée ton compte en quelques secondes."}
            </p>
          </div>

          {/* Carte des formulaires */}
          <div
            className="mt-7 surface-card animate-rise-in p-6 sm:p-7"
            style={{ animationDelay: "120ms" }}
          >
            <div
              role="tablist"
              aria-label="Connexion ou inscription"
              className="flex w-full rounded-full bg-ink/[0.04] p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Inscription
              </button>
            </div>

            <div className="mt-6">
              {mode === "login" ? (
                <LoginForm router={router} />
              ) : (
                <SignupForm router={router} />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type FormProps = {
  router: ReturnType<typeof useRouter>;
};

function LoginForm({ router }: FormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Email</span>
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

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Mot de passe</span>
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
  );
}

function SignupForm({ router }: FormProps) {
  const [displayName, setDisplayName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedName = displayName.trim();
    const normalizedHandle = normalizeInstagramHandle(instagramHandle);

    if (trimmedName.length === 0) {
      setError("Le pseudo est obligatoire.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: trimmedName,
          instagram_handle: normalizedHandle,
        },
      },
    });

    if (authError) {
      setError(translateSignupError(authError.message));
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Pseudo</span>
        <input
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={loading}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          @Instagram{" "}
          <span className="text-xs font-normal text-ink/50">
            (optionnel — le « @ » est ajouté automatiquement)
          </span>
        </span>
        <input
          type="text"
          value={instagramHandle}
          onChange={(e) => setInstagramHandle(e.target.value)}
          disabled={loading}
          placeholder="@ton.compte"
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Email</span>
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

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Mot de passe{" "}
          <span className="text-xs font-normal text-ink/50">
            (6 caractères minimum)
          </span>
        </span>
        <input
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
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
        {loading ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
