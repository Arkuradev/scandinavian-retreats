import type { AuthUser } from "@/types/auth";
import { useState } from "react";
import { User } from "lucide-react";
import { useToast } from "@/hooks/useToast";


export default function UserMenu({ 
    user, 
    onLogout 
}: { 
    user: AuthUser; 
    onLogout: () => void 
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
        {/* Keep icon or just the name – your call */}
        {/* <User className="w-5 h-5" /> */}
        <span><User className="w-5 h-5" /></span>
      </button>

      {openMenu && (
        <div
          id="user-menu"
          role="menu"
          className="absolute right-0 mt-6 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
        >
          <a
            href="#"
            role="menuitem"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            // later: link to /u/:username
          >
            {user.name}
          </a>
          <a
            href="#"
            role="menuitem"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a
            href="#"
            role="menuitem"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Profile
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpenMenu(false);
              onLogout();
              toast.info("You've been logged out");
            }}
            className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}