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

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Charts</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {chartData.scatter?.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Scatter Plot`}
            description="Shows each saved numeric result entry as an individual point."
          >
            <ScatterChart margin={{ top: 10, right: 25, left: 45, bottom: 55 }}>
              {commonCartesianGrid}

              <XAxis
                dataKey="x"
                name="Entry index"
                tickMargin={10}
                label={{
                  value: "Entry index",
                  position: "bottom",
                  offset: 25,
                }}
              />

              <YAxis
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

              <Scatter name={chartTitleBase} data={chartData.scatter} />
            </ScatterChart>
          </ChartBlock>
        )}

        {chartData.groupMeans?.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Group Means`}
            description="Shows the arithmetic mean for each detected group."
          >
            <BarChart
              data={chartData.groupMeans}
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

              <Bar dataKey="mean" name="Mean" fill="#94a3b8"/>
            </BarChart>
          </ChartBlock>
        )}

        {chartData.groupMeans?.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Group Means ± SD`}
            description="Shows group means with standard deviation error bars."
          >
            <BarChart
              data={chartData.groupMeans}
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

              <Bar dataKey="mean" name="Mean" fill="#94a3b8">
                <ErrorBar dataKey="sd" width={8} />
              </Bar>
            </BarChart>
          </ChartBlock>
        )}

        {chartData.groupMeans?.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Group Means ± SEM`}
            description="Shows group means with standard error of the mean error bars."
          >
            <BarChart
              data={chartData.groupMeans}
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

              <Bar dataKey="mean" name="Mean" fill="#94a3b8">
                <ErrorBar dataKey="sem" width={8} />
              </Bar>
            </BarChart>
          </ChartBlock>
        )}

        {chartData.timecourse?.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Growth / Timecourse`}
            description="Shows numeric values across recorded timepoints."
          >
            <LineChart
              data={chartData.timecourse}
              margin={{ top: 10, right: 25, left: 45, bottom: 55 }}
            >
              {commonCartesianGrid}

              <XAxis
                dataKey="time"
                tickMargin={10}
                label={{
                  value: "Timepoint",
                  position: "bottom",
                  offset: 25,
                }}
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

              <Line
                type="monotone"
                dataKey="value"
                name={chartTitleBase}
                dot
                connectNulls={false}
              />
            </LineChart>
          </ChartBlock>
        )}

        {chartData.kaplanMeier?.length > 0 && (
          <ChartBlock
            title={`${chartTitleBase} — Kaplan-Meier Survival Curve`}
            description="Shows estimated survival probability over time."
          >
            <LineChart
              data={chartData.kaplanMeier}
              margin={{ top: 10, right: 25, left: 45, bottom: 55 }}
            >
              {commonCartesianGrid}

              <XAxis
                dataKey="time"
                tickMargin={10}
                label={{
                  value: "Timepoint",
                  position: "bottom",
                  offset: 25,
                }}
              />

              <YAxis
                domain={[0, 1]}
                tickMargin={10}
                label={{
                  value: "Survival probability",
                  angle: -90,
                  position: "left",
                  offset: 15,
                }}
              />

              <Tooltip />
              <Legend verticalAlign="top" height={30} />

              <Line
                type="stepAfter"
                dataKey="survival"
                name="Survival probability"
                dot
                connectNulls={false}
              />
            </LineChart>
          </ChartBlock>
        )}
      </CardContent>
    </Card>
  );
}

export default AnalysisChartsSection;