import { useEffect, useRef, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import { createExperimentRequest, updateExperimentRequest } from "../../features/planning/planningApi";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Form for creating a new experiment
// Shared form for both creating and editing experiments
function NewExperimentForm({
  mode = "create",
  initialData = null,
  experimentId = null,
  onSuccess = null,
	isExperimentLocked = false,
}) {
  const { token } = useAuth();

	const getInitialFormData = () => ({
		title: initialData?.title || "",
		description: initialData?.description || "",
		aim: initialData?.aim || "",
		experimentType: initialData?.experimentType || "in_vivo",
		organismName: initialData?.organismName || "",
		completed: initialData?.status === "completed" ? "yes" : "no",
		startDate: initialData?.startDate ? initialData.startDate.split("T")[0] : "",
		endDate: initialData?.endDate ? initialData.endDate.split("T")[0] : "",
		scheduleNotes: initialData?.scheduleNotes || "",
		methodsText: initialData?.methodsText || "",
		resourcesText: initialData?.resourcesText || "",
		treatmentPlanText: initialData?.treatmentPlanText || "",
		notes: initialData?.notes || "",
		hypotheses:
			initialData?.hypotheses?.length > 0
				? initialData.hypotheses.map((item) => item.hypothesisText)
				: [""],
	});
	
	const [formData, setFormData] = useState(getInitialFormData);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
	const [startDateError, setStartDateError] = useState("");
	const [endDateError, setEndDateError] = useState("");
	const [dateError, setDateError] = useState("");
	const [showForm, setShowForm] = useState("true");

	// Resets form fields and validation state
	const resetForm = ({ clearSuccess = true } = {}) => {
		setFormData(getInitialFormData());

		setError("");
		setStartDateError("");
		setEndDateError("");

		if (clearSuccess) {
			setSuccessMessage("");
		}
	};

	// Restores the empty form after successful saving
	const handleAddAnotherExperiment = () => {
		resetForm();
		setShowForm(true);
	}

	// Sets character counts for text box fields with max count
	function CharacterCount({ current, max }) {
		return (
			<p className="text-xs text-slate-500">
				{current ?? 0}/{max}
			</p>
		);
	}

	const successRef = useRef(null);
	// Used for validating date inputs against the current day
	const today = new Date().toISOString().split("T")[0];
	const isCompleted = formData.completed === "yes";

	function FieldRequirement ({ required }) {
		return (
			<span className="text-slate-500">
				{" "}
				({required ? "Required" : "Optional"})
			</span>
		);
	}

	// Hypothesis control
	const handleHypothesisChange = (index, value) => {
		const updatedHypotheses = [...formData.hypotheses];
		updatedHypotheses[index] = value;

		setFormData((prev) => ({
			...prev,
			hypotheses: updatedHypotheses,
		}));
	};

	const addHypothesisField = () => {
		setFormData((prev) => ({
			...prev,
			hypotheses: [...prev.hypotheses, ""],
		}));
	};

	const removeHypothesisField = (index) => {
		if (formData.hypotheses.length === 1) return;

		const updatedHypotheses = formData.hypotheses.filter((_, i) => i !== index);

		setFormData((prev) => ({
				...prev,
				hypotheses: updatedHypotheses,
			}));
	};

	// Validates start and end dates based on completion status
	const validateDates = (data) => {
		let startError = "";
		let endError = "";

		const hasStartDate = Boolean(data.startDate);
		const hasEndDate = Boolean(data.endDate);
		const completed = isCompletedValue(data.completed);

		if (completed) {
			if (!hasStartDate) {
				startError = "Completed experiments must have a start date.";
			} else if (data.startDate > today) {
				startError = "Completed experiments cannot have a start date in the future.";
			}

			if (!hasEndDate) {
				endError = "Completed experiments must have an end date.";
			} else if (data.endDate > today) {
				endError = "Completed experiments cannot have an end date in the future.";
			}
		} else {
			// If experiment is not completed, an entered end date must be in the future
			if (hasEndDate && data.endDate <= today) {
				endError =
					"Experiments that are not completed yet cannot have an end date in the past or today.";
			}
  }

		// This rule applies in every case if both dates are present
		if (hasStartDate && hasEndDate && data.endDate < data.startDate) {
			endError = "End date cannot be earlier than start date.";
		}

		setStartDateError(startError);
		setEndDateError(endError);

		return {
			startError,
			endError,
		};
	};

	// Helper for checking completion choice
	const isCompletedValue = (value) => value === "yes";

  const handleChange = (event) => {
  const { name, value } = event.target;

  const updatedFormData = {
			...formData,
			[name]: value,
		};

		setFormData(updatedFormData);

		// Clears generic submit error while the user is editing
		setError("");

		// Re-validates dates live when relevant fields change
		if (name === "completed" || name === "startDate" || name === "endDate") {
			validateDates(updatedFormData);
		}
	};

  const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setSuccessMessage("");

		if (mode === "edit" && isExperimentLocked) {
			try {
				setIsSubmitting(true);

				await updateExperimentRequest(
					experimentId,
					{
						notes: formData.notes,
					},
					token
				);

				setSuccessMessage("General notes updated successfully.");

				if (onSuccess) {
					onSuccess();
				}
			} catch (err) {
				setError(err.response?.data?.error || "Failed to update general notes.");
			} finally {
				setIsSubmitting(false);
			}

			return;
		}

		const cleanedHypotheses = formData.hypotheses
			.map((item) => item.trim())
			.filter((item) => item.length > 0);

		if (
			!formData.title.trim() ||
			!formData.description.trim() ||
			!formData.aim.trim() ||
			!formData.organismName.trim() ||
			!formData.methodsText.trim()
		) {
			setError("Please fill in all required fields.");
			return;
		}

		if (cleanedHypotheses.length === 0) {
			setError("At least one hypothesis is required.");
			return;
		}

		const { startError, endError } = validateDates(formData);

		if (startError || endError) {
			return;
		}

		try {
			setIsSubmitting(true);

			// Maps the yes/no UI choice into backend status values
			const payload = {
				...formData,
				status: isCompleted ? "completed" : "planned",
			};

			if (mode === "edit" && experimentId) {
				await updateExperimentRequest(experimentId, payload, token);
				setSuccessMessage("Experiment updated successfully.");

				if (onSuccess) {
					onSuccess();
				}
			} else {
				await createExperimentRequest(payload, token);
				resetForm({ clearSuccess: false });
				setSuccessMessage("Experiment created successfully.");
				setShowForm(false);
			}

			setSuccessMessage("Experiment created successfully.");

			resetForm({ clearSuccess: false });
			setSuccessMessage("Experiment created successfully.");
			setShowForm(false);

			setStartDateError("");
			setEndDateError("");
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

	useEffect(() => {
		if (initialData) {
			setFormData(getInitialFormData());
		}
	}, [initialData]);

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardContent className="pt-6">
				{!showForm ? (
					<div className="space-y-5">
						{successMessage && (
							<div
								ref={successRef}
								tabIndex="-1"
								className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 outline-none">
									{successMessage}
							</div>
						)}

						<Button type="button" onClick={handleAddAnotherExperiment}>
							Add another experiment
						</Button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
							<Label htmlFor="title">Experiment title
								<FieldRequirement required />
							</Label>
							<Input
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								disabled={isExperimentLocked}
								maxLength={255}
								placeholder="Enter experiment title"
								required
							/>
							<CharacterCount current={(formData.title || "").length} max={255} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Short description
								<FieldRequirement required />
							</Label>
							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								disabled={isExperimentLocked}
								maxLength={1000}
								className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
								placeholder="Provide a short scientific description of the experiment"
								required
							/>
							<CharacterCount current={(formData.description || "").length} max={1000} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="aim">Aim of the experiment / study
								<FieldRequirement required />
							</Label>
							<textarea
								id="aim"
								name="aim"
								value={formData.aim}
								onChange={handleChange}
								disabled={isExperimentLocked}
								maxLength={1000}
								className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
								placeholder="State the aim of this experiment and research question(s)"
								required
							/>
							<CharacterCount current={(formData.aim || "").length} max={1000} />
						</div>

						<div className="space-y-3">
							<Label>Hypotheses
								<FieldRequirement required />
							</Label>

							<div className="space-y-3">
								{formData.hypotheses.map((hypothesis, index) => (
									<div key={index} className="space-y-2">
										<textarea
											value={hypothesis}
											onChange={(event) => handleHypothesisChange(index, event.target.value)}
											disabled={isExperimentLocked}
											maxLength={500}
											className="min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
											placeholder={`Hypothesis ${index + 1}`}
											required={index === 0}
										/>
										<CharacterCount current={(hypothesis || "").length} max={500} />

										{formData.hypotheses.length > 1 && (
											<Button
												type="button"
												variant="outline"
												onClick={() => removeHypothesisField(index)}
												disabled={isExperimentLocked}
											>
												Remove hypothesis
											</Button>
										)}
									</div>
								))}
							</div>

							<Button type="button" variant="secondary" onClick={addHypothesisField} disabled={isExperimentLocked}>
								Add hypothesis
							</Button>
						</div>

						<div className="space-y-3">
							<Label>Experiment type
								<FieldRequirement required />
							</Label>
							<div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
								<label className="flex items-center gap-2 text-sm text-slate-700">
									<input
										type="radio"
										name="experimentType"
										value="in_vivo"
										aria-label="Experiment type is in vivo"
										checked={formData.experimentType === "in_vivo"}
										onChange={handleChange}
										disabled={isExperimentLocked}
									/>
									<i>in vivo</i>
								</label>

								<label className="flex items-center gap-2 text-sm text-slate-700">
									<input
										type="radio"
										name="experimentType"
										value="in_vitro"
										aria-label="Experiment type is in vitro"
										checked={formData.experimentType === "in_vitro"}
										onChange={handleChange}
										disabled={isExperimentLocked}
									/>
									<i>in vitro</i>
								</label>
							</div>
						</div>

						<div className="space-y-3">
							<Label>
								Is the experiment completed already?
								<FieldRequirement required />
							</Label>

							<div
								className="flex flex-col gap-3 sm:flex-row sm:gap-6"
								role="radiogroup"
								aria-required="true"
								aria-label="Is the experiment completed already?"
							>
								<label className="flex items-center gap-2 text-sm text-slate-700">
									<input
										type="radio"
										name="completed"
										value="yes"
										checked={formData.completed === "yes"}
										onChange={handleChange}
										disabled={isExperimentLocked}
										required
									/>
									Yes
								</label>

								<label className="flex items-center gap-2 text-sm text-slate-700">
									<input
										type="radio"
										name="completed"
										value="no"
										checked={formData.completed === "no"}
										onChange={handleChange}
										disabled={isExperimentLocked}
										required
									/>
									No
								</label>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="organismName">Organism / subject
								<FieldRequirement required />
							</Label>
							<Input
								id="organismName"
								name="organismName"
								value={formData.organismName}
								onChange={handleChange}
								disabled={isExperimentLocked}
								placeholder="Example: Mus musculus / E. coli / protein name"
								required
							/>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="startDate">
									Start date
									<FieldRequirement required={isCompleted} />
								</Label>
								<Input
									id="startDate"
									name="startDate"
									type="date"
									value={formData.startDate}
									onChange={handleChange}
									disabled={isExperimentLocked}
									aria-invalid={Boolean(startDateError)}
									aria-describedby={startDateError ? "start-date-error" : undefined}
								/>

								{startDateError && (
									<p id="start-date-error" className="text-sm text-red-600" role="alert">
										{startDateError}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="endDate">
									End date
									<FieldRequirement required={isCompleted} />
								</Label>
								<Input
									id="endDate"
									name="endDate"
									type="date"
									value={formData.endDate}
									onChange={handleChange}
									disabled={isExperimentLocked}
									aria-invalid={Boolean(endDateError)}
									aria-describedby={endDateError ? "end-date-error" : undefined}
								/>

								{endDateError && (
									<p id="end-date-error" className="text-sm text-red-600" role="alert">
										{endDateError}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="scheduleNotes">Schedule notes
								<FieldRequirement required={false} />
							</Label>
							<textarea
								id="scheduleNotes"
								name="scheduleNotes"
								value={formData.scheduleNotes}
								onChange={handleChange}
								disabled={isExperimentLocked}
								maxLength={1000}
								className="min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
								placeholder="Add scheduling details or timing notes"
							/>
							<CharacterCount current={(formData.scheduleNotes || "").length} max={1000} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="methodsText">Methods
								<FieldRequirement required />
							</Label>
							<textarea
								id="methodsText"
								name="methodsText"
								value={formData.methodsText}
								onChange={handleChange}
								disabled={isExperimentLocked}
								maxLength={2000}
								className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
								placeholder="Describe the methods used in the experiment"
								required
							/>
							<CharacterCount current={(formData.methodsText || "").length} max={2000} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="resourcesText">Resources
								<FieldRequirement required={false} />
							</Label>
							<textarea
								id="resourcesText"
								name="resourcesText"
								value={formData.resourcesText}
								onChange={handleChange}
								disabled={isExperimentLocked}
								maxLength={1500}
								className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
								placeholder="Describe materials and resources needed"
							/>
							<CharacterCount current={(formData.resourcesText || "").length} max={1500} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="treatmentPlanText">Treatment / intervention plan
								<FieldRequirement required={false} />
							</Label>
							<textarea
								id="treatmentPlanText"
								name="treatmentPlanText"
								value={formData.treatmentPlanText}
								onChange={handleChange}
								disabled={isExperimentLocked}
								maxLength={1500}
								className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
								placeholder="Describe treatment or intervention details"
							/>
							<CharacterCount current={(formData.treatmentPlanText || "").length} max={1500} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="notes">General notes
								<FieldRequirement required={false} />
							</Label>
							<textarea
								id="notes"
								name="notes"
								value={formData.notes}
								onChange={handleChange}
								maxLength={1500}
								className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
								placeholder="Add any additional comments"
							/>
							<CharacterCount current={(formData.notes || "").length} max={1500} />
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							<Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
								{isSubmitting
									? mode === "edit"
										? "Updating..."
										: "Saving..."
									: mode === "edit"
										? isExperimentLocked
											? "Save General Notes"
											: "Update Experiment"
										: "Create Experiment"}
							</Button>

							<Button
								type="button"
								variant="outline"
								className="w-full sm:w-auto"
								onClick={() => resetForm()}
								disabled={isExperimentLocked}
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

export default NewExperimentForm;