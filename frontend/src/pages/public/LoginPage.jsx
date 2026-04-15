import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <form>
      <div>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" />
      </div>

      <div>
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" />
      </div>

      <div>
        <button type="submit">Sign In</button>
      </div>

      <p>
        <a href="#">Forgot password?</a>
      </p>
    </form>
  );
}

export default LoginForm;