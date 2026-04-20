import { useEffect, useRef, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import {
  createResultSetRequest,
  updateResultSetRequest,
} from "../../features/analysis/resultSetApi";
import { getSavedExperimentsRequest } from "../../features/planning/planningApi";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function FieldRequirement({ required }) {
  return (
    <span className="text-slate-500">
      {" "}
      ({required ? "Required" : "Optional"})
    </span>
  );
}

// Shared form for creating and editing result sets
function NewResultSetForm({
  mode = "create",
  initialData = null,
  resultSetId = null,
  onSuccess = null,
}) {
  const { token } = useAuth();

  const [experiments, setExperiments] = useState([]);
  const [loadingExperiments, setLoadingExperiments] = useState(true);

  const [formData, setFormData] = useState({
    experimentId: initialData?.experimentId ? String(initialData.experimentId) : "",
    title: initialData?.title || "",
    experimentType: initialData?.experimentType || "in_vivo",
    measurementName: initialData?.measurementName || "",
    measurementUnit: initialData?.measurementUnit || "",
    description: initialData?.description || "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const successRef = useRef(null);

  useEffect(() => {
    const loadExperiments = async () => {
      try {
        const data = await getSavedExperimentsRequest(token);
        setExperiments(data.experiments);
      } catch (err) {
        setError("Failed to load experiments.");
      } finally {
        setLoadingExperiments(false);
      }
    };

    loadExperiments();
  }, [token]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        experimentId: initialData.experimentId ? String(initialData.experimentId) : "",
        title: initialData.title || "",
        experimentType: initialData.experimentType || "in_vivo",
        measurementName: initialData.measurementName || "",
        measurementUnit: initialData.measurementUnit || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (successMessage && successRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      successRef.current.focus();
    }
  }, [successMessage]);

  const resetForm = ({ clearSuccess = true } = {}) => {
    setFormData({
      experimentId: "",
      title: "",
      experimentType: "in_vivo",
      measurementName: "",
      measurementUnit: "",
      description: "",
    });

    setError("");

    if (clearSuccess) {
      setSuccessMessage("");
    }
  };

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (
      !formData.title.trim() ||
      !formData.experimentType ||
      !formData.measurementName.trim()
    ) {
      setError("Title, experiment type, and measurement name are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === "edit" && resultSetId) {
        await updateResultSetRequest(resultSetId, formData, token);
        setSuccessMessage("Result set updated successfully.");

        if (onSuccess) {
          onSuccess();
        }
      } else {
        await createResultSetRequest(formData, token);
        resetForm({ clearSuccess: false });
        setSuccessMessage("Result set created successfully.");
        setShowForm(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save result set.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnotherResultSet = () => {
    resetForm();
    setShowForm(true);
  };

  if (loadingExperiments) {
    return (
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <p className="text-sm text-slate-500">Loading experiments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        {!showForm ? (
          <div className="space-y-5">
            {successMessage && (
              <div
                ref={successRef}
                tabIndex="-1"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 outline-none"
              >
                {successMessage}
              </div>
            )}

            <Button type="button" onClick={handleAddAnotherResultSet}>
              Add another result set
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <div
                ref={successRef}
                tabIndex="-1"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 outline-none"
              >
                {successMessage}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experimentId">
                Related experiment
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
                  <i>in vivo</i>
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
                  <i>in vitro</i>
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === "edit"
                    ? "Updating..."
                    : "Saving..."
                  : mode === "edit"
                  ? "Update Result Set"
                  : "Create Result Set"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => resetForm()}
              >
                Clear form
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default NewResultSetForm;