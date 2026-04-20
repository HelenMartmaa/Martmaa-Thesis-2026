import { useEffect, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import { createExperimentSubjectRequest, getExperimentSubjectsRequest } from "../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Displays and adds experiment subjects
function ExperimentSubjectsSection({ experimentId, groups }) {
  const { token } = useAuth();

  const [subjectCodeError, setSubjectCodeError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    groupId: "",
    subjectCode: "",
    sex: "",
    genotype: "",
    subjectType: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSubjects = async () => {
    try {
      const data = await getExperimentSubjectsRequest(experimentId, token);
      setSubjects(data.subjects);
    } catch (err) {
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [experimentId, token]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    if (event.target.name === "subjectCode") {
      setSubjectCodeError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubjectCodeError("");

    try {
      await createExperimentSubjectRequest(experimentId, formData, token);

      setFormData({
        groupId: "",
        subjectCode: "",
        sex: "",
        genotype: "",
        subjectType: "",
        notes: "",
      });

      await loadSubjects();
      setShowForm(false);
    } catch (err) {
  		const message =
    		err.response?.data?.error || "Failed to create subject.";

  		if (
    		message.toLowerCase().includes("subject") &&
    		message.toLowerCase().includes("exists")
  		) {
    		setSubjectCodeError(message);
  		} else {
    		setError(message);
  		}
		}
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Experiment Subjects</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Add experiment subjects. A subject can optionally be linked to one of the existing groups.
          </p>

          <Button type="button" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Close form" : "Add new subject"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject-group">Group (optional)</Label>
              <select
                id="subject-group"
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">No group selected</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} - {group.groupType}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject-code">Subject code</Label>
              <Input
                id="subject-code"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleChange}
                placeholder="Example: S-001"
                required
                aria-invalid={Boolean(subjectCodeError)}
                aria-describedby={subjectCodeError ? "subject-code-error" : undefined }
              />

              {subjectCodeError && (
                <p id="subject-code-error" className="text-sm text-red-600" role="alert">
                  {subjectCodeError}
                </p>
              )}
            </div>

						<div className="space-y-3">
							<Label>Sex (optional)</Label>

							<div className="flex flex-wrap gap-2">
								<Button
									type="button"
									variant={formData.sex === "male" ? "default" : "outline"}
									onClick={() =>
										setFormData((prev) => ({
											...prev,
											sex: prev.sex === "male" ? "" : "male",
										}))
									}
								>
									Male
								</Button>

								<Button
									type="button"
									variant={formData.sex === "female" ? "default" : "outline"}
									onClick={() =>
										setFormData((prev) => ({
											...prev,
											sex: prev.sex === "female" ? "" : "female",
										}))
									}
								>
									Female
								</Button>
							</div>

							<p className="text-xs text-slate-500">
								Leave both unselected if not specified.
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subject-type">Subject type (optional)</Label>
							<Input
								id="subject-type"
								name="subjectType"
								value={formData.subjectType}
								onChange={handleChange}
								placeholder="Example: animal / sample"
							/>
						</div>

            <div className="space-y-2">
              <Label htmlFor="subject-genotype">Genotype (optional)</Label>
              <Input
                id="subject-genotype"
                name="genotype"
                value={formData.genotype}
                onChange={handleChange}
                placeholder="Add genotype if applicable"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject-notes">Notes (optional)</Label>
              <textarea
                id="subject-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="Add subject notes"
              />
            </div>

            <Button type="submit">Add Subject</Button>
          </form>
        )}
        
        <div className="space-y-3">
          {subjects.length === 0 && (
            <p className="text-sm text-slate-500">No subjects added yet.</p>
          )}

          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-900">{subject.subjectCode}</p>
              {subject.group && (
                <p className="text-sm text-slate-600">Group: {subject.group.name} - {subject.group.groupType}</p>
              )}
              {subject.subjectType && (
                <p className="text-sm text-slate-600">Type: {subject.subjectType}</p>
              )}
              {subject.sex && (
                <p className="text-sm text-slate-600">Sex: {subject.sex}</p>
              )}
              {subject.genotype && (
                <p className="text-sm text-slate-600">Genotype: {subject.genotype}</p>
              )}
              {subject.notes && (
                <p className="mt-2 text-sm text-slate-600">{subject.notes}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExperimentSubjectsSection;
