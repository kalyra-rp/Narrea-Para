import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Creation, CreationCategory } from "@/lib/types";

type Props = {
  creation?: Creation;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

const INPUT_CLASS =
  "rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-base text-ink shadow-sm focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10";

const LABEL_CLASS = "flex flex-col gap-1.5 text-sm";

const LABEL_TEXT_CLASS = "font-semibold text-ink/80";

const HINT_CLASS = "text-xs font-normal text-ink/50";

const CATEGORY_OPTIONS: { value: CreationCategory; label: string }[] = [
  { value: "parafolk", label: "🧍 Parafolk" },
  { value: "maison", label: "🏠 Maison" },
  { value: "terrain", label: "🌳 Terrain communautaire" },
];

export default function CreationForm({
  creation,
  action,
  submitLabel,
}: Props) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Titre</span>
        <input
          name="title"
          type="text"
          required
          defaultValue={creation?.title ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Slug{" "}
          <span className={HINT_CLASS}>
            (identifiant court, ex. « maison-en-bord-de-lac »)
          </span>
        </span>
        <input
          name="slug"
          type="text"
          required
          pattern="[a-z0-9-]+"
          title="Lettres minuscules, chiffres et tirets uniquement"
          defaultValue={creation?.slug ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>Catégorie</span>
        <select
          name="category"
          required
          defaultValue={creation?.category ?? ""}
          className={INPUT_CLASS}
        >
          <option value="" disabled>
            Choisis une catégorie…
          </option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
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
          defaultValue={creation?.description ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <div className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Image{" "}
          <span className={HINT_CLASS}>
            (uploadée dans le bucket « creation-images »)
          </span>
        </span>
        <ImageUploader
          defaultUrl={creation?.imageUrl}
          bucket="creation-images"
        />
      </div>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Lien Steam Workshop{" "}
          <span className={HINT_CLASS}>(URL complète, https://…)</span>
        </span>
        <input
          name="workshop_url"
          type="url"
          required
          placeholder="https://steamcommunity.com/sharedfiles/filedetails/?id=…"
          defaultValue={creation?.workshopUrl ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        <span className={LABEL_TEXT_CLASS}>
          Tags{" "}
          <span className={HINT_CLASS}>
            (un par ligne, sans le « # », ex. « cottage »)
          </span>
        </span>
        <textarea
          name="tags"
          rows={4}
          defaultValue={creation?.tags.join("\n") ?? ""}
          className={`${INPUT_CLASS} font-mono text-sm`}
        />
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className={LABEL_CLASS}>
          <span className={LABEL_TEXT_CLASS}>
            Compteur{" "}
            <span className={HINT_CLASS}>(ex. « ⬇️ 1.2k »)</span>
          </span>
          <input
            name="counter_label"
            type="text"
            defaultValue={creation?.counterLabel ?? ""}
            className={INPUT_CLASS}
          />
        </label>

        <label className={LABEL_CLASS}>
          <span className={LABEL_TEXT_CLASS}>
            Position{" "}
            <span className={HINT_CLASS}>(0 = en premier)</span>
          </span>
          <input
            name="position"
            type="number"
            min={0}
            defaultValue={creation?.position ?? 0}
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={creation?.featured ?? false}
          className="h-4 w-4 rounded border-ink/20 text-ink focus:ring-ink/20"
        />
        <span className={LABEL_TEXT_CLASS}>
          Coup de cœur{" "}
          <span className={HINT_CLASS}>(badge sur la carte)</span>
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
