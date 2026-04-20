import { useState } from "react";
import NewResultSetForm from "../../../components/analysis/NewResultSetForm";
import ResultEntriesSection from "../../../components/analysis/ResultEntriesSection";
import BackToTopButton from "../../../components/common/BackToTopButton";

// Page for creating a new result set and continuing directly to entries
function NewResultSetPage() {
  const [createdResultSet, setCreatedResultSet] = useState(null);

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          New Result Set
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Create a new analysis dataset and, once saved, continue directly to
          entering result values.
        </p>
      </div>

      <NewResultSetForm onCreateSuccess={setCreatedResultSet} />

      {createdResultSet && (
        <ResultEntriesSection
          resultSetId={createdResultSet.id}
          experimentId={createdResultSet.experimentId}
        />
      )}

      <BackToTopButton />
    </section>
  );
}

export default NewResultSetPage;