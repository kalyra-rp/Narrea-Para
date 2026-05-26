"use client";

import Link from "next/link";
import { useState } from "react";
import type { Genre, Serie } from "@/lib/types";

type Props = {
  genres: Genre[];
  serie?: Serie;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

const INPUT_CLASS =
  "rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-base text-ink shadow-sm focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10";
const LABEL_CLASS = "flex flex-col gap-1.5 text-sm";
const LABEL_TEXT_CLASS = "font-semibold text-ink/80";
const HINT_CLASS = "text-xs font-normal text-ink/50";

function normalizeHex(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const cleaned = value.toLowerCase();
  return /^#[0-9a-f]{6}$/.test(cleaned) ? cleaned : fallback;
}

export default function SerieForm({
  genres,
  serie,
  action,
  submitLabel,
}: Props) {
  const [color1, setColor1] = useState(
    normalizeHex(serie?.coverColors[0], "#fbcfe8"),
  );
  const [color2, setColor2] = useState(
    normalizeHex(serie?.coverColors[1], "#c7d2fe"),
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Titre</span>
        <input
          name="title"
          type="text"
          required
          defaultValue={serie?.title ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Slug{" "}
          <span className={HINT_CLASS}>
            (dans l&apos;URL, ex. « cabanes-du-lac »)
          </span>
        </span>
        <input
          name="slug"
          type="text"
          required
          pattern="[a-z0-9-]+"
          title="Lettres minuscules, chiffres et tirets uniquement"
          defaultValue={serie?.slug ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Genre</span>
        <select
          name="genre_id"
          required
          defaultValue={serie?.genreId ?? ""}
          className={INPUT_CLASS}
        >
          <option value="" disabled>
            Choisis un genre…
          </option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.label}
            </option>
          ))}
        </select>
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Description</span>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={serie?.description ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Emoji{" "}
          <span className={HINT_CLASS}>(symbole qui représente la série)</span>
        </span>
        <input
          name="emoji"
          type="text"
          required
          maxLength={4}
          defaultValue={serie?.emoji ?? ""}
          className={`${INPUT_CLASS} w-24 text-center text-2xl`}
        />
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className={LABEL_CLASS}>
          <span className={LABEL_TEXT_CLASS}>Couleur 1</span>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="cover_color_1"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-xl border border-ink/15 bg-white p-1 shadow-sm"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => setColor1(e.target.value.toLowerCase())}
              pattern="#[0-9a-fA-F]{6}"
              className={`${INPUT_CLASS} flex-1 font-mono text-sm`}
            />
          </div>
        </label>

        <label className={LABEL_CLASS}>
          <span className={LABEL_TEXT_CLASS}>Couleur 2</span>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="cover_color_2"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-xl border border-ink/15 bg-white p-1 shadow-sm"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => setColor2(e.target.value.toLowerCase())}
              pattern="#[0-9a-fA-F]{6}"
              className={`${INPUT_CLASS} flex-1 font-mono text-sm`}
            />
          </div>
        </label>
      </div>

      <div className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Aperçu du dégradé</span>
        <div
          aria-hidden="true"
          className="h-24 w-full rounded-2xl border border-ink/10 shadow-sm"
          style={{
            background: `linear-gradient(150deg, ${color1}, ${color2})`,
          }}
        />
      </div>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Durée</span>
        <select
          name="duration"
          required
          defaultValue={serie?.duration ?? "moyen"}
          className={INPUT_CLASS}
        >
          <option value="express">Express</option>
          <option value="moyen">Moyen</option>
          <option value="saga">Saga</option>
        </select>
      </label>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={serie?.featured ?? false}
          className="h-5 w-5 cursor-pointer rounded border-ink/30 text-ink focus:ring-ink/20"
        />
        <span className={LABEL_TEXT_CLASS}>
          Mettre à l&apos;honneur sur l&apos;accueil
        </span>
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        <Link href="/admin" className="btn-secondary">
          Annuler
        </Link>
      </div>
    </form>
  );
}
