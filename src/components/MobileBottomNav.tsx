import { NavLink } from "react-router-dom";

type MobileBottomNavProps = {
  isLoggedIn: boolean;
  isVenueManager: boolean;
};

export default function MobileBottomNav({
  isLoggedIn,
  isVenueManager,
}: MobileBottomNavProps) {
  const items = [
    { to: "/", label: "Home", show: true },
    { to: "/venues", label: "Venues", show: true },
    { to: "/bookings", label: "Bookings", show: isLoggedIn },
    { to: "/manage-venues", label: "Manage Venues", show: isVenueManager },
    { to: "/login", label: "Log in", show: !isLoggedIn },
  ];

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm z-40">
      <ul className="flex justify-aorund">
        {items
          .filter((item) => item.show)
          .map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex flex-col items-center justify-center py-2 text-xs font-medium transition-colors",
                    isActive ? "text-blue-400" : "text-slate-400",
                  ].join(" ")
                }
              >
                {/* Adding Icons here later */}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}
