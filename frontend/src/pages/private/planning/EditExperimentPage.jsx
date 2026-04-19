import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getExperimentByIdRequest } from "../../../features/planning/planningApi";
import NewExperimentForm from "../../../components/planning/NewExperimentForm";
import { Button } from "../../../components/ui/button";

// Page for editing an existing experiment
function EditExperimentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [experiment, setExperiment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperiment = async () => {
      try {
        const data = await getExperimentByIdRequest(id, token);
        setExperiment(data.experiment);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load experiment.");
      } finally {
        setLoading(false);
      }
    };

    loadExperiment();
  }, [id, token]);

  return (
    <section className="space-y-6">
      <div>
        <Button asChild variant="outline">
          <Link to={`/planning/${id}`}>← Back to Experiment Details</Link>
        </Button>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Update Experiment
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Edit the main information of this experiment plan.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading experiment...</p>}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && experiment && (
        <NewExperimentForm
          mode="edit"
          experimentId={id}
          initialData={experiment}
          onSuccess={() => navigate(`/planning/${id}`)}
        />
      )}
    </section>
  );
}

export default EditExperimentPage;