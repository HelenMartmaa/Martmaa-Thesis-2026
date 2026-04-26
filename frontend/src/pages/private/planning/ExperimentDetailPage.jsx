import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getExperimentByIdRequest, deleteExperimentRequest, getExperimentGroupsRequest } from "../../../features/planning/planningApi";
import ExperimentGroupsSection from "../../../components/planning/ExperimentGroupsSection";
import ExperimentSubjectsSection from "../../../components/planning/ExperimentSubjectsSection";
import ExperimentTeamMembersSection from "../../../components/planning/ExperimentTeamMembersSection";
import { Button } from "../../../components/ui/button";
import BackToTopButton from "../../../components/common/BackToTopButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

// Shows the details of one saved experiment
function ExperimentDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [experiment, setExperiment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [groups, setGroups] = useState([]);

  const deleteConfirmRef = useRef(null);

  // Checks whether the experiment has been updated after creation
  const hasBeenUpdated = (experiment) => {
    return experiment.updatedAt && experiment.updatedAt !== experiment.createdAt;
  };

  // Formats experiment type for user-friendly display
  const formatExperimentType = (value) => {
    if (value === "in_vivo") return "in vivo";
    if (value === "in_vitro") return "in vitro";
    return value;
  };

  const openDeleteConfirm = () => {
    setDeleteError("");
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  const loadGroups = async () => {
    try {
      const data = await getExperimentGroupsRequest(id, token);
      setGroups(data.groups);
    } catch (err) {
      // Groups should not break the whole detail page
    }
  };

  // Deletes existing experiment
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteExperimentRequest(id, token);

      navigate("/planning/saved");
    } catch (err) {
      setDeleteError(
        err.response?.data?.error || "Failed to delete experiment."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const loadExperiment = async () => {
      try {
        const data = await getExperimentByIdRequest(id, token);
        setExperiment(data.experiment);
        await loadGroups();
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load experiment.");
      } finally {
        setLoading(false);
      }
    };

    loadExperiment();
  }, [id, token]);

  // Focuses the delete confirmation box after it appears
  useEffect(() => {
    if (showDeleteConfirm && deleteConfirmRef.current) {
      deleteConfirmRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      deleteConfirmRef.current.focus();
    }
  }, [showDeleteConfirm]);

  const linkedAnalysisCount =
    experiment?.resultSets?.reduce(
      (sum, resultSet) =>
        sum +
        (resultSet.statisticalAnalyses?.length ||
          resultSet.analyses?.length ||
          0),
      0
    ) || 0;

  const isExperimentLocked = linkedAnalysisCount > 0;

  return (
    <section className="space-y-6">
      {/* Secondary navigation back to saved experiments list */}
      <div>
        <Button asChild variant="outline">
          <Link to="/planning/saved">⮜ Back to experiments list</Link>
        </Button>
      </div>

      {isExperimentLocked && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Experiment partially locked</p>
          <p className="mt-1">
            This experiment is linked to result data that has already been used in a
            saved statistical analysis. Only General notes and team members can be edited.
          </p>
        </div>
      )}

      <div className="mb-8 space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Experiment Details
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Review, update or delete the main details of a saved experiment plan.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">Loading experiment...</p>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && experiment && (
        <div className="space-y-6">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                {experiment.title}
              </CardTitle>
              <CardDescription>
                Main information about the selected experiment.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
              <div>
                <span className="font-medium text-slate-900">
                  Experiment type:
                </span>{" "}
                <i>{formatExperimentType(experiment.experimentType)}</i>
              </div>

              <div>
                <span className="font-medium text-slate-900">
                  Short description:
                </span>
                <p className="mt-1">{experiment.description}</p>
              </div>

              <div>
                <span className="font-medium text-slate-900">Aim:</span>
                <p className="mt-1">{experiment.aim}</p>
              </div>

              {experiment.hypotheses?.length > 0 && (
                <div>
                  <span className="font-medium text-slate-900">
                    Hypotheses:
                  </span>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    {experiment.hypotheses.map((item) => (
                      <li key={item.id}>{item.hypothesisText}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span className="font-medium text-slate-900">
                  Organism / subject:
                </span>{" "}
                {experiment.organismName}
              </div>

              <div>
                <span className="font-medium text-slate-900">Status:</span>{" "}
                {experiment.status}
              </div>

              {experiment.startDate && (
                <div>
                  <span className="font-medium text-slate-900">Start date:</span>{" "}
                  {new Date(experiment.startDate).toLocaleDateString()}
                </div>
              )}

              {experiment.endDate && (
                <div>
                  <span className="font-medium text-slate-900">End date:</span>{" "}
                  {new Date(experiment.endDate).toLocaleDateString()}
                </div>
              )}

              {experiment.scheduleNotes && (
                <div>
                  <span className="font-medium text-slate-900">
                    Schedule notes:
                  </span>
                  <p className="mt-1">{experiment.scheduleNotes}</p>
                </div>
              )}

              <div>
                <span className="font-medium text-slate-900">Methods:</span>
                <p className="mt-1">{experiment.methodsText}</p>
              </div>

              {experiment.resourcesText && (
                <div>
                  <span className="font-medium text-slate-900">Resources:</span>
                  <p className="mt-1">{experiment.resourcesText}</p>
                </div>
              )}

              {experiment.treatmentPlanText && (
                <div>
                  <span className="font-medium text-slate-900">
                    Treatment plan:
                  </span>
                  <p className="mt-1">{experiment.treatmentPlanText}</p>
                </div>
              )}

              {experiment.notes && (
                <div>
                  <span className="font-medium text-slate-900">
                    General notes:
                  </span>
                  <p className="mt-1">{experiment.notes}</p>
                </div>
              )}

              <div>
                <p>
                  <span className="font-medium text-slate-900">Created at:</span>{" "}
                  {new Date(experiment.createdAt).toLocaleString()}
                </p>

                {hasBeenUpdated(experiment) && (
                  <p>
                    <span className="font-medium text-slate-900">Updated at:</span>{" "}
                    {new Date(experiment.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link to={`/planning/${id}/edit`}>
                Update Experiment Main Information
              </Link>
            </Button>
          </div>

          
          <div className="mb-8 space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Additional Data Section
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Add, update or delete the specific experiment data.
            </p>
          </div>

          <ExperimentGroupsSection
            experimentId={id}
            groups={groups}
            isExperimentLocked={isExperimentLocked}
            setGroups={setGroups}
          />
          <ExperimentSubjectsSection
            experimentId={id}
            groups={groups}
            isExperimentLocked={isExperimentLocked}
          />

          <div className="mb-8 space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Team Members Section
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Add, update or delete the main details of the members of the
              research team.
            </p>
          </div>

          <ExperimentTeamMembersSection experimentId={id} />
        </div>
      )}


          {deleteError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </div>
          )}

          {showDeleteConfirm && (
            <div
              ref={deleteConfirmRef}
              tabIndex="-1"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 outline-none"
            >
              <p className="text-sm font-medium text-red-800">
                Are you sure you want to delete this experiment?
              </p>
              <p className="mt-1 text-sm text-red-700">
                This action cannot be undone.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, delete experiment"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDeleteConfirm}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="destructive"
              onClick={openDeleteConfirm}
            >
              Delete Experiment
            </Button>
          </div>

      <BackToTopButton />
    </section>
  );
}

export default ExperimentDetailPage;

