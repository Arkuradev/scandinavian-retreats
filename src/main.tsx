import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ToastProvider from "@/components/ToastProvider";
import VenueDetailPage from "@/pages/VenueDetailPage";
import AuthProvider from "@/context/AuthContext";
import Layout from "./components/layout/Layout.tsx";
import Home from "./pages/Home.tsx";
import Venues from "./pages/Venues.tsx";
import MyBookingsPage from "@/pages/myBookingsPage";
import ManageVenuesPage from "@/pages/ManageVenuesPage";
import Account from "./pages/Account.tsx";
import NotFound from "./pages/NotFound.tsx";
import BookingDetailPage from "@/pages/BookingDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "venues", element: <Venues /> },
      { path: "venues/:id", element: <VenueDetailPage /> },
      { path: "bookings/:id", element: <BookingDetailPage /> },
      { path: "bookings", element: <MyBookingsPage /> },
      { path: "manage-venues", element: <ManageVenuesPage /> },
      { path: "account", element: <Account /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);
