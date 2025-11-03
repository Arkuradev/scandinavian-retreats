import { useState } from "react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    const nextErrors: typeof errors = {};
    if (!name) nextErrors.name = "Please enter a username.";
    if (name.trim().length < 3)
      nextErrors.name = "Username must be at least 3 characters long.";
    if (!email.includes("@"))
      nextErrors.email = "Please enter a valid email address.";
    if (!email.toLowerCase().endsWith("@stud.noroff.no"))
      nextErrors.email = "Email must end with @stud.noroff.no.";
    if (password.trim().length < 6)
      nextErrors.password = "Password must be at least 6 characters long.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.name ? "border-red-500" : "focus:ring-primary"}`}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors({ ...errors, name: undefined });
        }}
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      <input
        type="email"
        placeholder="Email"
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? "border-red-500" : "focus:ring-primary"}`}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors({ ...errors, email: undefined });
        }}
      />
      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      <input
        type="password"
        placeholder="Password"
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.password ? "border-red-500" : "focus:ring-primary"}`}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors({ ...errors, password: undefined });
        }}
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password}</p>
      )}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
        disabled={!name || !email || !password}
      >
        Register
      </button>
    </form>
  );
}
