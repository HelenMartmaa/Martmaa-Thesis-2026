import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const formatExperimentType = (value) => {
  if (value === "in_vivo") return "in vivo";
  if (value === "in_vitro") return "in vitro";
  return value;
};

// Shows a live summary of the dataset being created
function ResultSetSummaryCard({ formData, selectedExperimentTitle }) {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Current Dataset Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-900">Title:</span>{" "}
          {formData.title || "Not set yet"}
        </p>

        <p>
          <span className="font-medium text-slate-900">Linked experiment:</span>{" "}
          {selectedExperimentTitle || "-"}
        </p>

        <p>
          <span className="font-medium text-slate-900">Experiment type:</span>{" "}
          <i>{formatExperimentType(formData.experimentType)}</i>
        </p>

        <p>
          <span className="font-medium text-slate-900">Measurement name:</span>{" "}
          {formData.measurementName || "Not set yet"}
        </p>

        <p>
          <span className="font-medium text-slate-900">Measurement unit:</span>{" "}
          {formData.measurementUnit || "Not set"}
        </p>

        {formData.description && (
          <div>
            <span className="font-medium text-slate-900">Description:</span>
            <p className="mt-1">{formData.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResultSetSummaryCard;