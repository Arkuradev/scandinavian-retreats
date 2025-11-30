import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/layout/Footer";

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-hz-primary-body text-hz-text">
      <AppHeader />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <MobileBottomNav />
      <Footer />
    </div>
  );
}
