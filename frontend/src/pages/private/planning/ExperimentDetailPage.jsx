import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getExperimentByIdRequest, deleteExperimentRequest } from "../../../features/planning/planningApi";
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

  const [experiment, setExperiment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
	const [deleteError, setDeleteError] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const deleteConfirmRef = useRef(null);

	// FOr checking if the time for creating and updating experiment are the same
	const hasBeeenUpdated = (experiment) => {
		return experiment.updatedAt && experiment.updatedAt !== experiment.createdAt;
	};

	// For deleting existing experiment
	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			setDeleteError("");

			await deleteExperimentRequest(id, token);

			navigate("/planning/saved");
		} catch (err) {
			setDeleteError(err.response?.data?.error || "Failed to delete experiment.");
		} finally {
			setIsDeleting(false);
		}
	};
	// Formatting experiment type for better visual displayment
	const formatExperimentType = (value) => {
		if (value === "in_vivo") return "in vivo";
		if (value === "in_vitro") return "in vitro";
		return value;
	};

  useEffect(() => {
    const loadExperiment = async () => {
      try {
        const data = await getExperimentByIdRequest(id, token);
        setExperiment(data.experiment);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load experiment.");
      } finally {
        setLoading(false);
      }
    };

    loadExperiment();
  }, [id, token]);

	// For focusing deletion confirmation warning, also needed to meet the accessibility requirements
	useEffect(() => {
		if (showDeleteConfirm && deleteConfirmRef.current) {
			// Moves the viewport to the delete confirmation box
			deleteConfirmRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});

			// Moves keyboard focus to the confirmation box
			deleteConfirmRef.current.focus();
		}
	}, [showDeleteConfirm])

	const openDeleteConfirm = () => {
		setDeleteError("");
		setShowDeleteConfirm(false);
	};

  return (
    <section className="space-y-6">
			{/* Secondary navigation back to saved experiments list */}
			<div>
				<Button asChild variant="outline">
					<Link to="/planning/saved">⮜ Back to experiments list</Link>
				</Button>
			</div>
			<div className="mb-8 space-y-3">
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					Experiment Details
				</h1>
				<p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
					Review the main details of a saved experiment plan.
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
							<span className="font-medium text-slate-900">Short description:</span>
							<p className="mt-1">{experiment.description}</p>
						</div>

						<div>
							<span className="font-medium text-slate-900">Aim:</span>
							<p className="mt-1">{experiment.aim}</p>
						</div>

						{experiment.hypotheses?.length > 0 && (
							<div>
								<span className="font-medium text-slate-900">Hypotheses:</span>
									<ul className="mt-2 list-disc space-y-2 pl-5">
										{experiment.hypotheses.map((item) => (
											<li key={item.id}>{item.hypothesisText}</li>
										))}
									</ul>
							</div>
						)}

						<div>
							<span className="font-medium text-slate-900">Organism / subject:</span>{" "}
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
								<span className="font-medium text-slate-900">Schedule notes:</span>
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
								<span className="font-medium text-slate-900">Treatment plan:</span>
								<p className="mt-1">{experiment.treatmentPlanText}</p>
							</div>
						)}

						{experiment.notes && (
							<div>
								<span className="font-medium text-slate-900">General notes:</span>
								<p className="mt-1">{experiment.notes}</p>
							</div>
						)}

						<div>
							<p>
								<span className="font-medium text-slate-900">Created at:</span>{" "}
								{new Date(experiment.createdAt).toLocaleString()}
							</p>
							
							{hasBeeenUpdated(experiment) && (
								<p>
									<span className="font-medium text-slate-900">Updated at:</span>{" "}
									{new Date(experiment.updatedAt).toLocaleString()}
								</p>
							)}
						</div>

					</CardContent>
				</Card>
			)}			

			{showDeleteConfirm && (
				<div 
					className="rounded-2xl border border-red-200 bg-red-50 p-4"
					ref={deleteConfirmRef}
					tabIndex="-1"
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
							onClick={openDeleteConfirm}
							disabled={isDeleting}
						>
							Cancel
						</Button>
					</div>
				</div>
			)}

			<div className="flex flex-col gap-3 sm:flex-row">
				<Button asChild variant="outline">
					<Link to={`/planning/${id}/edit`}>Update Experiment</Link>
				</Button>

				<Button
					type="button"
					variant="destructive"
					onClick={() => setShowDeleteConfirm(true)}
				>
					Delete Experiment
				</Button>
			</div>

			<BackToTopButton />
    </section>
  );
}

export default ExperimentDetailPage;