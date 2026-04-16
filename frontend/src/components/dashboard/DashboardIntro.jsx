import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

// Main instructional content for dashboard
function DashboardIntro() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Dashboard
        </h1>

        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base lg:text-lg">
          Welcome to BioStatLab. Use the planning and analysis modules to create
          new entries or review previously saved data linked to your account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Planning Module</CardTitle>
            <CardDescription>
              Create and manage experimental plans.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Select{" "}
              <span className="font-medium text-slate-900">New Experiment</span>{" "}
              to create a new experimental plan.
            </p>

            <p>
              Select{" "}
              <span className="font-medium text-slate-900">
                Saved Experiments
              </span>{" "}
              to view and continue working with previously saved plans.
            </p>

            <p>
              Use this module to organize experiment type, groups, subjects, and
              the planned study structure.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Analysis Module</CardTitle>
            <CardDescription>
              Enter, analyze, and review experimental results.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Select{" "}
              <span className="font-medium text-slate-900">New Analysis</span>{" "}
              to enter fresh result data and run statistical calculations.
            </p>

            <p>
              Select{" "}
              <span className="font-medium text-slate-900">
                Saved Analyses
              </span>{" "}
              to open previously stored analysis results.
            </p>

            <p>
              This module will support descriptive statistics, statistical tests,
              and visual data outputs.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default DashboardIntro;