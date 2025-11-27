import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthModalProps = {
  onClose: () => void;
};

export default function AuthModal({ onClose }: AuthModalProps) {
  const [visible, setVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 150);
  };

  const title = isLogin ? "Welcome back" : "Create your account";

  const subtitle = isLogin
    ? "Log in to manage your bookings, save your favourite retreats, and keep track of your trips."
    : "Choose if you’re registering as a guest or a venue manager. You can list and manage retreats as a venue manager.";

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${
        visible ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
      } overflow-y-auto`}
    >
      <div className="flex min-h-full items-start sm:items-center justify-center p-4">
        <div
          className={`relative w-full max-w-xl bg-hz-primary-body rounded-2xl shadow-2xl border border-hz-border/60 transform transition-all duration-300 ease-out
            ${
              visible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-8 opacity-0 scale-95"
            }
            max-h-[calc(100vh-2rem)] overflow-y-auto
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-hz-text bg-hz-surface hover:text-white hover:bg-hz-accent border border-hz-border/60 transition-colors"
            aria-label="Close authentication dialog"
          >
            ✕
          </button>

          <div className="px-6 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-8 space-y-6">
            <header className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-hz-text/80">
                Holidaze Retreats
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold text-hz-text">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-hz-muted max-w-md">
                {subtitle}
              </p>
            </header>
            <div className="flex justify-center">
              <div className="relative flex bg-hz-surface rounded-full p-1 w-full max-w-xs border border-hz-border/70">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-hz-primary/90 shadow-sm transition-transform duration-300 ease-in-out ${
                    isLogin ? "translate-x-0" : "translate-x-full"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`relative z-10 flex-1 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    isLogin ? "text-hz-text" : "text-hz-muted"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`relative z-10 flex-1 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    !isLogin ? "text-hz-text" : "text-hz-muted"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>
            <div className="border-t border-hz-border/60 pt-5">
              {isLogin ? (
                <LoginForm onSuccess={handleClose} />
              ) : (
                <RegisterForm onSuccess={handleClose} />
              )}
            </div>
            {!isLogin && (
              <p className="text-[11px] sm:text-xs text-hz-muted text-center">
                <span className="font-medium text-hz-text">Guests</span> can
                book retreats.{" "}
                <span className="font-medium text-hz-text">Venue managers</span>{" "}
                can list and manage their own retreats.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
