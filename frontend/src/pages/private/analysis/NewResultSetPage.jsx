import NewResultSetForm from "../../../components/analysis/NewResultSetForm";
import BackToTopButton from "../../../components/common/BackToTopButton";

// Page for creating a new result set
function NewResultSetPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          New Result Set
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Create a new analysis dataset and optionally connect it to one of your
          existing experiments.
        </p>
      </div>

      <NewResultSetForm />
      <BackToTopButton />
    </section>
  );
}

export default NewResultSetPage;