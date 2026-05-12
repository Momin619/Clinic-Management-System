import React from "react";

type PaginationProps = {
  page: number;
  pages: number;
  onChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pages,
  onChange,
}) =>
{
  // ─────────────────────────────
  // SAFETY CHECKS (VERY IMPORTANT)

  const safePage = page > 0 ? page : 1;
  const safePages = pages > 0 ? pages : 1;
  // ─────────────────────────────
  // HANDLERS
  // ─────────────────────────────
  const goPrev = () =>
  {
    if (safePage > 1)
    {
      onChange(safePage - 1);
    }
  };

  const goNext = () =>
  {
    if (safePage < safePages)
    {
      onChange(safePage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {/* PREVIOUS BUTTON */}
      <button
        onClick={goPrev}
        disabled={safePage === 1}
        className="px-3 py-1 text-black bg-white border rounded dark:bg-zinc-900 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* PAGE INDICATOR */}
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Page {safePage} of {safePages}
      </span>

      {/* NEXT BUTTON */}
      <button
        onClick={goNext}
        disabled={safePage === safePages}
        className="px-3 py-1 text-black bg-white border rounded dark:bg-zinc-900 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}; 