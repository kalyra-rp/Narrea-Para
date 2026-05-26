"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function SerieCarousel({ children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Met à jour la visibilité des flèches en fonction de la position
  // de scroll. Tolère 8px de marge pour éviter le flicker en bord.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setCanLeft(el.scrollLeft > 8);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollByDirection(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="group relative">
      {canLeft && (
        <button
          type="button"
          onClick={() => scrollByDirection(-1)}
          aria-label="Faire défiler vers la gauche"
          className="absolute left-2 top-[40%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-ink shadow-lg opacity-0 transition group-hover:opacity-100 md:flex"
        >
          ◀
        </button>
      )}

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-proximity gap-4 overflow-x-auto px-6 pb-4 scroll-pl-6"
      >
        {children}
      </div>

      {canRight && (
        <button
          type="button"
          onClick={() => scrollByDirection(1)}
          aria-label="Faire défiler vers la droite"
          className="absolute right-2 top-[40%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-ink shadow-lg opacity-0 transition group-hover:opacity-100 md:flex"
        >
          ▶
        </button>
      )}
    </div>
  );
}
