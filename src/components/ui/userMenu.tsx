import type { AuthUser } from "@/types/auth";
import { useState } from "react";
import { User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useToast } from "@/hooks/useToast";

type UserMenuProps = {
  user: AuthUser;
  onLogout: () => void;
};

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const toast = useToast();

  const initial = user.name?.charAt(0).toUpperCase() ?? "U";

  function closeMenu() {
    setOpenMenu(false);
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpenMenu((v) => !v)}
        className="
          flex items-center gap-2 px-2.5 py-1.5
          rounded-full border border-hz-border bg-hz-surface
          shadow-sm
          text-sm font-medium text-hz-text
          hover:bg-hz-primary-soft/60 hover:border-hz-primary
          transition-all
        "
        aria-haspopup="menu"
        aria-expanded={openMenu}
        aria-controls="user-menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-hz-primary text-hz-text text-xs font-semibold">
          {initial}
        </span>
        <span className="hidden sm:inline-block max-w-[120px] truncate">
          {user.name}
        </span>
        <User className="w-4 h-4 text-hz-primary" aria-hidden="true" />
      </button>

      {openMenu && (
        <div
          id="user-menu"
          role="menu"
          className="
            absolute right-0 mt-3 w-60 z-50
            rounded-2xl border border-hz-border bg-hz-surface
            shadow-hz-card overflow-hidden
          "
        >
          {/* Top: identity */}
          <div className="border-b border-hz-border/70 bg-hz-surface-soft px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-hz-muted">
              Signed in as
            </p>
            <NavLink
              to={`/profile/${encodeURIComponent(user.name)}`}
              role="menuitem"
              onClick={closeMenu}
              className="mt-1 block text-sm font-semibold text-hz-text hover:text-hz-primary"
            >
              {user.name}
            </NavLink>
          </div>

          {/* Links */}
          <div className="py-1">
            <NavLink
              to="/profile/edit"
              role="menuitem"
              onClick={closeMenu}
              className="block px-4 py-2 text-sm text-hz-text hover:bg-hz-primary-soft/50 hover:text-hz-primary"
            >
              Edit profile
            </NavLink>

            {user.venueManager && (
              <NavLink
                to="/manage-venues"
                role="menuitem"
                onClick={closeMenu}
                className="block px-4 py-2 text-sm text-hz-text hover:bg-hz-primary-soft/50 hover:text-hz-primary"
              >
                Manage venues
              </NavLink>
            )}
          </div>

          {/* Logout */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              closeMenu();
              onLogout();
              toast.info("You've been logged out");
            }}
            className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-hz-primary-soft/40"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
