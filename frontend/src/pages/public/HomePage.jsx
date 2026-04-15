import AuthPanel from "../../components/auth/AuthPanel";

function HomePage() {
  return (
    <main>
      <section>
        <h1>BioStatLab</h1>
        <p>
          A web application for planning biomedical <i>in vivo</i> and <i>in vitro</i> experiments and analyzing
          experimental data with statistical methods and visual outputs.
        </p>
      </section>

      <section>
        <h2>Welcome 🧪</h2>
        <p>
          Sign in to manage experiments and save analyses, or continue as a
          guest to use the analysis tools without saving data.
        </p>

        <AuthPanel />
      </section>
    </main>
  );
}

export default HomePage;