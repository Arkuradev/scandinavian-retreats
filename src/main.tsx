import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ToastProvider from "@/components/ToastProvider";

import Layout from "./components/layout/Layout.tsx";
import Home from "./pages/Home.tsx";
import Venues from "./pages/Venues.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Account from "./pages/Account.tsx";
import NotFound from "./pages/NotFound.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "venues", element: <Venues /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "account", element: <Account /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </StrictMode>,
);
