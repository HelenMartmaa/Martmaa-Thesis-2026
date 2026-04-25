import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getStatisticalAnalysesRequest } from "../../../features/analysis/statisticalAnalysisApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import BackToTopButton from "../../../components/common/BackToTopButton";

// Page for listing saved statistical analyses
function SavedStatisticalAnalysesPage() {
  const { token } = useAuth();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        const data = await getStatisticalAnalysesRequest(token);
        setAnalyses(data.analyses || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load statistical analyses.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalyses();
  }, [token]);

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Saved Statistical Analyses
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Review previously generated statistical analyses and open their details. Saved analyses can be deleted, but cannot be updated.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading analyses...</p>}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && analyses.length === 0 && (
        <p className="text-sm text-slate-500">No statistical analyses saved yet.</p>
      )}

      {!loading && !error && analyses.length > 0 && (
        <div className="grid gap-6">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  {analysis.analysisName}
                </CardTitle>
									<span
										className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
											analysis.resultSet?.experimentId
												? "bg-blue-100 text-blue-700"
												: "bg-slate-100 text-slate-700"
										}`}
									>
										{analysis.resultSet?.experimentId
											? "Linked experiment analysis"
											: "Standalone analysis"}
									</span>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-900">Result set:</span>{" "}
                  {analysis.resultSet?.title || "—"}
                </p>

                <p>
                  <span className="font-medium text-slate-900">Grouping mode:</span>{" "}
                  {analysis.groupingMode || "none"}
                </p>

                <p>
                  <span className="font-medium text-slate-900">Created at:</span>{" "}
                  {new Date(analysis.createdAt).toLocaleString()}
                </p>

                <Button asChild variant="outline">
                  <Link to={`/analysis/statistical-analyses/${analysis.id}`}>
                    Open analysis
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BackToTopButton />
    </section>
  );
}

export default SavedStatisticalAnalysesPage;