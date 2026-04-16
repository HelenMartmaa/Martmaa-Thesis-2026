import { useState } from "react";
import useAuth from "../../features/auth/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function RegisterForm({ onRegisterSuccess }) {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = formData.email.trim().toLowerCase();

    if (!trimmedEmail || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Sends registration data through AuthContext
      await register({
        email: trimmedEmail,
        password: formData.password,
      });

      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });

      onRegisterSuccess();
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="name@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="Create a password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-confirm-password">Repeat password</Label>
        <Input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="Repeat your password"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
}

export default RegisterForm;