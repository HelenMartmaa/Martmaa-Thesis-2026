import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../features/auth/useAuth";

function HomePage() {
  return (
    <div>
      <h1>Home page</h1>
      <p>Welcome to HM BioStatLab.</p>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
}

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;