import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import {
  deleteStatisticalAnalysisRequest,
  getStatisticalAnalysisByIdRequest,
} from "../../../features/analysis/statisticalAnalysisApi";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import BackToTopButton from "../../../components/common/BackToTopButton";

// Page for showing one saved statistical analysis
function StatisticalAnalysisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const errorRef = useRef(null);
  const successRef = useRef(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      errorRef.current.focus();
    }
  }, [error]);

  useEffect(() => {
    if (successMessage && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      successRef.current.focus();
    }
  }, [successMessage]);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const data = await getStatisticalAnalysisByIdRequest(id, token);
        setAnalysis(data.analysis);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load analysis.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [id, token]);

  const parsedMetrics = useMemo(() => {
    if (!analysis?.selectedMetricsJson) return [];
    try {
      return JSON.parse(analysis.selectedMetricsJson);
    } catch {
      return [];
    }
  }, [analysis]);

  const parsedTests = useMemo(() => {
    if (!analysis?.selectedTestsJson) return [];
    try {
      return JSON.parse(analysis.selectedTestsJson);
    } catch {
      return [];
    }
  }, [analysis]);

  const parsedResults = useMemo(() => {
    if (!analysis?.resultsJson) return null;
    try {
      return JSON.parse(analysis.resultsJson);
    } catch {
      return null;
    }
  }, [analysis]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError("");
      setSuccessMessage("");

      await deleteStatisticalAnalysisRequest(id, token);
      navigate("/analysis/statistical-analyses");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete analysis.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <Button asChild variant="outline">
          <Link to="/analysis/statistical-analyses">
            ⮜ Back to Saved Statistical Analyses
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Statistical Analysis Details
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Review the saved configuration and results of this analysis.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading analysis...</p>}

      {error && (
        <div
          ref={errorRef}
          tabIndex="-1"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 outline-none"
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          ref={successRef}
          tabIndex="-1"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 outline-none"
        >
          {successMessage}
        </div>
      )}

      {!loading && !error && analysis && (
        <>
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>{analysis.analysisName}</CardTitle>
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
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Selected Metrics and Tests</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-900">Metrics:</span>{" "}
                {parsedMetrics.length > 0 ? parsedMetrics.join(", ") : "None"}
              </p>

              <p>
                <span className="font-medium text-slate-900">Tests:</span>{" "}
                {parsedTests.length > 0 ? parsedTests.join(", ") : "None"}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-slate-600">
              {!parsedResults ? (
                <p className="text-slate-500">No results available.</p>
              ) : (
                <>
                  <p>
                    <span className="font-medium text-slate-900">Entry count:</span>{" "}
                    {parsedResults.entryCount ?? "—"}
                  </p>

                  <p>
                    <span className="font-medium text-slate-900">
                      Numeric value count:
                    </span>{" "}
                    {parsedResults.numericValueCount ?? "—"}
                  </p>

                  {parsedResults.descriptiveMetrics && (
                    <div className="space-y-2">
                      <p className="font-medium text-slate-900">
                        Descriptive metrics:
                      </p>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <pre className="whitespace-pre-wrap text-xs text-slate-700">
                          {JSON.stringify(parsedResults.descriptiveMetrics, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {parsedResults.tests && (
                    <div className="space-y-2">
                      <p className="font-medium text-slate-900">Tests:</p>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <pre className="whitespace-pre-wrap text-xs text-slate-700">
                          {JSON.stringify(parsedResults.tests, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {parsedResults.error && (
                    <p className="text-sm text-red-700">{parsedResults.error}</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete analysis"}
            </Button>
          </div>
        </>
      )}

      <BackToTopButton />
    </section>
  );
}

export default StatisticalAnalysisDetailPage;