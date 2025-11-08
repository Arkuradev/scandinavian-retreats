import React, { createContext, useContext, useRef, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";
export type ToastOptions = { duration?: number; role?: "polite" | "assertive" };
const DEFAULT_DURATION = 4000;

export type ToastAPI = {
  show: (type: ToastType, message: string, opts?: ToastOptions) => string;
  success: (message: string, opts?: ToastOptions) => string;
  error: (message: string, opts?: ToastOptions) => string;
  info: (message: string, opts?: ToastOptions) => string;
  warning: (message: string, opts?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
};

type ToastRecord = {
  id: string;
  type: ToastType;
  message: string;
  role: "polite" | "assertive";
  duration: number;
  createdAt: number;
};

const ToastContext = createContext<ToastAPI | null>(null);

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useToastContext must be used within a ToastProvider"); //Might be removed if not needed.
  return ctx;
}

function getToastClasses(type: ToastType) {
  switch (type) {
    case "success":
      return "border-green-500 bg-green-50 text-green-800";
    case "error":
      return "border-red-500 bg-red-50 text-red-800";
    case "info":
      return "border-blue-500 bg-blue-50 text-blue-800";
    case "warning":
      return "border-yellow-500 bg-yellow-50 text-yellow-800";
    default:
      return "border-gray-300 bg-white text-gray-900";
  } // Make sure to move this function to a new file when re-styling the toasts. /lib/ui.ts
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  React.useEffect(() => {
    return () => {
      timers.current.forEach((tid) => clearTimeout(tid));
      timers.current.clear();
    };
  }, []);

  function genId() {
    return Math.random().toString(36).slice(2);
  }

  const api: ToastAPI = {
    show: (type, message, opts) => {
      const id = genId();
      const duration = opts?.duration ?? DEFAULT_DURATION;
      const role = opts?.role ?? (type === "error" ? "assertive" : "polite");

      const record: ToastRecord = {
        id,
        type,
        message,
        role,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, record]);

      const tid = setTimeout(() => api.dismiss(id), duration);
      timers.current.set(id, tid);

      return id;
    },

    success: (message, opts) => api.show("success", message, opts),
    error: (message, opts) => api.show("error", message, opts),
    info: (message, opts) => api.show("info", message, opts),
    warning: (message, opts) => api.show("warning", message, opts),

    dismiss: (id) => {
      const tid = timers.current.get(id);
      if (tid) {
        clearTimeout(tid);
        timers.current.delete(id);
      }
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },

    clearAll: () => {
      timers.current.forEach((tid) => clearTimeout(tid));
      timers.current.clear();
      setToasts([]);
    },
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg border p-3 shadow transition-all duration-300 ${getToastClasses(t.type)}`}
            role="status"
            aria-live={t.role}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Escape") api.dismiss(t.id);
            }}
          >
            <div className="flex items-start gap-2">
              <strong className="capitalize">{t.type}</strong>
              <button
                className="ml-auto rounded px-2 py-1 text-sm"
                aria-label="Dismiss notification"
                onClick={() => api.dismiss(t.id)}
              >
                ×
              </button>
            </div>
            <div>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
