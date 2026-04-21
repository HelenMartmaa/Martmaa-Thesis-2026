import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getSavedExperimentsRequest } from "../../../features/planning/planningApi";
import {
  getResultSetByIdRequest,
  updateResultSetRequest,
} from "../../../features/analysis/resultSetApi";
import {
  getResultEntriesRequest,
  createResultEntryRequest,
  updateResultEntryRequest,
  deleteResultEntryRequest,
} from "../../../features/analysis/resultEntryApi";
import ResultSetDetailsSection from "../../../components/analysis/ResultSetDetailsSection";
import ResultSetSummaryCard from "../../../components/analysis/ResultSetSummaryCard";
import ResultEntriesEditorSection from "../../../components/analysis/ResultEntriesEditorSection";
import { Button } from "../../../components/ui/button";
import BackToTopButton from "../../../components/common/BackToTopButton";

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

// Page for editing an existing result set together with its entries
function EditResultSetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const errorRef = useRef(null);
  const successRef = useRef(null);

  const [experiments, setExperiments] = useState([]);
  const [loadingExperiments, setLoadingExperiments] = useState(true);

  const [resultSet, setResultSet] = useState(null);
  const [originalEntryIds, setOriginalEntryIds] = useState([]);

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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      errorRef.current.focus();
    }
  }, [error]);

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

  useEffect(() => {
    const loadResultSetAndEntries = async () => {
      try {
        const resultSetResponse = await getResultSetByIdRequest(id, token);
        const loadedResultSet = resultSetResponse.resultSet;
        setResultSet(loadedResultSet);

        setFormData({
          experimentId: loadedResultSet.experimentId
            ? String(loadedResultSet.experimentId)
            : "",
          title: loadedResultSet.title || "",
          experimentType: loadedResultSet.experimentType || "in_vivo",
          measurementName: loadedResultSet.measurementName || "",
          measurementUnit: loadedResultSet.measurementUnit || "",
          description: loadedResultSet.description || "",
        });

        const entriesResponse = await getResultEntriesRequest(id, token);
        const loadedEntries = entriesResponse.entries || [];

        setOriginalEntryIds(loadedEntries.map((entry) => entry.id));

        const detectedSurvivalAnalysis = loadedEntries.some(
          (entry) =>
            (entry.timepointValue !== null && entry.timepointValue !== undefined) ||
            entry.eventOccurred === 0 ||
            entry.eventOccurred === 1
        );

        setIsSurvivalAnalysis(detectedSurvivalAnalysis);

        if (loadedEntries.length > 0) {
          setRows(
            loadedEntries.map((entry) => ({
              id: entry.id,
              subjectId: entry.subjectId ? String(entry.subjectId) : "",
              groupId: entry.groupId ? String(entry.groupId) : "",
              sampleCode: entry.sampleCode || "",
              groupLabel: entry.groupLabel || "",
              sex: entry.sex || "",
              numericValue:
                entry.numericValue !== null && entry.numericValue !== undefined
                  ? String(entry.numericValue)
                  : "",
              timepointValue:
                entry.timepointValue !== null && entry.timepointValue !== undefined
                  ? String(entry.timepointValue)
                  : "",
              eventOccurred: entry.eventOccurred === 1,
            }))
          );
        } else {
          setRows([createEmptyRow()]);
        }

        setGeneralNotes("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load result set.");
      } finally {
        setLoading(false);
      }
    };

    loadResultSetAndEntries();
  }, [id, token]);

  const selectedExperimentTitle = useMemo(() => {
    const selected = experiments.find(
      (experiment) => String(experiment.id) === String(formData.experimentId)
    );

    return selected?.title || "";
  }, [experiments, formData.experimentId]);

  const validateBeforeSave = () => {
    if (!formData.title.trim()) {
      return "Result set title is required.";
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

  const handleSaveChanges = async () => {
    setError("");
    setSuccessMessage("");

    const validationError = validateBeforeSave();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      await updateResultSetRequest(id, formData, token);

      const currentExistingIds = rows
        .filter((row) => row.id)
        .map((row) => row.id);

      const deletedEntryIds = originalEntryIds.filter(
        (entryId) => !currentExistingIds.includes(entryId)
      );

      for (const entryId of deletedEntryIds) {
        await deleteResultEntryRequest(id, entryId, token);
      }

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
          eventOccurred: isSurvivalAnalysis ? (row.eventOccurred ? 1 : 0) : null,
        };

        if (row.id) {
          await updateResultEntryRequest(id, row.id, payload, token);
        } else {
          await createResultEntryRequest(id, payload, token);
        }
      }

      setSuccessMessage("Result set and entries were updated successfully.");

      const refreshedEntriesResponse = await getResultEntriesRequest(id, token);
      const refreshedEntries = refreshedEntriesResponse.entries || [];

      setOriginalEntryIds(refreshedEntries.map((entry) => entry.id));

      const detectedSurvivalAnalysis = refreshedEntries.some(
        (entry) =>
          (entry.timepointValue !== null && entry.timepointValue !== undefined) ||
          entry.eventOccurred === 0 ||
          entry.eventOccurred === 1
      );

      setIsSurvivalAnalysis(detectedSurvivalAnalysis);

      if (refreshedEntries.length > 0) {
        setRows(
          refreshedEntries.map((entry) => ({
            id: entry.id,
            subjectId: entry.subjectId ? String(entry.subjectId) : "",
            groupId: entry.groupId ? String(entry.groupId) : "",
            sampleCode: entry.sampleCode || "",
            groupLabel: entry.groupLabel || "",
            sex: entry.sex || "",
            numericValue:
              entry.numericValue !== null && entry.numericValue !== undefined
                ? String(entry.numericValue)
                : "",
            timepointValue:
              entry.timepointValue !== null && entry.timepointValue !== undefined
                ? String(entry.timepointValue)
                : "",
            eventOccurred: entry.eventOccurred === 1,
          }))
        );
      } else {
        setRows([createEmptyRow()]);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to update result set and entries."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <Button asChild variant="outline">
          <Link to={`/analysis/result-sets/${id}`}>
            ⮜ Back to Result Set Details
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Update Result Set
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Edit both the dataset details and the saved result entries in one place.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading result set...</p>}

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

      {!loading && !error && resultSet && (
        <>
          <ResultSetDetailsSection
            formData={formData}
            setFormData={setFormData}
            experiments={experiments}
            loadingExperiments={loadingExperiments}
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
              onClick={handleSaveChanges}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/analysis/result-sets/${id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </>
      )}

      <BackToTopButton />
    </section>
  );
}

export default EditResultSetPage;