import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import GuestModeNotice from "../guest/GuestModeNotice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

function AuthPanel() {
  // Controls which form is currently visible
  const [mode, setMode] = useState("login");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleShowLogin = () => {
    setMode("login");
  };

  const handleShowRegister = () => {
    setMode("register");
    setSuccessMessage("");
  };

  const handleRegisterSuccess = () => {
    setSuccessMessage("Registration successful. Please sign in.");
    setMode("login");
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-lg">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription className="text-sm leading-6">
          Sign in to save experiments and analyses, register for a new account,
          or continue as a guest to use temporary analysis tools.
        </CardDescription>

        {/* Toggle buttons for switching between login and register */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={mode === "login" ? "default" : "outline"}
            onClick={handleShowLogin}
          >
            Sign In
          </Button>

          <Button
            type="button"
            variant={mode === "register" ? "default" : "outline"}
            onClick={handleShowRegister}
          >
            Register
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Renders one form at a time */}
        {mode === "login" ? (
          <LoginForm successMessage={successMessage} />
        ) : (
          <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
        )}

        <Separator />

        <div className="space-y-4">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => navigate("/guest/analysis")}
          >
            Continue as Guest
          </Button>

          <GuestModeNotice />
        </div>
      </CardContent>
    </Card>
  );
}

export default AuthPanel;