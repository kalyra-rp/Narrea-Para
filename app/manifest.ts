import type { MetadataRoute } from "next";

// Web App Manifest — sert à rendre le site installable sur l'écran
// d'accueil des téléphones (PWA). Servi automatiquement par Next.js
// à l'URL /manifest.webmanifest et référencé dans le <head>.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Narrea — Défis créatifs pour Paralives",
    short_name: "Narrea",
    description:
      "Des séries de défis créatifs pour ta partie Paralives. Joue, partage, gagne des badges.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF8F3",
    theme_color: "#FF6A88",
    lang: "fr-FR",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["games", "lifestyle", "entertainment"],
  };
}
