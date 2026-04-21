import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function FieldRequirement({ required }) {
  return (
    <span className="text-slate-500">
      {" "}
      ({required ? "required" : "optional"})
    </span>
  );
}

// Controlled section for entering result set details
function ResultSetDetailsSection({
  formData,
  setFormData,
  experiments,
  loadingExperiments,
}) {
  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Dataset Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {loadingExperiments ? (
          <p className="text-sm text-slate-500">Loading experiments...</p>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="experimentId">
                Linked experiment
                <FieldRequirement required={false} />
              </Label>
              <select
                id="experimentId"
                name="experimentId"
                value={formData.experimentId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">No linked experiment</option>
                {experiments.map((experiment) => (
                  <option key={experiment.id} value={experiment.id}>
                    {experiment.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Result set title
                <FieldRequirement required />
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter result set title"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>
                Experiment type
                <FieldRequirement required />
              </Label>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="experimentType"
                    value="in_vivo"
                    checked={formData.experimentType === "in_vivo"}
                    onChange={handleChange}
                    required
                  />
                  in vivo
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="experimentType"
                    value="in_vitro"
                    checked={formData.experimentType === "in_vitro"}
                    onChange={handleChange}
                    required
                  />
                  in vitro
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurementName">
                Measurement name
                <FieldRequirement required />
              </Label>
              <Input
                id="measurementName"
                name="measurementName"
                value={formData.measurementName}
                onChange={handleChange}
                placeholder="Example: mice stimulated with dopamine"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurementUnit">
                Measurement unit
                <FieldRequirement required={false} />
              </Label>
              <Input
                id="measurementUnit"
                name="measurementUnit"
                value={formData.measurementUnit}
                onChange={handleChange}
                placeholder="Example: mg, mm, %"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description
                <FieldRequirement required={false} />
              </Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="Add general notes about this result set"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ResultSetDetailsSection;