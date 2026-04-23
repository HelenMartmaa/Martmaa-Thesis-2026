import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import GuestAnalysisPage from "../pages/public/GuestAnalysisPage";
import DashboardPage from "../pages/private/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import NewExperimentPage from "../pages/private/planning/NewExperimentPage";
import SavedExperimentsPage from "../pages/private/planning/SavedExperimentsPage";
import ExperimentDetailPage from "../pages/private/planning/ExperimentDetailPage";
import EditExperimentPage from "../pages/private/planning/EditExperimentPage";
import NewResultSetPage from "../pages/private/analysis/NewResultSetPage";
import SavedResultSetsPage from "../pages/private/analysis/SavedResultSetsPage";
import ResultSetDetailPage from "../pages/private/analysis/ResultSetDetailPage";
import EditResultSetPage from "../pages/private/analysis/EditResultSetPage";
import NewStatisticalAnalysisPage from "../pages/private/analysis/NewStatisticalAnalysisPage";
import SavedStatisticalAnalysesPage from "../pages/private/analysis/SavedStatisticalAnalysesPage";
import StatisticalAnalysisDetailPage from "../pages/private/analysis/StatisticalAnalysisDetailPage";

import PrivateLayout from "../layouts/PrivateLayout";
/* import useAuth from "../features/auth/useAuth"; */


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guest/analysis" element={<GuestAnalysisPage />} />

				<Route
					element={
						<ProtectedRoute>
							<PrivateLayout />
						</ProtectedRoute>
					}
				>
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/planning/new" element={<NewExperimentPage />} />
					<Route path="/planning/saved" element={<SavedExperimentsPage/>} />
					<Route path="/planning/:id" element={<ExperimentDetailPage />} />
					<Route path="/planning/:id/edit" element={<EditExperimentPage />} />
					<Route path="/analysis/new" element={<NewResultSetPage />} />
					<Route path="/analysis/saved" element={<SavedResultSetsPage />} />
					<Route path="/analysis/result-sets/:id" element={<ResultSetDetailPage />} />
					<Route path="/analysis/result-sets/:id/edit" element={<EditResultSetPage />} />
					<Route path="/analysis/result-sets/:resultSetId/run-analysis" element={<NewStatisticalAnalysisPage />} />
					<Route path="/analysis/statistical-analyses" element={<SavedStatisticalAnalysesPage />} />
					<Route path="/analysis/statistical-analyses/:id" element={<StatisticalAnalysisDetailPage />} />
				</Route>	

{/* 				<Route
					path="/analysis/new"
					element={
						<ProtectedRoute>
							<PlaceholderPage title="New Analysis Dataset" />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/analysis/saved"
					element={
						<ProtectedRoute>
							<PlaceholderPage title="Saved Analysis Datasets" />
						</ProtectedRoute>
					}
				/> */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Adding placeholders until the pages get developed
function PlaceholderPage({ title }) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-slate-600">This page will be implemented next.</p>
      </div>
    </main>
  );
}

export default AppRouter;