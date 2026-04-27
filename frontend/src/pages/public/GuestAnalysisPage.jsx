import { Link } from "react-router-dom";
import GuestModeNotice from "../../components/guest/GuestModeNotice";
import AnalysisInputSection from "../../components/analysis/AnalysisInputSection";
import { useEffect, useState } from "react";
import AnalysisChartsSection from "../../components/analysis/AnalysisChartsSection";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const createEmptyRow = () => ({
  sampleCode: "",
  groupLabel: "",
  sex: "",
  numericValue: "",
  timepointValue: "",
  eventOccurred: false,
});

const METRIC_OPTIONS_BY_TYPE = {
  numeric: [
    { value: "mean", label: "Arithmetic mean" },
    { value: "median", label: "Median" },
    { value: "standard_deviation", label: "Standard deviation" },
    { value: "variance", label: "Variance" },
    { value: "standard_error", label: "Standard error" },
    { value: "range", label: "Range" },
  ],

  timecourse: [
    { value: "growth_rate", label: "Growth rate" },
    { value: "doubling_time", label: "Doubling time" },
  ],

  survival: [
    { value: "kaplan_meier", label: "Kaplan-Meier survival curve" },
  ],
};

const TEST_OPTIONS_BY_TYPE = {
  numeric: [
    { value: "shapiro_wilk", label: "Shapiro-Wilk test" },
    { value: "student_t_test", label: "Student’s t-test" },
    { value: "mann_whitney_u", label: "Mann-Whitney U-test" },
  ],

  timecourse: [],

  survival: [],
};

