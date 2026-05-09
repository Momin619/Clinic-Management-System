import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar()
{
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const navItems = [
    { label: "Add Appointment", href: "/add-appointment" },
    { label: "Services", href: "/services" },
    { label: "Apps", href: "/apps" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        * { font-family: "Geist", sans-serif; }
        @keyframes menuFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: menuFadeIn 0.18s ease forwards; }
      `}</style>

      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300 bg-white border-b dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 md:px-12 lg:px-24 xl:px-40">

        {/* Logo */}
        <Link to="/" className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
          Clinic
        </Link>

        {/* Desktop nav */}
        <div className="items-center hidden gap-1 px-1 py-1 border rounded-full md:flex bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${isActive(item.href)
                ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="items-center hidden gap-3 md:flex">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2.5 text-sm font-medium pl-5 pr-2 py-2
                  rounded-full cursor-pointer transition-colors
                  bg-zinc-900 text-zinc-50 hover:bg-zinc-700
                  dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Get started
                <span className="flex items-center justify-center bg-white rounded-full size-7 dark:bg-zinc-900">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700 dark:text-zinc-300" />
                  </svg>
                </span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className={`p-2 rounded-full transition-colors ${isActive("/settings")
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                title="Settings"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </Link>
              <Link
                to="/dashboard"
                className={`text-sm font-medium px-5 py-2 rounded-full cursor-pointer transition-colors ${isActive("/dashboard")
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-900 text-zinc-50 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  }`}
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`block w-6 h-0.5 bg-zinc-800 dark:bg-zinc-200 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-zinc-800 dark:bg-zinc-200 transition-all duration-200 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-zinc-800 dark:bg-zinc-200 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute left-0 z-50 flex flex-col w-full gap-1 p-4 bg-white border-t shadow-lg mobile-menu top-full dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 md:hidden">

            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive(item.href)
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col gap-1 pt-3 mt-1 border-t border-zinc-100 dark:border-zinc-800">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-sm text-zinc-500 dark:text-zinc-400
                      hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-medium px-5 py-2.5
                      rounded-full w-fit transition-colors mt-1
                      bg-zinc-900 text-zinc-50 hover:bg-zinc-700
                      dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Get started
                    <span className="flex items-center justify-center bg-white rounded-full size-7 dark:bg-zinc-900">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700 dark:text-zinc-300" />
                      </svg>
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive("/settings")
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium px-5 py-2.5
                      rounded-full w-fit transition-colors mt-1
                      bg-zinc-900 text-zinc-50 hover:bg-zinc-700
                      dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}