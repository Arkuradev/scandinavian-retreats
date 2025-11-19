import { NavLink } from "react-router-dom";
import { HouseHeart, Search, Hotel, Tickets, User } from "lucide-react";
import { useEffect, useState } from "react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav() {
  const { isAuthenticated, user } = useAuth();
  const isLoggedIn = isAuthenticated;
  const isVenueManager = !!user?.venueManager;

  const [authOpen, setAuthOpen] = useState(false);

  const items = [
    { to: "/", label: "Home", icon: HouseHeart, show: true },
    { to: "/venues", label: "Venues", icon: Search, show: true },
    { to: "/bookings", label: "Bookings", icon: Tickets, show: isLoggedIn },
    {
      to: "/manage-venues",
      label: "Manage",
      icon: Hotel,
      show: isVenueManager,
    },
  ];

  // If user logs in while modal is open, close the modal
  useEffect(() => {
    if (isLoggedIn && authOpen) {
      setAuthOpen(false);
    }
  }, [isLoggedIn, authOpen]);

  return (
    <>
      <nav className="md:hidden fixed inset-x-0 bottom-0 border-t border-hz-border bg-hz-surface/95 backdrop-blur-sm z-40">
        <ul className="flex justify-around">
          {items
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to} className="flex-1">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "flex flex-col items-center justify-center py-2 text-[11px] font-medium transition-colors",
                        isActive
                          ? "text-hz-primary"
                          : "text-hz-muted hover:text-hz-primary/80",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-4 w-4 mb-0.5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}

          {/* Login button (icon + label) for logged-out users */}
          {!isLoggedIn && (
            <li className="flex-1">
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="flex flex-col items-center justify-center w-full py-2 text-[11px] font-medium text-hz-muted hover:text-hz-primary/80 transition-colors"
              >
                <User className="h-4 w-4 mb-0.5" />
                <span>Log in</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {authOpen && !isLoggedIn && (
        <AuthModal onClose={() => setAuthOpen(false)} />
      )}
    </>
  );
}
