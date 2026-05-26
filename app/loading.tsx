export default function Loading() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="w-full">
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center sm:py-32">
          <span
            aria-hidden="true"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-violet-200 text-2xl animate-pulse"
          >
            🎬
          </span>
          <p className="mt-4 text-sm font-medium text-ink/60">
            Chargement…
          </p>
        </div>
      </section>
    </main>
  );
}
