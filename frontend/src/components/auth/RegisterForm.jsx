import { useState } from "react";
import useAuth from "../../features/auth/useAuth";

function RegisterForm({ onRegisterSuccess }) {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        email: formData.email,
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create account</h3>

      {error && <p>{error}</p>}

      <div>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
      </div>

      <div>
        <label htmlFor="register-confirm-password">Repeat password</label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;