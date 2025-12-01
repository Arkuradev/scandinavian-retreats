import { NavLink } from "react-router-dom";
import { useState } from "react";
import { User } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/ui/userMenu";
import logo from "@/assets/logo.png";

const linkBase =
  "relative px-3 py-1 text-sm font-medium text-hz-text transition-all duration-200";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `
    ${linkBase}
    ${
      isActive
        ? `
        text-hz-primary after:hover:bg-hz-primary/60
        after:absolute after:left-0 after:bottom-0 
        after:h-[3px] after:bg-hz-primary after:rounded-full 
        after:w-full after:transition-all after:duration-300
        `
        : `
        hover:text-hz-primary/80 after:hover:bg-hz-primary/60
        after:absolute after:left-0 after:bottom-0 
        after:h-[3px] after:bg-hz-primary 
        after:w-0 after:transition-all after:duration-300 
        hover:after:w-full 
        `
    }
  `;

export default function AppHeader() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <>
      <header className="bg-hz-surface border-slate-200 shadow-lg sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center gap-3 font-bold text-hz-text tracking-wide"
          >
            <div className="h-[50px] w-[50px] flex items-center justify-center rounded-full">
              <img
                loading="lazy"
                src={logo}
                alt="Holidaze logo"
                className="h-14 w-14 object-contain"
              />
            </div>
            <span className="text-lg">Holidaze Retreats</span>
          </NavLink>

          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/" className={linkClass} end>
                Home
              </NavLink>
              <NavLink to="/venues" className={linkClass}>
                Venues
              </NavLink>

              {isAuthenticated && (
                <NavLink
                  to="/bookings"
                  className={linkClass}
                  id="loggedInUserLink"
                >
                  My bookings
                </NavLink>
              )}
            </nav>

            {isAuthenticated && user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className={`${linkBase} text-black hover:scale-105 hover:text-hz-accent transition-all duration-150 flex items-center justify-center`}
                aria-label="Open login/register"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
