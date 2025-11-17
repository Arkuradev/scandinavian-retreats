import { Outlet } from "react-router-dom";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/ui/userMenu";
// import Navbar from "./Navbar";

export default function AppLayout() {
  const isLoggedIn = false;
  const isVenueManager = false;

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // const [authOpen, setAuthOpen] = useState(false);
  // const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 text-slate-800">
      <AppHeader onUserMenuToggle={() => setIsUserMenuOpen((prev) => !prev)} />

      {/* User menu placeholder */}
      {/* {isUserMenuOpen && (
        <UserMenu onClose={() => setIsUserMenuOpen(false)} />
      )} */}

      <main className="flex-1 pb-16">
        {/* pb-16 = space for mobile bottom nav */}
        <Outlet />
      </main>

      <MobileBottomNav
        isLoggedIn={isLoggedIn}
        isVenueManager={isVenueManager}
      />

      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Scandinavian Retreats - Temp Footer
      </footer>
    </div>
  );
}
