import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getResultSetByIdRequest, getResultSetsRequest } from "../../../features/analysis/resultSetApi";
import { createStatisticalAnalysisRequest } from "../../../features/analysis/statisticalAnalysisApi";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import BackToTopButton from "../../../components/common/BackToTopButton";

const METRIC_OPTIONS = [
  { value: "mean", label: "Arithmetic mean" },
  { value: "median", label: "Median" },
  { value: "standard_deviation", label: "Standard deviation" },
  { value: "variance", label: "Variance" },
  { value: "standard_error", label: "Standard error" },
  { value: "range", label: "Range" },
];

const TEST_OPTIONS = [
  { value: "shapiro_wilk", label: "Shapiro-Wilk test" },
  { value: "student_t_test", label: "Student’s t-test" },
  { value: "mann_whitney_u", label: "Mann-Whitney U-test" },
];

// Page for creating a new statistical analysis
function NewStatisticalAnalysisPage() {
  const { resultSetId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const errorRef = useRef(null);
  const successRef = useRef(null);

	const isSourceLocked = Boolean(resultSetId);
	const [analysisSource, setAnalysisSource] = useState("saved_single");
	const [availableResultSets, setAvailableResultSets] = useState([]);
	const [selectedResultSetId, setSelectedResultSetId] = useState(resultSetId || "");

  const [resultSet, setResultSet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    analysisName: "",
    groupingMode: "none",
    selectedMetrics: [],
    selectedTests: [],
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
		const loadInitialData = async () => {
			try {
				if (resultSetId) {
					const data = await getResultSetByIdRequest(resultSetId, token);
					setResultSet(data.resultSet);
					setSelectedResultSetId(resultSetId);

					setFormData((prev) => ({
						...prev,
						analysisName: `${data.resultSet.title} analysis`,
					}));
				} else {
					const data = await getResultSetsRequest(token);
					setAvailableResultSets(data.resultSets || data.result_sets || []);
				}
			} catch (err) {
				setError(err.response?.data?.error || "Failed to load analysis data.");
			} finally {
				setLoading(false);
			}
		};

		loadInitialData();
	}, [resultSetId, token]);

	useEffect(() => {
		const loadSelectedResultSet = async () => {
			if (!selectedResultSetId || resultSetId) return;

			try {
				const data = await getResultSetByIdRequest(selectedResultSetId, token);
				setResultSet(data.resultSet);

				setFormData((prev) => ({
					...prev,
					analysisName: prev.analysisName || `${data.resultSet.title} analysis`,
				}));
			} catch (err) {
				setError(err.response?.data?.error || "Failed to load selected result set.");
			}
		};

		loadSelectedResultSet();
	}, [selectedResultSetId, resultSetId, token]);

  const toggleMetric = (metricValue) => {
    setFormData((prev) => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics.includes(metricValue)
        ? prev.selectedMetrics.filter((item) => item !== metricValue)
        : [...prev.selectedMetrics, metricValue],
    }));
  };

  const toggleTest = (testValue) => {
    setFormData((prev) => ({
      ...prev,
      selectedTests: prev.selectedTests.includes(testValue)
        ? prev.selectedTests.filter((item) => item !== testValue)
        : [...prev.selectedTests, testValue],
    }));
  };

  const selectedMetricLabels = useMemo(() => {
    return METRIC_OPTIONS.filter((option) =>
      formData.selectedMetrics.includes(option.value)
    ).map((option) => option.label);
  }, [formData.selectedMetrics]);

  const selectedTestLabels = useMemo(() => {
    return TEST_OPTIONS.filter((option) =>
      formData.selectedTests.includes(option.value)
    ).map((option) => option.label);
  }, [formData.selectedTests]);

  const validateBeforeSave = () => {
		if (analysisSource !== "saved_single") {
			return "This analysis source is not available yet. Please use one saved result dataset.";
		}

		if (!selectedResultSetId) {
			return "Please select a result dataset.";
		}

    if (!formData.analysisName.trim()) {
      return "Analysis name is required.";
    }

    if (
      formData.selectedMetrics.length === 0 &&
      formData.selectedTests.length === 0
    ) {
      return "Select at least one metric or test.";
    }

		const selectedTwoGroupTests = formData.selectedTests.some((test) =>
			["student_t_test", "mann_whitney_u"].includes(test)
		);

		if (selectedTwoGroupTests && formData.groupingMode === "none") {
			return "Student’s t-test and Mann-Whitney U-test require grouping mode By group or By sex.";
		}

    return "";
  };

  const handleRunAndSaveAnalysis = async () => {
		setError("");
		setSuccessMessage("");

		const validationError = validateBeforeSave();

		if (validationError) {
			setError(validationError);
			return;
		}

		try {
			setIsSubmitting(true);

			const payload = {
				resultSetId: selectedResultSetId,
				analysisName: formData.analysisName,
				groupingMode: formData.groupingMode,
				selectedMetrics: formData.selectedMetrics,
				selectedTests: formData.selectedTests,
				filters: {},
				chartConfig: {},
			};

			const response = await createStatisticalAnalysisRequest(payload, token);

			setSuccessMessage("Statistical analysis was created successfully.");
			navigate(`/analysis/statistical-analyses/${response.analysis.id}`, {
				state: { focusResults: true },
			});
		} catch (err) {
			setError(
				err.response?.data?.error ||
					err.message ||
					"Failed to create statistical analysis."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

  return (
    <section className="space-y-8">
      <div>
        <Button asChild variant="outline">
          <Link to={resultSetId ? `/analysis/result-sets/${resultSetId}` : "/analysis/saved"}>
            ⮜ Back to Saved Result Datasets</Link>
        </Button>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Run Statistical Analysis
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Select descriptive metrics and statistical tests for the chosen dataset.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading anaysis data...</p>}

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

			<Card className="rounded-3xl border-slate-200 shadow-sm">
				<CardHeader>
					<CardTitle>Analysis Source</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6">
					<div className="grid gap-3 md:grid-cols-3">
						<button
							type="button"
							onClick={() => {
								if (!isSourceLocked) {
									setAnalysisSource("saved_single");
								}
							}}
							disabled={isSourceLocked}
							className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
								analysisSource === "saved_single"
									? "border-slate-900 bg-slate-100 text-slate-900"
									: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
							} ${isSourceLocked ? "cursor-not-allowed opacity-80" : ""}`}
						>
							<span className="block font-medium">Use saved result dataset</span>
							<span className="mt-1 block text-xs text-slate-500">
								Run analysis on one existing dataset.
							</span>
						</button>

						<button
							type="button"
							onClick={() => {
								if (!isSourceLocked) {
									setAnalysisSource("compare_two");
								}
							}}
							disabled={isSourceLocked}
							className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
								analysisSource === "compare_two"
									? "border-slate-900 bg-slate-100 text-slate-900"
									: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
							}`}
						>
							<span className="block font-medium">Compare two datasets</span>
							<span className="mt-1 block text-xs text-slate-500">
								Coming soon for t-test and Mann-Whitney U.
							</span>
						</button>

						<button
							type="button"
							onClick={() => {
								if (!isSourceLocked) {
									setAnalysisSource("standalone_now");
								}
							}}							
							disabled={isSourceLocked}
							className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
								analysisSource === "standalone_now"
									? "border-slate-900 bg-slate-100 text-slate-900"
									: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
							}`}
						>
							<span className="block font-medium">Enter standalone data now</span>
							<span className="mt-1 block text-xs text-slate-500">
								Coming soon as a quick analysis workflow.
							</span>
						</button>
						{isSourceLocked && (
							<p className="text-xs text-slate-500">
								Analysis source is locked because this analysis was started from a specific saved result dataset.
							</p>
						)}
					</div>

					{analysisSource === "saved_single" && !resultSetId && (
						<div className="space-y-2">
							<label
								htmlFor="selectedResultSetId"
								className="text-sm font-medium text-slate-700"
							>
								Result dataset
							</label>

							<select
								id="selectedResultSetId"
								value={selectedResultSetId}
								onChange={(event) => setSelectedResultSetId(event.target.value)}
								className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
							>
								<option value="">Select result dataset</option>
								{availableResultSets.map((item) => (
									<option key={item.id} value={item.id}>
										{item.title} — {item.measurementName}
									</option>
								))}
							</select>
						</div>
					)}
				</CardContent>
			</Card>

      {!loading && resultSet && (
        <>
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Dataset Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-900">Title:</span>{" "}
                {resultSet.title}
              </p>
              <p>
                <span className="font-medium text-slate-900">Experiment type:</span>{" "}
                {resultSet.experimentType}
              </p>
              <p>
                <span className="font-medium text-slate-900">Measurement name:</span>{" "}
                {resultSet.measurementName}
              </p>
              <p>
                <span className="font-medium text-slate-900">Measurement unit:</span>{" "}
                {resultSet.measurementUnit || "—"}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Analysis Settings</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="analysisName"
                  className="text-sm font-medium text-slate-700"
                >
                  Analysis name
                </label>
                <input
                  id="analysisName"
                  type="text"
                  value={formData.analysisName}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      analysisName: event.target.value,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Enter analysis name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="groupingMode"
                  className="text-sm font-medium text-slate-700"
                >
                  Grouping mode
                </label>
                <select
                  id="groupingMode"
                  value={formData.groupingMode}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      groupingMode: event.target.value,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="none">No grouping</option>
                  <option value="group">By group</option>
                  <option value="sex">By sex</option>
                </select>

								<p className="text-xs text-slate-500">
									Grouping mode controls how values are separated before tests are calculated.
									Student’s t-test and Mann-Whitney U-test require exactly two groups.
								</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  Descriptive metrics
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {METRIC_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedMetrics.includes(option.value)}
                        onChange={() => toggleMetric(option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  Statistical tests
                </p>

								<p className="text-xs text-slate-500">
									Two-group tests require grouping mode "By group" or "By sex" and exactly two valid groups.
								</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {TEST_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedTests.includes(option.value)}
                        onChange={() => toggleTest(option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Selection Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-900">Selected metrics:</span>{" "}
                {selectedMetricLabels.length > 0
                  ? selectedMetricLabels.join(", ")
                  : "None"}
              </p>

              <p>
                <span className="font-medium text-slate-900">Selected tests:</span>{" "}
                {selectedTestLabels.length > 0
                  ? selectedTestLabels.join(", ")
                  : "None"}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={handleRunAndSaveAnalysis}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Running analysis..." : "Run and save analysis"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
								resultSetId
									? navigate(`/analysis/result-sets/${resultSetId}`)
									: navigate("/analysis/saved")
							}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </>
      )}

      <BackToTopButton />
    </section>
  );
}

export default NewStatisticalAnalysisPage;