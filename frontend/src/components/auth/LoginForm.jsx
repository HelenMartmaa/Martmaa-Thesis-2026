import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/useAuth";

function LoginForm({ successMessage }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.error || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign in</h3>

      {successMessage && <p>{successMessage}</p>}
      {error && <p>{error}</p>}

      <div>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
      </div>

      <button type="submit">Sign In</button>

      <div>
        <button type="button" disabled>
          Forgot password
        </button>
        <p>(This feature will be added later)</p>
      </div>
    </form>
  );
}

export default LoginForm;