import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import GuestAnalysisPage from "../pages/public/GuestAnalysisPage";
import DashboardPage from "../pages/private/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
/* import useAuth from "../features/auth/useAuth"; */


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guest/analysis" element={<GuestAnalysisPage />} />

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