function GuestAnalysisPage() {
  const [measurementName, setMeasurementName] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("");
  const [entryType, setEntryType] = useState("numeric"); 
  const [groupingMode, setGroupingMode] = useState("none");

  const [rows, setRows] = useState([createEmptyRow()]);
  const [selectedMetrics, setSelectedMetrics] = useState(["mean", "median"]);
  const [selectedTests, setSelectedTests] = useState([]);

  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const availableMetricOptions = METRIC_OPTIONS_BY_TYPE[entryType] || [];
  const availableTestOptions = TEST_OPTIONS_BY_TYPE[entryType] || [];

  useEffect(() => {
    const saved = localStorage.getItem("guestAnalysisDraft");

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      setMeasurementName(parsed.measurementName || "");
      setMeasurementUnit(parsed.measurementUnit || "");
      setEntryType(parsed.entryType || "numeric");
      setGroupingMode(parsed.groupingMode || "none");
      setRows(parsed.rows?.length ? parsed.rows : [createEmptyRow()]);
      setSelectedMetrics(parsed.selectedMetrics || ["mean", "median"]);
      setSelectedTests(parsed.selectedTests || []);
    } catch {
      localStorage.removeItem("guestAnalysisDraft");
    }
  }, []);

  useEffect(() => {
    if (entryType === "numeric") {
      setSelectedMetrics(["mean", "median"]);
      setSelectedTests([]);
    }

    if (entryType === "timecourse") {
      setSelectedMetrics(["growth_rate", "doubling_time"]);
      setSelectedTests([]);
    }

    if (entryType === "survival") {
      setSelectedMetrics(["kaplan_meier"]);
      setSelectedTests([]);
    }

    setResults(null);
    setError("");
  }, [entryType]);

  useEffect(() => {
    localStorage.setItem(
      "guestAnalysisDraft",
      JSON.stringify({
        measurementName,
        measurementUnit,
        entryType,
        groupingMode,
        rows,
        selectedMetrics,
        selectedTests,
      })
    );
  }, [
    measurementName,
    measurementUnit,
    entryType,
    groupingMode,
    rows,
    selectedMetrics,
    selectedTests,
  ]);

  const updateRow = (indexToUpdate, field, value) => {
    setRows((prev) =>
      prev.map((row, index) =>
        index === indexToUpdate ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const removeRow = (indexToRemove) => {
    setRows((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearGuestData = () => {
    setMeasurementName("");
    setMeasurementUnit("");
    setEntryType("numeric");
    setGroupingMode("none");
    setRows([createEmptyRow()]);
    setSelectedMetrics(["mean", "median"]);
    setSelectedTests([]);
    setResults(null);
    setError("");
    localStorage.removeItem("guestAnalysisDraft");
  };

  const toggleMetric = (metric) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((item) => item !== metric)
        : [...prev, metric]
    );
  };

  const toggleTest = (test) => {
    setSelectedTests((prev) =>
      prev.includes(test)
        ? prev.filter((item) => item !== test)
        : [...prev, test]
    );
  };

const validateGuestData = () => {
  if (rows.length === 0) {
    return "At least one row is required.";
  }

  for (const row of rows) {
    if (entryType !== "survival") {
      if (row.numericValue === "") {
        return "Each numeric/time-course row must include a numeric value.";
      }

      if (!Number.isFinite(Number(row.numericValue))) {
        return "Numeric values must be valid numbers.";
      }
    }

    if (entryType !== "numeric") {
      if (row.timepointValue === "") {
        return "Each time-course/survival row must include a timepoint value.";
      }

      if (!Number.isFinite(Number(row.timepointValue))) {
        return "Timepoint values must be valid numbers.";
      }
    }
  }

  if (selectedMetrics.length === 0 && selectedTests.length === 0) {
    return "Please select at least one metric or test.";
  }

  return "";
};

  const handleRunGuestAnalysis = async () => {
    setError("");
    setResults(null);

    const validationError = validateGuestData();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsRunning(true);

      const entries = rows.map((row) => ({
        numericValue:
          entryType === "survival" ? null : Number(row.numericValue),
        timepointValue:
          entryType === "numeric" ? null : Number(row.timepointValue),
        eventOccurred:
          entryType === "survival" ? (row.eventOccurred ? 1 : 0) : null,
        sex: row.sex || null,
        sampleCode: row.sampleCode || null,
        groupLabel: row.groupLabel || null,
        subjectId: null,
        groupId: null,
      }));

      const response = await fetch("/stats-api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisName: "Guest analysis",
          groupingMode,
          selectedMetrics,
          selectedTests,
          comparisonGroups: [],
          filters: {},
          chartConfig: {},
          entries,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to run analysis.");
      }

      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to run guest analysis.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6">
      <section className="mx-auto max-w-6xl space-y-8">
        <div>
          <Button asChild variant="outline">
            <Link to="/">⮜ Back to Main Page</Link>
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Guest Statistical Analysis
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Enter data, select dataset type and calculations, and view results without creating an account.
            Data is not being saved.
          </p>
        </div>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Dataset Setup</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Measurement name (will be displayed as title for the charts)
                </label>
                <Input
                  value={measurementName}
                  onChange={(event) => setMeasurementName(event.target.value)}
                  placeholder="Example: cell count"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Measurement unit
                </label>
                <Input
                  value={measurementUnit}
                  onChange={(event) => setMeasurementUnit(event.target.value)}
                  placeholder="Example: cells/ml, %, mm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Select dataset type:</p>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["numeric", "Numeric values"],
                  ["timecourse", "Time-course / growth"],
                  ["survival", "Survival / event"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEntryType(value)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      entryType === value
                        ? "border-slate-900 bg-slate-100 text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Data Entries</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    {entryType === "survival" && (
                      <th className="px-3 py-3 text-left font-medium">Event occurred</th>
                    )}

                    {entryType !== "numeric" && (
                      <th className="px-3 py-3 text-left font-medium">Timepoint</th>
                    )}

                    {entryType !== "survival" && (
                      <th className="px-3 py-3 text-left font-medium">Value</th>
                    )}

                    <th className="px-3 py-3 text-left font-medium">Sample code</th>
                    <th className="px-3 py-3 text-left font-medium">Group label</th>
                    <th className="px-3 py-3 text-left font-medium">Sex</th>
                    <th className="px-3 py-3 text-left font-medium">Remove</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {rows.map((row, index) => (
                    <tr key={index}>
                      {entryType !== "survival" && (
                        <td className="px-3 py-3 align-middle">
                          <Input
                            value={row.numericValue}
                            onChange={(event) =>
                              updateRow(index, "numericValue", event.target.value)
                            }
                            placeholder="Value"
                          />
                        </td>
                      )}

                      {entryType === "survival" && (
                        <td className="px-3 py-3 align-middle text-center">
                          <input
                            type="checkbox"
                            checked={Boolean(row.eventOccurred)}
                            onChange={(event) =>
                              updateRow(index, "eventOccurred", event.target.checked)
                            }
                            className="h-4 w-4"
                          />
                        </td>
                      )}

                      {entryType !== "numeric" && (
                        <td className="px-3 py-3 align-middle">
                          <Input
                            value={row.timepointValue}
                            onChange={(event) =>
                              updateRow(index, "timepointValue", event.target.value)
                            }
                            placeholder="Timepoint"
                          />
                        </td>
                      )}

                      <td className="px-3 py-3 align-middle">
                        <Input
                          value={row.sampleCode}
                          onChange={(event) =>
                            updateRow(index, "sampleCode", event.target.value)
                          }
                          placeholder="SAMPLE-01"
                        />
                      </td>

                      <td className="px-3 py-3 align-middle">
                        <Input
                          value={row.groupLabel}
                          onChange={(event) =>
                            updateRow(index, "groupLabel", event.target.value)
                          }
                          placeholder="control"
                        />
                      </td>

                      <td className="px-3 py-3 align-middle">
                        <select
                          value={row.sex}
                          onChange={(event) =>
                            updateRow(index, "sex", event.target.value)
                          }
                          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        >
                          <option value="">Unspecified</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </td>

                      <td className="px-3 py-3 align-middle">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeRow(index)}
                          disabled={rows.length === 1}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={addRow}>
                + Add row
              </Button>

              <Button type="button" variant="outline" onClick={clearGuestData}>
                Clear data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Analysis Settings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Grouping mode
              </label>
              <select
                value={groupingMode}
                onChange={(event) => setGroupingMode(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="none">No grouping</option>
                <option value="group">By group</option>
                <option value="sex">By sex</option>
              </select>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Metrics</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {availableMetricOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMetrics.includes(option.value)}
                      onChange={() => toggleMetric(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Tests</p>
              {availableTestOptions.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                    No statistical tests are currently available for this dataset type.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableTestOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTests.includes(option.value)}
                          onChange={() => toggleTest(option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={handleRunGuestAnalysis}
            disabled={isRunning}
          >
            {isRunning ? "Running analysis..." : "Run guest analysis"}
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {results && (
          <>
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-slate-600">
                <pre className="max-h-105 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {results.chartData && (
              <AnalysisChartsSection
                chartData={results.chartData}
                measurementName={measurementName || "Guest measurement"}
                measurementUnit={measurementUnit}
              />
            )}
          </>
        )}


      </section>
    </main>
  );
}

export default GuestAnalysisPage;