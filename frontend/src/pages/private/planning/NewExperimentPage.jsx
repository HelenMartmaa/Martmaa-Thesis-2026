import NewExperimentForm from "../../../components/planning/NewExperimentForm";

// Page for creating a new experiment
function NewExperimentPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-8 space-y-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            New Experiment
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Create a new experiment plan by entering the main details.
            Additional groups and subjects can be added in later steps.
          </p>
        </div>

        <NewExperimentForm />
      </div>
    </main>
  );
}

export default NewExperimentPage;