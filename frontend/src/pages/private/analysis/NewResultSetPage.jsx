import { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../../../features/auth/useAuth";
import { getSavedExperimentsRequest } from "../../../features/planning/planningApi";
import { createResultSetRequest } from "../../../features/analysis/resultSetApi";
import { createResultEntryRequest } from "../../../features/analysis/resultEntryApi";
import ResultSetDetailsSection from "../../../components/analysis/ResultSetDetailsSection";
import ResultSetSummaryCard from "../../../components/analysis/ResultSetSummaryCard";
import ResultEntriesEditorSection from "../../../components/analysis/ResultEntriesEditorSection";
import BackToTopButton from "../../../components/common/BackToTopButton";
import { Button } from "../../../components/ui/button";

const createEmptyRow = () => ({
  subjectId: "",
  groupId: "",
  sampleCode: "",
  groupLabel: "",
  sex: "",
  numericValue: "",
  timepointValue: "",
  eventOccurred: false,
});

// Combined page for creating a result set together with its entries
function NewResultSetPage() {
  const { token } = useAuth();

  const errorRef = useRef(null);
  const successRef = useRef(null);

  const [experiments, setExperiments] = useState([]);
  const [loadingExperiments, setLoadingExperiments] = useState(true);

	const [datasetSource, setDatasetSource] = useState("standalone");

  const [formData, setFormData] = useState({
    experimentId: "",
    title: "",
    experimentType: "in_vivo",
    measurementName: "",
    measurementUnit: "",
    description: "",
  });

  const [rows, setRows] = useState([createEmptyRow()]);
  const [generalNotes, setGeneralNotes] = useState("");
  const [isSurvivalAnalysis, setIsSurvivalAnalysis] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

	const selectedExperiment = useMemo(() => {
		return experiments.find(
			(experiment) => String(experiment.id) === String(formData.experimentId)
		);
	}, [experiments, formData.experimentId]);

	useEffect(() => {
		if (datasetSource === "linked" && selectedExperiment?.experimentType) {
			setFormData((prev) => ({
				...prev,
				experimentType: selectedExperiment.experimentType,
			}));
		}
	}, [datasetSource, selectedExperiment]);

  // For error message
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      errorRef.current.focus();
    }
  }, [error]);

  // For success message
  useEffect(() => {
    if (successMessage && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      successRef.current.focus();
    }
  }, [successMessage]);

  useEffect(() => {
    const loadExperiments = async () => {
      try {
        const data = await getSavedExperimentsRequest(token);
        setExperiments(data.experiments || []);
      } catch (err) {
        setError("Failed to load experiments.");
      } finally {
        setLoadingExperiments(false);
      }
    };

    loadExperiments();
  }, [token]);

  const selectedExperimentTitle = useMemo(() => {
    const selected = experiments.find(
      (experiment) => String(experiment.id) === String(formData.experimentId)
    );

    return selected?.title || "";
  }, [experiments, formData.experimentId]);

  const resetPage = () => {
    setFormData({
      experimentId: "",
      title: "",
      experimentType: "in_vivo",
      measurementName: "",
      measurementUnit: "",
      description: "",
    });

    setRows([createEmptyRow()]);
    setGeneralNotes("");
    setIsSurvivalAnalysis(false);
    setError("");
    setSuccessMessage("");
		setDatasetSource("standalone");
  };

  const validateBeforeSave = () => {
    if (!formData.title.trim()) {
      return "Result set title is required.";
    }

		if (datasetSource === "linked" && !formData.experimentId) {
  		return "Please select linked experiment or choose standalone dataset.";
		}

    if (!formData.experimentType) {
      return "Experiment type is required.";
    }

    if (!formData.measurementName.trim()) {
      return "Measurement name is required.";
    }

    if (rows.length === 0) {
      return "At least one result entry row is required.";
    }

    for (const row of rows) {
      if (isSurvivalAnalysis) {
        if (row.timepointValue === "" || row.timepointValue === null) {
          return "Each survival entry must contain a timepoint value.";
        }

        const parsedTimepoint = Number(
          String(row.timepointValue).replace(/[−–—]/g, "-")
        );

        if (!Number.isFinite(parsedTimepoint)) {
          return "Each survival entry must contain a valid timepoint value.";
        }
      } else {
        if (row.numericValue === "" || row.numericValue === null) {
          return "Each row must contain a numeric value.";
        }

        const normalizedValue = String(row.numericValue).replace(/[−–—]/g, "-");
        const parsedValue = Number(normalizedValue);

        if (!Number.isFinite(parsedValue)) {
          return "Each row must contain a valid numeric value.";
        }
      }
    }

    return "";
  };

  const handleSaveDatasetAndEntries = async () => {
    setError("");
    setSuccessMessage("");

    const validationError = validateBeforeSave();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const resultSetResponse = await createResultSetRequest(formData, token);
      const createdSet = resultSetResponse.resultSet;

      for (const row of rows) {
        const payload = {
          subjectId: formData.experimentId ? row.subjectId || null : null,
          groupId: formData.experimentId ? row.groupId || null : null,
          sampleCode: !formData.experimentId ? row.sampleCode || null : null,
          groupLabel: !formData.experimentId ? row.groupLabel || null : null,
          sex: row.sex || null,
          timepointValue: isSurvivalAnalysis
            ? Number(String(row.timepointValue).replace(/[−–—]/g, "-"))
            : null,
          timepointUnit: isSurvivalAnalysis
            ? formData.measurementUnit || null
            : null,
          numericValue: isSurvivalAnalysis
            ? null
            : Number(String(row.numericValue).replace(/[−–—]/g, "-")),
          eventOccurred: isSurvivalAnalysis
            ? row.eventOccurred
              ? 1
              : 0
            : null,
        };

        await createResultEntryRequest(createdSet.id, payload, token);
      }

      setSuccessMessage("Result set and entries were saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to save result set and entries."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          New Result Dataset
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Define the dataset details, enter the measured values below, and save 
          everything together in one flow. One planned experiment can have several linked result datasets.
        </p>
      </div>

      {error && (
        <div
          ref={errorRef}
          tabIndex="-1"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 outline-none"
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          ref={successRef}
          tabIndex="-1"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 outline-none"
        >
          {successMessage}
        </div>
      )}

      <ResultSetDetailsSection
        formData={formData}
        setFormData={setFormData}
        experiments={experiments}
        loadingExperiments={loadingExperiments}
				datasetSource={datasetSource}
				setDatasetSource={setDatasetSource}
      />

      <ResultSetSummaryCard
        formData={formData}
        selectedExperimentTitle={selectedExperimentTitle}
      />

      <ResultEntriesEditorSection
        experimentId={formData.experimentId}
        rows={rows}
        setRows={setRows}
        generalNotes={generalNotes}
        setGeneralNotes={setGeneralNotes}
        isSurvivalAnalysis={isSurvivalAnalysis}
        setIsSurvivalAnalysis={setIsSurvivalAnalysis}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={handleSaveDatasetAndEntries}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save dataset and entries"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={resetPage}
          disabled={isSubmitting}
        >
          Clear all
        </Button>
      </div>

      <BackToTopButton />
    </section>
  );
}

export default NewResultSetPage;