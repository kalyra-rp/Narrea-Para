import Link from "next/link";
import type { Badge } from "@/lib/types";

type Props = {
  badge?: Badge;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

const INPUT_CLASS =
  "rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-base text-ink shadow-sm focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10";
const LABEL_CLASS = "flex flex-col gap-1.5 text-sm";
const LABEL_TEXT_CLASS = "font-semibold text-ink/80";
const HINT_CLASS = "text-xs font-normal text-ink/50";

const conditionLabels: Record<Badge["conditionType"], string> = {
  completions_count: "Nombre de défis terminés",
  genre_explorer: "Diversité de genres explorés",
  serie_complete: "Série(s) complètement terminée(s)",
};

export default function BadgeForm({ badge, action, submitLabel }: Props) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {!badge && (
        <label className={LABEL_CLASS}>
          <span className={LABEL_TEXT_CLASS}>
            Identifiant{" "}
            <span className={HINT_CLASS}>
              (slug, ex. « first-defi » — non modifiable plus tard)
            </span>
          </span>
          <input
            name="id"
            type="text"
            required
            pattern="[a-z0-9-]+"
            title="Lettres minuscules, chiffres et tirets uniquement"
            className={INPUT_CLASS}
          />
        </label>
      )}

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Label</span>
        <input
          name="label"
          type="text"
          required
          defaultValue={badge?.label ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Description</span>
        <textarea
          name="description"
          required
          rows={2}
          defaultValue={badge?.description ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Emoji</span>
        <input
          name="emoji"
          type="text"
          required
          maxLength={4}
          defaultValue={badge?.emoji ?? ""}
          className={`${INPUT_CLASS} w-24 text-center text-2xl`}
        />
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className={LABEL_CLASS}>
          <span className={LABEL_TEXT_CLASS}>Type de condition</span>
          <select
            name="condition_type"
            required
            defaultValue={badge?.conditionType ?? "completions_count"}
            className={INPUT_CLASS}
          >
            {Object.entries(conditionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className={LABEL_CLASS}>
          <span className={LABEL_TEXT_CLASS}>
            Valeur{" "}
            <span className={HINT_CLASS}>
              (nombre de défis / de genres / de séries complètes)
            </span>
          </span>
          <input
            name="condition_value"
            type="number"
            min={1}
            required
            defaultValue={badge?.conditionValue ?? 1}
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Position{" "}
          <span className={HINT_CLASS}>(ordre d&apos;affichage)</span>
        </span>
        <input
          name="position"
          type="number"
          min={0}
          required
          defaultValue={badge?.position ?? 0}
          className={INPUT_CLASS}
        />
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
