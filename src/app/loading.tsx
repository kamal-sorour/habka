export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 pt-8">
      {/* Hero skeleton */}
      <div className="flex flex-col items-center gap-5 pb-12">
        <div className="h-6 w-48 animate-pulse rounded-full border border-white/5 bg-white/[0.04]" />
        <div className="h-12 w-full max-w-md animate-pulse rounded-2xl border border-white/5 bg-white/[0.04]" />
        <div className="h-4 w-72 animate-pulse rounded-lg border border-white/5 bg-white/[0.03]" />
        <div className="h-14 w-full max-w-2xl animate-pulse rounded-2xl border border-white/5 bg-white/[0.05]" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-3 space-y-3"
          >
            <div
              className="h-[210px] w-full animate-pulse rounded-xl bg-white/[0.04]"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div className="h-4 w-4/5 animate-pulse rounded-md bg-white/[0.05]" />
            <div className="h-3 w-1/3 animate-pulse rounded-md bg-white/[0.03]" />
          </div>
        ))}
      </div>
    </div>
  );
}
