export default function Loading() {
  return (
    <div className="container-page py-16" role="status" aria-label="Loading">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-white/6" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-[1.25rem] border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}
