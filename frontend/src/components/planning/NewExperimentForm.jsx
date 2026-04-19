import { useEffect, useRef, useState } from "react";
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
    experimentType: "in_vivo",
    organismName: "",
    startDate: "",
    endDate: "",
    scheduleNotes: "",
    methodsText: "",
    resourcesText: "",
    treatmentPlanText: "",
    notes: "",
    status: "planned",
  });

	const today = new Date().toISOString().split("T")[0];
	const successRef = useRef(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
	const [dateError, setDateError] = useState("");

  const handleChange = (event) => {
  const { name, value } = event.target;

  const updatedFormData = {
			...formData,
			[name]: value,
		};

		setFormData(updatedFormData);

		// Live validation for experiments with "completed" status: end date must not be later than today
		if (
			updatedFormData.status === "completed" &&
			updatedFormData.endDate &&
			updatedFormData.endDate > today
		) {
			setDateError("Completed experiments cannot have an end date in the future.");
		} else {
			setDateError("");
		}

		if (
			updatedFormData.status === "completed" &&
			updatedFormData.startDate &&
			updatedFormData.startDate > today
		) {
			setDateError("Completed experiments cannot have a start date in the future.");
		} else {
			setDateError("");
		}
	};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);

      await createExperimentRequest(formData, token);

      setSuccessMessage("Experiment created successfully.");

			if (formData.status === "completed" && formData.startDate && formData.startDate > today) {
				setDateError("Completed experiments cannot have a start date in the future.");
				return;
			}

			if (formData.status === "completed" && formData.endDate && formData.endDate > today) {
				setDateError("Completed experiments cannot have an end date in the future.");
				return;
			}

			if (formData.status === "completed" && !formData.endDate) {
				setDateError("Completed experiments must have an end date.");
				return;
			}

			if (formData.status === "completed" && !formData.startDate) {
				setDateError("Completed experiments must have a start date.");
				return;
			}

      setFormData({
        title: "",
        experimentType: "in_vivo",
        organismName: "",
        startDate: "",
        endDate: "",
        scheduleNotes: "",
        methodsText: "",
        resourcesText: "",
        treatmentPlanText: "",
        notes: "",
        status: "planned",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create experiment.");
    } finally {
      setIsSubmitting(false);
    }
  };

	useEffect(() => {
		if (successMessage && successRef.current) {
			// Scrolls to top and moves keyboard focus to success feedback
			window.scrollTo({ top: 0, behavior: "smooth" });
			successRef.current.focus();
		}
	}, [successMessage]);

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardContent className="pt-6">
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
            <Label htmlFor="title">Experiment title (Required)</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter experiment title"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Experiment type (Required)</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="experimentType"
                  value="in_vivo"
                  checked={formData.experimentType === "in_vivo"}
                  onChange={handleChange}
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
                />
                in vitro
              </label>
            </div>
          </div>

					<div className="space-y-3">
            <Label>Status (Required)</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="status"
                  value="planned"
                  checked={formData.status === "planned"}
                  onChange={handleChange}
                />
                planned
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={formData.status === "completed"}
                  onChange={handleChange}
                />
                completed
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="organismName">Organism / subject name (Required)</Label>
            <Input
              id="organismName"
              name="organismName"
              value={formData.organismName}
              onChange={handleChange}
              placeholder="Example: Mus musculus / E. coli / protein name"
							required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
							{dateError && (
								<p className="text-sm text-red-600" role="alert">
									{dateError}
								</p>
							)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
							{dateError && (
								<p className="text-sm text-red-600" role="alert">
									{dateError}
								</p>
							)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduleNotes">Schedule notes</Label>
            <textarea
              id="scheduleNotes"
              name="scheduleNotes"
              value={formData.scheduleNotes}
              onChange={handleChange}
              className="min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              placeholder="Add scheduling details or timing notes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="methodsText">Methods (Required)</Label>
            <textarea
              id="methodsText"
              name="methodsText"
              value={formData.methodsText}
              onChange={handleChange}
              className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              placeholder="Describe the methods used in the experiment"
							required
            />
          </div>

					<div className="space-y-2">
            <Label htmlFor="resourcesText">Resources</Label>
            <textarea
              id="resourcesText"
              name="resourcesText"
              value={formData.resourcesText}
              onChange={handleChange}
              className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              placeholder="Describe materials and resources needed"
            />
          </div>

					<div className="space-y-2">
            <Label htmlFor="treatmentPlanText">Treatment / intervention plan</Label>
            <textarea
              id="treatmentPlanText"
              name="treatmentPlanText"
              value={formData.treatmentPlanText}
              onChange={handleChange}
              className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              placeholder="Describe treatment or intervention details"
            />
          </div>

					<div className="space-y-2">
            <Label htmlFor="notes">General notes</Label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              placeholder="Add any additional comments"
            />
          </div>

{/*           <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <textarea
              id="description"
              name="description"
              aria-label="Add a short description for the experiment, optional"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a short description of the experiment"
              className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </div> */}

          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Experiment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default NewExperimentForm;