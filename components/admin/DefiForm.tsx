import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Defi, Serie } from "@/lib/types";

type Props = {
  series: Serie[];
  defi?: Defi;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

const INPUT_CLASS =
  "rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-base text-ink shadow-sm focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10";

const LABEL_CLASS = "flex flex-col gap-1.5 text-sm";

const LABEL_TEXT_CLASS = "font-semibold text-ink/80";

const HINT_CLASS = "text-xs font-normal text-ink/50";

export default function DefiForm({ series, defi, action, submitLabel }: Props) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Titre</span>
        <input
          name="title"
          type="text"
          required
          defaultValue={defi?.title ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Slug{" "}
          <span className={HINT_CLASS}>
            (dans l&apos;URL, ex. « cabane-au-bord-du-lac »)
          </span>
        </span>
        <input
          name="slug"
          type="text"
          required
          pattern="[a-z0-9-]+"
          title="Lettres minuscules, chiffres et tirets uniquement"
          defaultValue={defi?.slug ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Série</span>
        <select
          name="serie_id"
          required
          defaultValue={defi?.serieId ?? ""}
          className={INPUT_CLASS}
        >
          <option value="" disabled>
            Choisis une série…
          </option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className={LABEL_CLASS}>
          <span className={LABEL_TEXT_CLASS}>Numéro d&apos;épisode</span>
          <input
            name="episode_number"
            type="number"
            min={1}
            required
            defaultValue={defi?.episodeNumber ?? 1}
            className={INPUT_CLASS}
          />
        </label>

        <label className={LABEL_CLASS}>
          <span className={LABEL_TEXT_CLASS}>Difficulté</span>
          <select
            name="difficulty"
            required
            defaultValue={defi?.difficulty ?? 1}
            className={INPUT_CLASS}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} ⭐
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Description</span>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={defi?.description ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Règles{" "}
          <span className={HINT_CLASS}>(une règle par ligne)</span>
        </span>
        <textarea
          name="rules"
          rows={6}
          defaultValue={defi?.rules.join("\n") ?? ""}
          className={`${INPUT_CLASS} font-mono text-sm`}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Hashtags{" "}
          <span className={HINT_CLASS}>(un par ligne, ex. « #NarreaBuild »)</span>
        </span>
        <textarea
          name="hashtags"
          rows={4}
          defaultValue={defi?.hashtags.join("\n") ?? ""}
          className={`${INPUT_CLASS} font-mono text-sm`}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Signature{" "}
          <span className={HINT_CLASS}>(le petit mot de Kalyra, optionnel)</span>
        </span>
        <textarea
          name="signature"
          rows={3}
          defaultValue={defi?.signature ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <div className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Image{" "}
          <span className={HINT_CLASS}>
            (optionnel — uploadée dans le bucket « defi-images »)
          </span>
        </span>
        <ImageUploader defaultUrl={defi?.imageUrl} />
      </div>

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
