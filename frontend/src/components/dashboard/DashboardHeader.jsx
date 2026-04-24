import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../features/auth/useAuth";
import heroLogo from "../../assets/logos/biostatlab-light-transparent.png";
import { Button } from "../ui/button";

// Header navigation for authenticated users
function DashboardHeader() {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        {/* Mobile: hamburger button */}
        <div className="lg:hidden">
          <Button
            type="button"
            variant="ghost"
            className="h-11 w-11 rounded-xl p-0 text-xl"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            ☰
          </Button>
        </div>

        {/* Logo: centered in mobile view, left in desktop view*/}
        <div className="flex flex-1 items-center justify-center lg:justify-start">
          <Link to="/dashboard" aria-label="Go to dashboard" className="transition hover:opacity-90">
            <img
              src={heroLogo}
              alt="BioStatLab logo"
              className="h-auto w-44 sm:w-48 lg:w-56"
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          <div className="group relative">
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-2 text-m font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Planning
              <span className="text-xs text-slate-500">⮟</span>
            </button>

            <div className="invisible absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <Link
                to="/planning/new"
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                New Experiment
              </Link>
              <Link
                to="/planning/saved"
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Saved Experiments
              </Link>
            </div>
          </div>

          <div className="group relative">
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-2 text-m font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Result Datasets / Analysis
              <span className="text-xs text-slate-500">⮟</span>
            </button>

            <div className="invisible absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <Link
                to="/analysis/new"
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                New Result Dataset
              </Link>
              <Link
                to="/analysis/saved"
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Saved Result Datasets
              </Link>
              <Link
                to="/analysis/statistical-analyses/new"
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                New Statistical Analysis
              </Link>
              <Link
                to="/analysis/statistical-analyses"
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Saved Statistical Analyses
              </Link>
            </div>
          </div>
        </nav>

        {/* Desktop logout */}
        <div className="hidden flex-1 justify-end lg:flex">
          <Button type="button" variant="outline" onClick={logout}>
            Log Out
          </Button>
        </div>

        {/* Mobile spacer to keep logo visually centered */}
        <div className="w-11 lg:hidden" />
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:hidden">
          <div className="mx-auto w-full max-w-full space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-900">Planning</p>
              <div className="space-y-1">
                <Link
                  to="/planning/new"
                  className="block w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition active:scale-[0.99] active:bg-slate-200 hover:bg-slate-100 focus:bg-slate-100"
                >
                  New Experiment
                </Link>
                <Link
                  to="/planning/saved"
                  className="block w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition active:scale-[0.99] active:bg-slate-200 hover:bg-slate-100 focus:bg-slate-100"
                >
                  Saved Experiments
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-900">Result Datasets / Analysis</p>
              <div className="space-y-1">
                <Link
                  to="/analysis/new"
                  className="block w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition active:scale-[0.99] active:bg-slate-200 hover:bg-slate-100 focus:bg-slate-100"
                >
                  New Result Dataset
                </Link>
                <Link
                  to="/analysis/saved"
                  className="block w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition active:scale-[0.99] active:bg-slate-200 hover:bg-slate-100 focus:bg-slate-100"
                >
                  Saved Result Datasets
                </Link>
                <Link
                  to="/analysis/statistical-analyses/new"
                  className="block w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition active:scale-[0.99] active:bg-slate-200 hover:bg-slate-100 focus:bg-slate-100"
                >
                  New Statistical Analysis
                </Link>
                <Link
                  to="/analysis/statistical-analyses"
                  className="block w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition active:scale-[0.99] active:bg-slate-200 hover:bg-slate-100 focus:bg-slate-100"
                >
                  Saved Statistical Analyses
                </Link>
              </div>
            </div>

            <div className="pt-2">
              {/* Full-width logout button on mobile */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={logout}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;