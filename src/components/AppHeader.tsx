import { NavLink } from "react-router-dom";
import { useState } from "react";
import { User } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/ui/userMenu";

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

  // Come back here during polishing and hide links when logged off.
  // Also hide Manage Venues when account is not a Venue Manager.

  return (
    <>
      <header className="bg-white border-slate-200 shadow-lg sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center text-lg font-bold text-hz-text tracking-wide"
          >
            Holidaze Retreats
          </NavLink>

          <div className="flex items-center gap-2">
            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/" className={linkClass} end>
                Home
              </NavLink>
              <NavLink to="/venues" className={linkClass}>
                Venues
              </NavLink>
              <NavLink
                to="/bookings"
                className={linkClass}
                id="loggedInUserLink"
              >
                My bookings
              </NavLink>
              <NavLink
                to="/manage-venues"
                className={linkClass}
                id="loggedInVenueManager"
              >
                Manage Venue
              </NavLink>
            </nav>

            {/* User menu / auth button (always visible) */}
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
