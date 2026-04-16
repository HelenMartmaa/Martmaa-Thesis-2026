import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function LoginForm({ successMessage }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Sends credentials to AuthContext and redirects on success
      await login({
        email: trimmedEmail,
        password,
      });

      setEmail("");
      setPassword("");

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="name@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="space-y-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>

        <div className="space-y-1 text-center">
          <Button type="button" variant="ghost" disabled className="h-auto p-0 text-sm">
            Forgot password?
          </Button>
          <p className="text-xs text-slate-500">This feature will be added later.</p>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;