import React, { createContext, useContext, useRef, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X as XIcon,
} from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";
export type ToastOptions = { duration?: number; role?: "polite" | "assertive" };
const DEFAULT_DURATION = 3000;

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
    throw new Error("useToastContext must be used within a ToastProvider");
  return ctx;
}

// Visual config for each toast type
function getToastVisuals(type: ToastType) {
  switch (type) {
    case "success":
      return {
        title: "Success",
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        accent: "bg-emerald-500/10 text-emerald-900",
        bar: "bg-emerald-500",
      };
    case "error":
      return {
        title: "Error",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        accent: "bg-red-500/10 text-red-900",
        bar: "bg-red-500",
      };
    case "info":
      return {
        title: "Info",
        icon: <Info className="h-5 w-5 text-sky-500" />,
        accent: "bg-sky-500/10 text-sky-900",
        bar: "bg-sky-500",
      };
    case "warning":
      return {
        title: "Warning",
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        accent: "bg-amber-500/10 text-amber-900",
        bar: "bg-amber-500",
      };
    default:
      return {
        title: "Notice",
        icon: <Info className="h-5 w-5 text-hz-primary" />,
        accent: "bg-hz-surface-soft text-hz-text",
        bar: "bg-hz-primary",
      };
  }
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
        className="
          fixed inset-x-0 bottom-4 flex flex-col items-center gap-3 
          sm:inset-auto sm:top-20 sm:right-5 sm:bottom-auto sm:left-auto sm:items-end
          z-[9999] pointer-events-none
        "
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => {
          const visual = getToastVisuals(t.type);

          return (
            <div
              key={t.id}
              className="
                pointer-events-auto w-full max-w-sm
                transform transition-all duration-300
                animate-[toast-enter_200ms_ease-out]
              "
            >
              <div
                className={`
                  relative overflow-hidden rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card
                  backdrop-blur-sm
                `}
                role="status"
                aria-live={t.role}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Escape") api.dismiss(t.id);
                }}
              >
                <div
                  className={`absolute inset-y-0 left-0 w-1 ${visual.bar}`}
                  aria-hidden="true"
                />

                <div className="pl-3 pr-3 py-3 sm:pl-4 sm:pr-4 sm:py-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        inline-flex items-center justify-center rounded-full p-1.5
                        ${visual.accent}
                      `}
                    >
                      {visual.icon}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-semibold text-hz-text">
                        {visual.title}
                      </p>
                      <p className="text-xs text-hz-muted leading-snug">
                        {t.message}
                      </p>
                    </div>

                    <button
                      className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-hz-muted hover:text-hz-text hover:bg-hz-surface-soft transition-colors"
                      aria-label="Dismiss notification"
                      onClick={() => api.dismiss(t.id)}
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
