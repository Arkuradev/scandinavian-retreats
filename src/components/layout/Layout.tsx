import { Outlet } from "react-router-dom";
import MobileBottomNav from "@/components/MobileBottomNav";
import AppHeader from "@/components/AppHeader";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-hz-primary-body text-hz-text">
      <AppHeader /> {/* ⬅ no props */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <MobileBottomNav />
      <footer className="border-t border-hz-border py-6 text-center text-sm text-hz-muted">
        © {new Date().getFullYear()} Holidaze Retreats
      </footer>
    </div>
  );
}
