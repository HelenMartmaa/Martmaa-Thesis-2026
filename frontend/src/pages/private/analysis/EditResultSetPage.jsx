import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getResultSetByIdRequest } from "../../../features/analysis/resultSetApi";
import NewResultSetForm from "../../../components/analysis/NewResultSetForm";
import { Button } from "../../../components/ui/button";
import BackToTopButton from "../../../components/common/BackToTopButton";

// Page for editing an existing result set
function EditResultSetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [resultSet, setResultSet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResultSet = async () => {
      try {
        const data = await getResultSetByIdRequest(id, token);
        setResultSet(data.resultSet);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load result set.");
      } finally {
        setLoading(false);
      }
    };

    loadResultSet();
  }, [id, token]);

  return (
    <section className="space-y-6">
      <div>
        <Button asChild variant="outline">
          <Link to={`/analysis/result-sets/${id}`}>
            ⮜ Back to Result Set Details
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Update Result Set
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Edit the main information of this analysis dataset.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading result set...</p>}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && resultSet && (
        <NewResultSetForm
          mode="edit"
          resultSetId={id}
          initialData={resultSet}
          onSuccess={() => navigate(`/analysis/result-sets/${id}`)}
        />
      )}
			<BackToTopButton />
    </section>
  );
}

export default EditResultSetPage;