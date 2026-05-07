const METRIC_LABELS = {
  mean: "Arithmetic mean",
  median: "Median",
  standardDeviation: "Standard deviation",
  standard_deviation: "Standard deviation",
  variance: "Variance",
  standardError: "Standard Error of the Mean (SEM)",
  standard_error: "Standard Error of the Mean (SEM)",
  range: "Range",
  growthRate: "Growth rate",
  growth_rate: "Growth rate",
  doublingTime: "Doubling time",
  doubling_time: "Doubling time",
  kaplanMeier: "Kaplan-Meier survival curve",
  kaplan_meier: "Kaplan-Meier survival curve",
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
    return (
      <p className="text-sm text-slate-500">
        No descriptive metrics available.
      </p>
    );
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
                  <td className="px-3 py-3 font-medium text-slate-900">
                    Range
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    Min: {formatNumber(value.min)} | Max:{" "}
                    {formatNumber(value.max)} | Difference:{" "}
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

function GroupWiseMetricsTable({ groupStatistics }) {
  if (!groupStatistics || Object.keys(groupStatistics).length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No group-wise metrics available.
      </p>
    );
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
            <th className="px-3 py-3 text-left font-medium">SEM</th>
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
                  ? `${formatNumber(
                      values.confidenceInterval95.lower
                    )} – ${formatNumber(values.confidenceInterval95.upper)}`
                  : "—"}
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
    return (
      <p className="text-sm text-slate-500">
        No confidence intervals available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Interval</th>
            <th className="px-3 py-3 text-left font-medium">Lower</th>
            <th className="px-3 py-3 text-left font-medium">Upper</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatisticalTestsTable({ tests }) {
  if (!tests || Object.keys(tests).length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No statistical tests available.
      </p>
    );
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

function GrowthResultsTable({ growthResults }) {
  if (!growthResults || Object.keys(growthResults).length === 0) {
    return <p className="text-sm text-slate-500">No growth results available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Group</th>
            <th className="px-3 py-3 text-left font-medium">N</th>
            <th className="px-3 py-3 text-left font-medium">Growth rate</th>
            <th className="px-3 py-3 text-left font-medium">Doubling time</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {Object.entries(growthResults).map(([groupName, result]) => (
            <tr key={groupName}>
              <td className="px-3 py-3 font-medium text-slate-900">
                {groupName}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {result.count ?? "—"}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {formatNumber(result.growthRate)}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {formatNumber(result.doublingTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SurvivalResultsTable({ survivalResults }) {
  if (!survivalResults || Object.keys(survivalResults).length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No survival/event results available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Group</th>
            <th className="px-3 py-3 text-left font-medium">N</th>
            <th className="px-3 py-3 text-left font-medium">Events</th>
            <th className="px-3 py-3 text-left font-medium">Censored</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {Object.entries(survivalResults).map(([groupName, result]) => (
            <tr key={groupName}>
              <td className="px-3 py-3 font-medium text-slate-900">
                {groupName}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {result.count ?? "—"}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {result.eventCount ?? "—"}
              </td>
              <td className="px-3 py-3 text-slate-600">
                {result.censoredCount ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AnalysisResultsDisplay({ results, datasetType = "numeric" }) {
  if (!results) {
    return <p className="text-slate-500">No results available.</p>;
  }

  const isNumericDataset = datasetType === "numeric";
  const isTimecourseDataset = datasetType === "timecourse";
  const isSurvivalDataset = datasetType === "survival";
  const hasGrouping = ["group", "sex"].includes(results.groupingMode);

  console.log("AnalysisResultsDisplay datasetType:", datasetType);


  return (
    <div className="space-y-6 text-sm text-slate-600">
      {results.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {results.error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <p>
          <span className="font-medium text-slate-900">Entry count:</span>{" "}
          {results.entryCount ?? "—"}
        </p>

        {isNumericDataset && (
          <p>
            <span className="font-medium text-slate-900">
              Numeric value count:
            </span>{" "}
            {results.numericValueCount ?? "—"}
          </p>
        )}

        {isTimecourseDataset && (
          <p>
            <span className="font-medium text-slate-900">
              Time-course entry count:
            </span>{" "}
            {results.timecourseEntryCount ?? "—"}
          </p>
        )}

        {isSurvivalDataset && (
          <p>
            <span className="font-medium text-slate-900">
              Survival entry count:
            </span>{" "}
            {results.survivalEntryCount ?? "—"}
          </p>
        )}

        <p>
          <span className="font-medium text-slate-900">Grouping mode:</span>{" "}
          {results.groupingMode || "none"}
        </p>

        <p>
          <span className="font-medium text-slate-900">Group count:</span>{" "}
          {results.groupCount ?? "—"}
        </p>
      </div>

      {isNumericDataset && hasGrouping && (
        <div className="space-y-2">
          <p className="font-medium text-slate-900">
            Group-wise descriptive metrics:
          </p>
          <GroupWiseMetricsTable groupStatistics={results.groupStatistics} />
        </div>
      )}

      {isNumericDataset && (
        <div className="space-y-2">
          <p className="font-medium text-slate-900">
            {hasGrouping
              ? "Descriptive metrics for whole dataset:"
              : "Descriptive metrics:"}
          </p>
          <DescriptiveMetricsTable metrics={results.descriptiveMetrics} />
        </div>
      )}

      {isNumericDataset && (
        <div className="space-y-2">
          <p className="font-medium text-slate-900">Confidence intervals:</p>
          <ConfidenceIntervalsTable
            confidenceIntervals={results.confidenceIntervals}
          />
        </div>
      )}

      {isTimecourseDataset &&
        results.growthResults &&
        Object.keys(results.growthResults).length > 0 && (
          <div className="space-y-2">
            <p className="font-medium text-slate-900">
              Growth and doubling time results:
            </p>
            <GrowthResultsTable growthResults={results.growthResults} />
          </div>
        )}

      {isSurvivalDataset &&
        results.survivalResults &&
        Object.keys(results.survivalResults).length > 0 && (
          <div className="space-y-2">
            <p className="font-medium text-slate-900">
              Survival/event results:
            </p>
            <SurvivalResultsTable survivalResults={results.survivalResults} />
          </div>
        )}

      {isNumericDataset && (
        <div className="space-y-2">
          <p className="font-medium text-slate-900">Statistical tests:</p>
          <StatisticalTestsTable tests={results.tests} />
        </div>
      )}
    </div>
  );
};

export default AnalysisResultsDisplay;