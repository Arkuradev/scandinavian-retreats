import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

/**
 * Authentication modal component.
 *
 * Shows a modal that allows the user to either log in or register.
 * Includes a smooth fade/slide animation and an animated toggle switch.
 *
 * @param {Object} props
 * @param {() => void} props.onClose - Called when the modal should be closed.
 * @returns {JSX.Element} AuthModal component.
 */
export default function AuthModal({ onClose }: { onClose: () => void }) {
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

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        visible ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
      }`}
    >
      <div
        className={`bg-hz-surface-soft rounded-2xl w-full max-w-md p-6 shadow-lg relative transform transition-all duration-300 ease-out ${
          visible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 font-bold text-hz-text hover:text-hz-accent"
        >
          ✕
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative flex bg-gray-100 rounded-full p-1 w-60">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-hz-primary transition-transform duration-300 ease-in-out ${
                isLogin ? "translate-x-0" : "translate-x-full"
              }`}
            ></div>

            <button
              onClick={() => setIsLogin(true)}
              className={`relative  z-10 flex-1 py-2 text-sm font-medium transition-colors ${
                isLogin ? "text-black/70" : "text-hz-muted"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors ${
                !isLogin ? "text-black/70" : "text-hz-muted"
              }`}
            >
              Register
            </button>
          </div>
        </div>
        {isLogin ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSuccess={onClose} />
        )}
      </div>
    </div>
  );
}
