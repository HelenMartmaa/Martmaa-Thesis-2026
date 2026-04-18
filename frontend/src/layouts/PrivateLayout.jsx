import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/dashboard/DashboardHeader";

// Shared layout for all authenticated pages
function PrivateLayout() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <DashboardHeader />

            <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-6 xl:px-8">
                <Outlet />
            </div>
        </main>
    );
}

export default PrivateLayout;