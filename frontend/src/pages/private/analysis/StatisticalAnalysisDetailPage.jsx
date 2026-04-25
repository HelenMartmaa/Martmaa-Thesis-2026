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

const METRIC_LABELS = {
  mean: "Arithmetic mean",
  median: "Median",
  standardDeviation: "Standard deviation",
  variance: "Variance",
  standardError: "Standard error",
  range: "Range",
};

const TEST_LABELS = {
  shapiroWilk: "Shapiro-Wilk test",
  studentTTest: "Student’s t-test",
  mannWhitneyU: "Mann-Whitney U-test",
};

const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return Number(value).toFixed(4);
};

function DescriptiveMetricsTable({ metrics }) {
  if (!metrics || Object.keys(metrics).length === 0) {
    return <p className="text-sm text-slate-500">No descriptive metrics available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Metric</th>
            <th className="px-3 py-3 text-left font-medium">Value</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {Object.entries(metrics).map(([key, value]) => {
            if (key === "range" && typeof value === "object") {
              return (
                <tr key={key}>
                  <td className="px-3 py-3 font-medium text-slate-900">Range</td>
                  <td className="px-3 py-3 text-slate-600">
                    Min: {formatNumber(value.min)} | Max: {formatNumber(value.max)} | Difference:{" "}
                    {formatNumber(value.difference)}
                  </td>
                </tr>
              );
            }

            return (
              <tr key={key}>
                <td className="px-3 py-3 font-medium text-slate-900">
                  {METRIC_LABELS[key] || key}
                </td>
                <td className="px-3 py-3 text-slate-600">
                  {formatNumber(value)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GroupWiseMetricsTable({ groupStatistics }) {
  if (!groupStatistics || Object.keys(groupStatistics).length === 0) {
    return <p className="text-sm text-slate-500">No group-wise metrics available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Group</th>
            <th className="px-3 py-3 text-left font-medium">N</th>
            <th className="px-3 py-3 text-left font-medium">Mean</th>
            <th className="px-3 py-3 text-left font-medium">Median</th>
            <th className="px-3 py-3 text-left font-medium">SD</th>
            <th className="px-3 py-3 text-left font-medium">Variance</th>
            <th className="px-3 py-3 text-left font-medium">SE</th>
            <th className="px-3 py-3 text-left font-medium">Range</th>
            <th className="px-3 py-3 text-left font-medium">95% CI</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {Object.entries(groupStatistics).map(([groupName, values]) => (
            <tr key={groupName}>
              <td className="px-3 py-3 align-top font-medium text-slate-900">
                {groupName}
              </td>

              <td className="px-3 py-3 align-top text-slate-600">
                {values.count ?? "—"}
              </td>

              <td className="px-3 py-3 align-top text-slate-600">
                {formatNumber(values.mean)}
              </td>

              <td className="px-3 py-3 align-top text-slate-600">
                {formatNumber(values.median)}
              </td>

              <td className="px-3 py-3 align-top text-slate-600">
                {formatNumber(values.standardDeviation)}
              </td>

              <td className="px-3 py-3 align-top text-slate-600">
                {formatNumber(values.variance)}
              </td>

              <td className="px-3 py-3 align-top text-slate-600">
                {formatNumber(values.standardError)}
              </td>

              <td className="px-3 py-3 align-top text-slate-600">
                {values.range
                  ? `${formatNumber(values.range.min)}–${formatNumber(
                      values.range.max
                    )}`
                  : "—"}
              </td>

              <td className="px-3 py-3 align-top text-slate-600">
                {values.confidenceInterval95
                  ? `${formatNumber(values.confidenceInterval95.lower)} – ${formatNumber(
                      values.confidenceInterval95.upper
                    )}`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatisticalTestsTable({ tests }) {
  if (!tests || Object.keys(tests).length === 0) {
    return <p className="text-sm text-slate-500">No statistical tests available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Test</th>
            <th className="px-3 py-3 text-left font-medium">Statistic</th>
            <th className="px-3 py-3 text-left font-medium">p-value</th>
            <th className="px-3 py-3 text-left font-medium">Notes</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {Object.entries(tests).map(([key, value]) => (
            <tr key={key}>
              <td className="px-3 py-3 font-medium text-slate-900">
                {TEST_LABELS[key] || key}
              </td>

              <td className="px-3 py-3 text-slate-600">
                {formatNumber(value.statistic)}
              </td>

              <td className="px-3 py-3 text-slate-600">
                {formatNumber(value.pValue)}
              </td>

              <td className="px-3 py-3 text-slate-600">
                {value.comparisonGroups?.length === 2 && (
                  <span className="block">
                    Compared: {value.comparisonGroups[0]} vs{" "}
                    {value.comparisonGroups[1]}
                  </span>
                )}

                <span>{value.message || "—"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupsSummaryTable({ groups }) {
  if (!groups || Object.keys(groups).length === 0) {
    return <p className="text-sm text-slate-500">No groups were detected.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Group</th>
            <th className="px-3 py-3 text-left font-medium">Count</th>
            <th className="px-3 py-3 text-left font-medium">Mean</th>
            <th className="px-3 py-3 text-left font-medium">Median</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {Object.entries(groups).map(([groupName, groupData]) => (
            <tr key={groupName}>
              <td className="px-3 py-3 font-medium text-slate-900">
                {groupName}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {groupData.count ?? "—"}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {formatNumber(groupData.mean)}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {formatNumber(groupData.median)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConfidenceIntervalsTable({ confidenceIntervals }) {
  if (!confidenceIntervals || Object.keys(confidenceIntervals).length === 0) {
    return <p className="text-sm text-slate-500">No confidence intervals available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Interval</th>
            <th className="px-3 py-3 text-left font-medium">Lower</th>
            <th className="px-3 py-3 text-left font-medium">Upper</th>
            <th className="px-3 py-3 text-left font-medium">Notes</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {Object.entries(confidenceIntervals).map(([key, value]) => (
            <tr key={key}>
              <td className="px-3 py-3 font-medium text-slate-900">
                {key === "mean95" ? "95% CI for mean" : key}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {formatNumber(value.lower)}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {formatNumber(value.upper)}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {value.message || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// Page for showing one saved statistical analysis
function StatisticalAnalysisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const errorRef = useRef(null);
  const successRef = useRef(null);
	const resultsRef = useRef(null);

	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const deleteConfirmRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		if (showDeleteConfirm && deleteConfirmRef.current) {
			deleteConfirmRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});

			deleteConfirmRef.current.focus();
		}
	}, [showDeleteConfirm]);

	useEffect(() => {
		if (!loading && !error && analysis && resultsRef.current) {
			resultsRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});

			resultsRef.current.focus();
		}
	}, [loading, error, analysis]);

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

	const formattedMetricLabels = useMemo(() => {
		return parsedMetrics.map((metric) => METRIC_LABELS[metric] || metric);
	}, [parsedMetrics]);

	const RAW_TEST_LABELS = {
		shapiro_wilk: "Shapiro-Wilk test",
		student_t_test: "Student’s t-test",
		mann_whitney_u: "Mann-Whitney U-test",
	};

	const formattedTestLabels = useMemo(() => {
		return parsedTests.map((test) => RAW_TEST_LABELS[test] || TEST_LABELS[test] || test);
	}, [parsedTests]);

	const openDeleteConfirm = () => {
		setError("");
		setSuccessMessage("");
		setShowDeleteConfirm(true);
	};

	const closeDeleteConfirm = () => {
		setShowDeleteConfirm(false);
	};

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
                {formattedMetricLabels.length > 0 ? formattedMetricLabels.join(", ") : "None"}
              </p>

              <p>
                <span className="font-medium text-slate-900">Tests:</span>{" "}
                {formattedTestLabels.length > 0 ? formattedTestLabels.join(", ") : "None"}
              </p>
            </CardContent>
          </Card>

          <Card
						ref={resultsRef}
						tabIndex="-1"
						className="rounded-3xl border-slate-200 shadow-sm outline-none"
					>
						<CardHeader>
							<CardTitle>Analysis Results</CardTitle>
						</CardHeader>

            <CardContent className="space-y-6 text-sm text-slate-600">
							{!parsedResults ? (
								<p className="text-slate-500">No results available.</p>
							) : (
								<>
									{parsedResults.error && (
										<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
											{parsedResults.error}
										</div>
									)}

									<div className="grid gap-3 sm:grid-cols-2">
										<p>
											<span className="font-medium text-slate-900">Entry count:</span>{" "}
											{parsedResults.entryCount ?? "—"}
										</p>

										<p>
											<span className="font-medium text-slate-900">Numeric value count:</span>{" "}
											{parsedResults.numericValueCount ?? "—"}
										</p>

										<p>
											<span className="font-medium text-slate-900">Grouping mode:</span>{" "}
											{parsedResults.groupingMode || "none"}
										</p>

										<p>
											<span className="font-medium text-slate-900">Group count:</span>{" "}
											{parsedResults.groupCount ?? "—"}
										</p>
									</div>

									<div className="space-y-2">
										<p className="font-medium text-slate-900">Detected groups:</p>
										<GroupsSummaryTable groups={parsedResults.groups} />
									</div>

									{["group", "sex"].includes(parsedResults.groupingMode) && (
										<div className="space-y-2">
											<p className="font-medium text-slate-900">
												Group-wise descriptive metrics:
											</p>
											<GroupWiseMetricsTable
												groupStatistics={parsedResults.groupStatistics}
											/>
										</div>
									)}

									<div className="space-y-2">
										<p className="font-medium text-slate-900">
											{["group", "sex"].includes(parsedResults.groupingMode)
												? "Descriptive metrics for whole dataset:"
												: "Descriptive metrics:"}
										</p>
										<DescriptiveMetricsTable metrics={parsedResults.descriptiveMetrics} />
									</div>

									<div className="space-y-2">
										<p className="font-medium text-slate-900">Confidence intervals:</p>
										<ConfidenceIntervalsTable
											confidenceIntervals={parsedResults.confidenceIntervals}
										/>
									</div>

									<div className="space-y-2">
										<p className="font-medium text-slate-900">Statistical tests:</p>
										<StatisticalTestsTable tests={parsedResults.tests} />
									</div>
								</>
							)}
						</CardContent>
          </Card>

					{showDeleteConfirm && (
						<div
							ref={deleteConfirmRef}
							tabIndex="-1"
							className="rounded-2xl border border-red-200 bg-red-50 p-4 outline-none"
						>
							<p className="text-sm font-medium text-red-800">
								Are you sure you want to delete this statistical analysis?
							</p>

							<p className="mt-1 text-sm text-red-700">
								This action cannot be undone. The saved analysis result will be removed,
								but the original result dataset will remain unchanged.
							</p>

							<div className="mt-4 flex flex-col gap-3 sm:flex-row">
								<Button
									type="button"
									variant="destructive"
									onClick={handleDelete}
									disabled={isDeleting}
								>
									{isDeleting ? "Deleting..." : "Yes, delete analysis"}
								</Button>

								<Button
									type="button"
									variant="outline"
									onClick={closeDeleteConfirm}
									disabled={isDeleting}
								>
									Cancel
								</Button>
							</div>
						</div>
					)}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="destructive"
              onClick={openDeleteConfirm}
              disabled={isDeleting}
            >
              Delete Analysis
            </Button>
          </div>
        </>
      )}

      <BackToTopButton />
    </section>
  );
}

export default StatisticalAnalysisDetailPage;