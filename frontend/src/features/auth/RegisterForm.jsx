import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await register(formData);
      setMessage("Registration successful! You can now sign in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration unsuccessful.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="repeatPassword">Repeat Password</label>
        <input
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          value={formData.repeatPassword}
          onChange={handleChange}
          required
        />
      </div>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;