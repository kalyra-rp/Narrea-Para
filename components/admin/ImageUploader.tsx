"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  defaultUrl?: string | null;
};

const BUCKET = "defi-images";

function buildUniqueFilename(file: File): string {
  const cleaned = file.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  const safe = cleaned.length > 0 ? cleaned : "image";
  return `${Date.now()}-${safe}`;
}

export default function ImageUploader({ defaultUrl }: Props) {
  const [imageUrl, setImageUrl] = useState<string>(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const filename = buildUniqueFilename(file);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
      setImageUrl(data.publicUrl);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Erreur inconnue lors de l'upload",
      );
    } finally {
      setUploading(false);
      // Reset le champ file pour permettre de re-sélectionner le même fichier.
      event.target.value = "";
    }
  }

  function handleClear() {
    setImageUrl("");
    setError(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full cursor-pointer rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink/80 shadow-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <input type="hidden" name="image_url" value={imageUrl} />

      {uploading && (
        <p className="text-sm text-ink/60">Upload en cours…</p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {imageUrl && !uploading && (
        <div className="flex items-start gap-4">
          <div className="aspect-square w-32 overflow-hidden rounded-2xl border border-ink/10 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Aperçu de l'image"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-50"
          >
            Retirer l&apos;image
          </button>
        </div>
      )}
    </div>
  );
}
