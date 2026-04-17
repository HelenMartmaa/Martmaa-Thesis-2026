import { useState } from "react";
import useAuth from "../../features/auth/useAuth";
import { createExperimentRequest } from "../../features/planning/planningApi";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Form for creating a new experiment
function NewExperimentForm() {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    experimentType: "in vivo",
    description: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);

      await createExperimentRequest(formData, token);

      setSuccessMessage("Experiment created successfully.");

      setFormData({
        title: "",
        experimentType: "in vivo",
        description: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create experiment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Experiment title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter experiment title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experimentType">Experiment type</Label>
            <select
              id="experimentType"
              name="experimentType"
              value={formData.experimentType}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="in vivo">in vivo</option>
              <option value="in vitro">in vitro</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a short description of the experiment"
              className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Experiment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default NewExperimentForm;