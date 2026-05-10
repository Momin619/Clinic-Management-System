const SkeletonCard = () => (
  <div className="p-5 space-y-4 bg-white border rounded-xl border-neutral-100 dark:border-zinc-800 dark:bg-zinc-950 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-1.5">
        <div className="w-32 h-4 rounded bg-neutral-200 dark:bg-zinc-700" />
        <div className="w-24 h-3 rounded bg-neutral-100 dark:bg-zinc-800" />
      </div>
      <div className="w-20 h-5 rounded-full bg-neutral-100 dark:bg-zinc-800" />
    </div>
    <hr className="border-neutral-100 dark:border-zinc-800" />
    <div className="grid grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="h-2.5 w-10 bg-neutral-100 dark:bg-zinc-800 rounded" />
          <div className="h-3.5 w-20 bg-neutral-200 dark:bg-zinc-700 rounded" />
        </div>
      ))}
    </div>
    <div className="w-full rounded-lg h-9 bg-neutral-200 dark:bg-zinc-700" />
  </div>
);
export default SkeletonCard