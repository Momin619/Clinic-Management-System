import { Link } from "react-router-dom";

export default function NotFound()
{
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 transition-colors duration-300 bg-white dark:bg-zinc-950">

      <h1 className="text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-zinc-900 to-zinc-400 dark:from-white dark:to-zinc-500 bg-clip-text">
        404 Not Found
      </h1>

      <div className="h-px my-5 rounded w-80 bg-gradient-to-r from-zinc-300 to-zinc-100 dark:from-zinc-600 dark:to-zinc-900 md:my-7" />

      <p className="max-w-lg text-center text-zinc-500 dark:text-zinc-400 md:text-xl">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/"
        className="group flex items-center gap-2 mt-10 font-medium px-7 py-2.5 rounded-full active:scale-95 transition-all
          bg-zinc-900 text-zinc-50 hover:bg-zinc-700
          dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Back to Home
        <svg className="group-hover:translate-x-0.5 transition" width="18" height="18" viewBox="0 0 22 22" fill="none">
          <path d="M4.583 11h12.833m0 0L11 4.584M17.416 11 11 17.417" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

    </div>
  );
}