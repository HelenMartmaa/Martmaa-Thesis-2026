import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthPanel() {
  const [mode, setMode] = useState("login");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const showLogin = () => {
    setMode("login");
  };

  const showRegister = () => {
    setMode("register");
    setSuccessMessage("");
  };

  const handleRegisterSuccess = () => {
    setSuccessMessage("Registration successful. Please sign in.");
    setMode("login");
  };

  const handleContinueAsGuest = () => {
    navigate("/guest/analysis");
  };

  return (
    <div>
      <div>
        <button type="button" onClick={showLogin}>
          Sign In
        </button>

        <button type="button" onClick={showRegister}>
          Register
        </button>
      </div>

      {mode === "login" && (
        <LoginForm successMessage={successMessage} />
      )}

      {mode === "register" && (
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      )}

      <div>
        <p>Or continue without an account:</p>

        <button type="button" onClick={handleContinueAsGuest}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

export default AuthPanel;