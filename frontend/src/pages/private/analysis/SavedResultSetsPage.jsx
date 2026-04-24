import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getSavedResultSetsRequest } from "../../../features/analysis/resultSetApi";
import { Button } from "../../../components/ui/button";
import BackToTopButton from "../../../components/common/BackToTopButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const formatExperimentType = (value) => {
  if (value === "in_vivo") return "in vivo";
  if (value === "in_vitro") return "in vitro";
  return value;
};

// Page for showing saved result sets
function SavedResultSetsPage() {
  const { token } = useAuth();
  const [resultSets, setResultSets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResultSets = async () => {
      try {
        const data = await getSavedResultSetsRequest(token);
        setResultSets(data.resultSets);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load result sets.");
      } finally {
        setLoading(false);
      }
    };

    loadResultSets();
  }, [token]);

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Saved Result Sets
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Review previously created result sets and open them for more details.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading result sets...</p>}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && resultSets.length === 0 && (
        <p className="text-sm text-slate-500">No result sets saved yet.</p>
      )}

      {!loading && !error && resultSets.length > 0 && (
        <div className="grid gap-4">
          {resultSets.map((resultSet) => (
            <Card key={resultSet.id} className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>{resultSet.title}</CardTitle>
                <CardDescription>
								<span
										className={`inline-flex w-fit rounded-full px-3 py-1 text-s font-medium ${
											resultSet.experimentId
												? "bg-blue-100 text-blue-700"
												: "bg-slate-100 text-slate-700"
										}`}
									>
										{resultSet.experimentId ? "Linked experiment dataset" : "Standalone dataset"}
									</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-slate-600">

								{resultSet.experimentId && (
                  <p>
                    <span className="font-medium text-slate-900">Linked experiment:</span>{" "}
                    {formatExperimentType(resultSet.experiment?.title)}
                  </p>
                )}

                <p>
                  <span className="font-medium text-slate-900">Type:</span>{" "}
                  <i>{formatExperimentType(resultSet.experimentType)}</i>
                </p>

                <p>
                  <span className="font-medium text-slate-900">Measurement:</span>{" "}
                  {resultSet.measurementName}
                </p>

                {resultSet.measurementUnit && (
                  <p>
                    <span className="font-medium text-slate-900">Unit:</span>{" "}
                    {resultSet.measurementUnit}
                  </p>
                )}

                <div className="pt-2">
                  <Button asChild variant="outline">
                    <Link to={`/analysis/result-sets/${resultSet.id}`}>
                      Open Result Set
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
			<BackToTopButton />
    </section>
  );
}

export default SavedResultSetsPage;