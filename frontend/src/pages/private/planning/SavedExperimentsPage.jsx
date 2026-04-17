import { useEffect, useState } from "react";
import useAuth from "../../../features/auth/useAuth";
import { getSavedExperimentsRequest } from "../../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

// Page for listing saved experiments
function SavedExperimentsPage() {
  const { token } = useAuth();
  const [experiments, setExperiments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperiments = async () => {
      try {
        const data = await getSavedExperimentsRequest(token);
        setExperiments(data.experiments);
      } catch (err) {
        setError("Failed to load saved experiments.");
      } finally {
        setLoading(false);
      }
    };

    loadExperiments();
  }, [token]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-8 space-y-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Saved Experiments
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            View experiments previously saved under your account.
          </p>
        </div>

        {loading && <p className="text-sm text-slate-500">Loading experiments...</p>}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && experiments.length === 0 && (
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">
                No saved experiments yet.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {experiments.map((experiment) => (
            <Card key={experiment.id} className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{experiment.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-900">Type:</span>{" "}
                  {experiment.experimentType}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Status:</span>{" "}
                  {experiment.status}
                </p>
                {experiment.description && (
                  <p>
                    <span className="font-medium text-slate-900">Description:</span>{" "}
                    {experiment.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default SavedExperimentsPage;