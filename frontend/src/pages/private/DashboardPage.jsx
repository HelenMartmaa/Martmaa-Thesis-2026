import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardIntro from "../../components/dashboard/DashboardIntro";

// Main dashboard page for authenticated users
function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
        <DashboardIntro />
      </div>
    </main>
  );
}

export default DashboardPage;