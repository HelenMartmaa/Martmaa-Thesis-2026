import AuthPanel from "../../components/auth/AuthPanel";
import heroLogo from "../../assets/logos/biostatlab-hero-transparent.png";

function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        {/* Left side: project introduction */}
        <section className="w-full min-w-0 max-w-2xl space-y-6">
          {/* Keeps semantic heading for accessibility */}
          <h1 className="sr-only">BioStatLab</h1>

          {/* Responsive logo */}
          <img
            src={heroLogo}
            alt="BioStatLab logo"
            className="h-auto w-full max-w-70 sm:max-w-85 lg:max-w-105"
          />

          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            A web application for planning biomedical <i>in vivo</i> and{" "}
            <i>in vitro</i> experiments, entering experimental results, and
            analyzing data with statistical methods and visual outputs.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-2 text-base font-semibold text-slate-900">
                For logged-in users
              </h2>
              <p className="text-sm text-slate-600">
                Save experiments, manage planned studies, and store analysis
                results linked to your account.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-2 text-base font-semibold text-slate-900">
                For guest users
              </h2>
              <p className="text-sm text-slate-600">
                Try the analysis tools without creating an account. Guest data
                is temporary and will not be saved.
              </p>
            </div>
          </div>
        </section>

        {/* Right side: authentication panel */}
        <section className="w-full max-w-md shrink-0">
          <AuthPanel />
        </section>
      </div>
    </main>
  );
}

export default HomePage;