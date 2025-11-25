import type { AuthUser } from "@/types/auth";
import { useState } from "react";
import { User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useToast } from "@/hooks/useToast";

export default function UserMenu({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void;
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const toast = useToast();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenMenu((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-scandi-gradient-hover transition-all"
        aria-haspopup="menu"
        aria-expanded={openMenu}
        aria-controls="user-menu"
      >
        <User className="w-5 h-5 text-hz-primary" />
      </button>

      {openMenu && (
        <div
          id="user-menu"
          role="menu"
          className="absolute right-0 mt-2 w-48 z-50 rounded-md bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
        >
          <div className="border-b border-gray-100">
            <div className="px-4 py-2 text-xs text-gray-500">Signed in as</div>
            <div className="px-4 pb-2 text-sm font-medium text-gray-900">
              <NavLink
                to={`/profile/${user.name}`}
                role="menuitem"
                onClick={() => setOpenMenu(false)}
                className="hover:text-hz-primary"
              >
                {user.name}
              </NavLink>
            </div>
          </div>

          <NavLink
            to={`/profile/edit`}
            role="menuitem"
            className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
            onClick={() => setOpenMenu(false)}
          >
            Edit Profile
          </NavLink>

          <NavLink
            to="/dashboard"
            role="menuitem"
            className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
            onClick={() => setOpenMenu(false)}
          >
            Dashboard
          </NavLink>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpenMenu(false);
              onLogout();
              toast.info("You've been logged out");
            }}
            className="w-full text-left block px-4 py-2 text-sm text-black hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
