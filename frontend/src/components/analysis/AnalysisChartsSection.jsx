import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  ErrorBar,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function EmptyState() {
  return (
    <p className="text-sm text-slate-500">
      No chart data available for this analysis.
    </p>
  );
}

function getYAxisLabel(measurementUnit) {
  return measurementUnit ? `Value (${measurementUnit})` : "Value";
}

function ChartBlock({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

        {description && (
          <p className="text-xs leading-5 text-slate-500">{description}</p>
        )}
      </div>

      <div className="h-90 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getUniqueGroups(data = []) {
  return [...new Set(data.map((item) => item.group || "all"))];
}

function getGroupColor(index) {
  const colors = [
    "#334155",
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#9333ea",
    "#ea580c",
    "#0891b2",
    "#4f46e5",
  ];

  return colors[index % colors.length];
}

function filterByGroup(data, groupName) {
  return data.filter((item) => (item.group || "all") === groupName);
}

function AnalysisChartsSection({
  chartData,
  measurementName,
  measurementUnit,
}) {
  if (!chartData || Object.keys(chartData).length === 0) {
    return (
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Charts</CardTitle>
        </CardHeader>

        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  const chartTitleBase = measurementName || "Measured values";
  const yAxisLabel = getYAxisLabel(measurementUnit);
  const commonCartesianGrid = <CartesianGrid strokeDasharray="3 3" />;

  const scatterGroups = getUniqueGroups(chartData.scatter);
  const timecourseGroups = getUniqueGroups(chartData.timecourse);
  const kaplanMeierGroups = getUniqueGroups(chartData.kaplanMeier);
  const scatterXDomain = chartData.scatter?.length
    ? [1, chartData.scatter.length]
    : [0, 1];

  const validGroupMeans = (chartData.groupMeans || []).filter(
    (item) => item.mean !== null && item.mean !== undefined
  );

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Charts</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {chartData.scatter?.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Scatter Plot`}
            description="Shows each numeric result entry as an individual point."
          >
            <ScatterChart margin={{ top: 10, right: 25, left: 45, bottom: 55 }}>
              {commonCartesianGrid}

              <XAxis
                type="number"
                dataKey="x"
                name="Entry index"
                domain={scatterXDomain}
                allowDecimals={false}
                tickMargin={10}
                label={{
                  value: "Entry index",
                  position: "bottom",
                  offset: 25,
                }}
              />

              <YAxis
                type="number"
                dataKey="y"
                name={yAxisLabel}
                tickMargin={10}
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "left",
                  offset: 15,
                }}
              />

              <Tooltip />
              <Legend verticalAlign="top" height={30} />

              {scatterGroups.map((groupName, index) => (
                <Scatter
                  key={groupName}
                  name={groupName === "all" ? chartTitleBase : groupName}
                  data={filterByGroup(chartData.scatter, groupName)}
                  fill={getGroupColor(index)}
                />
              ))}
            </ScatterChart>
          </ChartBlock>
        )}

        {validGroupMeans.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Group Means`}
            description="Shows the arithmetic mean for each detected group."
          >
            <BarChart
              data={validGroupMeans}
              margin={{ top: 10, right: 25, left: 45, bottom: 75 }}
            >
              {commonCartesianGrid}

              <XAxis
                dataKey="group"
                interval={0}
                angle={-25}
                textAnchor="end"
                tickMargin={12}
                height={70}
              />

              <YAxis
                tickMargin={10}
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "left",
                  offset: 15,
                }}
              />

              <Tooltip />
              <Legend verticalAlign="top" height={30} />

              <Bar dataKey="mean" name="Mean" fill="#339e63" maxBarSize={120} />
            </BarChart>
          </ChartBlock>
        )}

        {validGroupMeans.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Group Means ± SD`}
            description="Shows group means with standard deviation error bars."
          >
            <BarChart
              data={validGroupMeans}
              margin={{ top: 10, right: 25, left: 45, bottom: 75 }}
            >
              {commonCartesianGrid}

              <XAxis
                dataKey="group"
                interval={0}
                angle={-25}
                textAnchor="end"
                tickMargin={12}
                height={70}
              />

              <YAxis
                tickMargin={10}
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "left",
                  offset: 15,
                }}
              />

              <Tooltip />
              <Legend verticalAlign="top" height={30} />

              <Bar dataKey="mean" name="Mean" fill="#339e63" maxBarSize={120}>
                <ErrorBar dataKey="sd" width={8} strokeWidth={2} />
              </Bar>
            </BarChart>
          </ChartBlock>
        )}

        {validGroupMeans.length  > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Group Means ± SEM`}
            description="Shows group means with standard error of the mean error bars."
          >
            <BarChart
              data={validGroupMeans}
              margin={{ top: 10, right: 25, left: 45, bottom: 75 }}
            >
              {commonCartesianGrid}

              <XAxis
                dataKey="group"
                interval={0}
                angle={-25}
                textAnchor="end"
                tickMargin={12}
                height={70}
              />

              <YAxis
                tickMargin={10}
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "left",
                  offset: 15,
                }}
              />

              <Tooltip />
              <Legend verticalAlign="top" height={30} />

              <Bar dataKey="mean" name="Mean" fill="#339e63" maxBarSize={120}>
                <ErrorBar dataKey="sem" width={8} strokeWidth={2} />
              </Bar>
            </BarChart>
          </ChartBlock>
        )}

        {chartData.timecourse?.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Growth / Time-course`}
            description="Shows numeric values across recorded timepoints. If groups are available, each group is shown as a separate line."
          >
            <LineChart margin={{ top: 10, right: 25, left: 45, bottom: 55 }}>
              {commonCartesianGrid}

              <XAxis
                type="number"
                dataKey="time"
                tickMargin={10}
                label={{
                  value: "Timepoint",
                  position: "bottom",
                  offset: 25,
                }}
                allowDuplicatedCategory={false}
              />

              <YAxis
                type="number"
                tickMargin={10}
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "left",
                  offset: 15,
                }}
              />

              <Tooltip />
              <Legend verticalAlign="top" height={30} />

              {timecourseGroups.map((groupName, index) => (
                <Line
                  key={groupName}
                  type="monotone"
                  data={filterByGroup(chartData.timecourse, groupName)}
                  dataKey="value"
                  name={groupName === "all" ? chartTitleBase : groupName}
                  stroke={getGroupColor(index)}
                  dot
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ChartBlock>
        )}

        {chartData.kaplanMeier?.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Kaplan-Meier Survival Curve`}
            description="Shows estimated survival probability over time. If groups are available, each group is shown as a separate step curve."
          >
            <LineChart margin={{ top: 10, right: 25, left: 55, bottom: 65 }}>
              {commonCartesianGrid}

              <XAxis
                type="number"
                dataKey="time"
                tickMargin={10}
                label={{
                  value: "Timepoint",
                  position: "bottom",
                  offset: 30,
                }}
                allowDuplicatedCategory={false}
              />

              <YAxis
                type="number"
                domain={[0, 1]}
                tickMargin={10}
                label={{
                  value: "Survival probability",
                  angle: -90,
                  position: "left",
                  offset: 20,
                }}
              />

              <Tooltip />
              <Legend verticalAlign="top" height={30} />

              {kaplanMeierGroups.map((groupName, index) => (
                <Line
                  key={groupName}
                  type="stepAfter"
                  data={filterByGroup(chartData.kaplanMeier, groupName)}
                  dataKey="survival"
                  name={groupName === "all" ? "Survival probability" : groupName}
                  stroke={getGroupColor(index)}
                  dot
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ChartBlock>
        )}
      </CardContent>
    </Card>
  );
}

export default AnalysisChartsSection;