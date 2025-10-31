import { useEffect, useState } from "react";

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
    setTimeout(() => onClose(), 200);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        visible ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl w-full max-w-md p-6 shadow-lg relative transform transition-all duration-300 ease-out ${
          visible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative flex bg-gray-100 rounded-full p-1 w-60">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-300 ease-in-out ${
                isLogin ? "translate-x-0" : "translate-x-full"
              }`}
            ></div>

            <button
              onClick={() => setIsLogin(true)}
              className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors ${
                isLogin ? "text-white" : "text-gray-600"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors ${
                !isLogin ? "text-white" : "text-gray-600"
              }`}
            >
              Register
            </button>
          </div>
        </div>
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
/**
 * Login Form component.
 * Displays input fields for username and password, and a submit button.
 * Intended for use inside the AuthModal component.
 *
 * @returns {JSX.Element} Login form JSX structure.
 */
function LoginForm() {
  return (
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
      >
        Log In
      </button>
    </form>
  );
}
/**
 * Register Form component.
 * Displays input fields for username, email, and password, along with a submit button.
 * Intended for use inside the AuthModal component.
 * @returns {JSX.Element} Register form JSX structure.
 */
function RegisterForm() {
  return (
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
      >
        Register
      </button>
    </form>
  );
}
