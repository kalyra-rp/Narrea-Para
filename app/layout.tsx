import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://narrea.vercel.app";
const SITE_NAME = "Narrea";
const DEFAULT_TITLE = "Narrea — Défis créatifs pour Paralives";
const DEFAULT_DESCRIPTION =
  "Des séries de défis créatifs pour ta partie Paralives. Du petit challenge express à la grande saga familiale : explore, joue, partage, gagne des badges.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Narrea",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Kalyra" }],
  creator: "Kalyra",
  keywords: [
    "Paralives",
    "défis",
    "challenges",
    "communauté",
    "Parafolks",
    "Narrea",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Narrea — Défis créatifs pour Paralives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@narrea.challenges",
  },
  robots: {
    index: true,
    follow: true,
  },
  // iOS standalone (« Add to Home Screen ») : titre affiché sous
  // l'icône + barre d'état stylée pour ressembler à une vraie app.
  appleWebApp: {
    title: "Narrea",
    statusBarStyle: "default",
    capable: true,
  },
  // Hint au navigateur : couleur de fond de fenêtre tant que la page
  // n'est pas peinte (anti-flash blanc sur fond crème).
  other: {
    "msapplication-TileColor": "#FF6A88",
  },
};

// L'export viewport (séparé de metadata dans les versions récentes de
// Next.js) pilote la couleur de la barre d'état mobile et le zoom.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FF6A88",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${baloo.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ink font-sans">
        <div className="halo-bg" aria-hidden="true" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
