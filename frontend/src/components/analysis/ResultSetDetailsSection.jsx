import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

// Sets character counts for text box fields with max count
function CharacterCount({ current, max }) {
	return (
		<p className="text-xs text-slate-500">
			{current ?? 0}/{max}
		</p>
	);
}

// Controlled section for entering result set details
function ResultSetDetailsSection({
  formData,
  setFormData,
  experiments,
  loadingExperiments,
	datasetSource,
	setDatasetSource,
	selectedExperiment,
	isEditMode = false,
}) {
  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

	const handleDatasetSourceChange = (source) => {
		setDatasetSource(source);

		if (source === "standalone") {
			setFormData((prev) => ({
				...prev,
				experimentId: "",
			}));
		}
	};

	const formatExperimentType = (value) => {
		if (value === "in_vivo") return "in vivo";
		if (value === "in_vitro") return "in vitro";
		return value || "—";
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
						<div className="space-y-3">
  						<Label>Dataset source:</Label>
							<div className="grid gap-3 sm:grid-cols-2">
								<button
									type="button"
									disabled={isEditMode}
									onClick={() => handleDatasetSourceChange("linked")}
									className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
										datasetSource === "linked"
											? "border-slate-900 bg-slate-100 text-slate-900"
											: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
									} ${isEditMode ? "cursor-not-allowed opacity-70" : ""}`}
								>
									<span className="block font-medium">Link to planned experiment</span>
									<span className="mt-1 block text-xs text-slate-500">
										Use subjects and groups from an existing planned experiment.
									</span>
								</button>

								<button
									type="button"
									disabled={isEditMode}
									onClick={() => handleDatasetSourceChange("standalone")}
									className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
										datasetSource === "standalone"
											? "border-slate-900 bg-slate-100 text-slate-900"
											: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
									} ${isEditMode ? "cursor-not-allowed opacity-70" : ""}`}
								>
									<span className="block font-medium">Standalone dataset</span>
									<span className="mt-1 block text-xs text-slate-500">
										Enter values manually without linking them to planning data.
									</span>
								</button>
							</div>
							{isEditMode && (
								<p className="text-xs text-slate-500">
									Dataset source cannot be changed after creation. Create a new dataset if you need a different source type.
								</p>
							)}
						</div>

						{datasetSource === "linked" && (
							<div className="space-y-2">
								<Label htmlFor="experimentId">Linked experiment (required)</Label>

								{loadingExperiments ? (
									<p className="text-sm text-slate-500">Loading experiments...</p>
								) : (
									<select
										id="experimentId"
										name="experimentId"
										value={formData.experimentId}
										onChange={handleChange}
										className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
									>
										<option value="">No experiment selected</option>
										{experiments.map((experiment) => (
											<option key={experiment.id} value={experiment.id}>
												{experiment.title}
											</option>
										))}
									</select>
								)}
							</div>
						)}

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

{/* 				Preventing update of datasets that are already linked to saved analyses */}
{/* 						const preventEntryChangesIfAnalyzed = async (resultSetId, userId) => {
							const relatedAnalysisCount = await countStatisticalAnalysesByResultSetId(
								resultSetId,
								userId
							);

							if (relatedAnalysisCount > 0) {
								throw new Error(
									"This result dataset is already used in a saved statistical analysis and its entries can no longer be changed."
								);
							}
						}; */}

						<div className="space-y-3">
							<Label>
								Experiment type
								<FieldRequirement required />
							</Label>

							{datasetSource === "linked" ? (
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
									<p>
										<span className="font-medium text-slate-900">Experiment type:</span>{" "}
										<i>{formatExperimentType(formData.experimentType)}</i>
									</p>
									<p className="mt-1 text-xs text-slate-500">
										This value is inherited from the linked planned experiment and cannot be changed here.
									</p>
								</div>
							) : (
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
							)}
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
								maxLength={500}
                className="min-h-30 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="Add general notes about this result set"
              />
							<CharacterCount current={(formData.description|| "").length} max={500} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ResultSetDetailsSection;