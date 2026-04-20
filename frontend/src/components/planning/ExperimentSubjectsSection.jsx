import { useEffect, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import {
  createExperimentSubjectRequest,
  getExperimentSubjectsRequest,
  updateExperimentSubjectRequest,
  deleteExperimentSubjectRequest,
} from "../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Sets character counts for text box fields with max count
function CharacterCount({ current, max }) {
	return (
		<p className="text-xs text-slate-500">
			{current ?? 0}/{max}
		</p>
	);
}

// Displays and manages experiment subjects
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

  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    groupId: "",
    subjectCode: "",
    sex: "",
    genotype: "",
    subjectType: "",
    notes: "",
  });

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

  const handleEditChange = (event) => {
    setEditFormData((prev) => ({
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

  const startEditing = (subject) => {
    setEditingSubjectId(subject.id);
    setSubjectCodeError("");
    setEditFormData({
      groupId: subject.groupId ? String(subject.groupId) : "",
      subjectCode: subject.subjectCode || "",
      sex: subject.sex || "",
      genotype: subject.genotype || "",
      subjectType: subject.subjectType || "",
      notes: subject.notes || "",
    });
  };

  const cancelEditing = () => {
    setEditingSubjectId(null);
    setSubjectCodeError("");
  };

  const handleUpdate = async (subjectId) => {
    setError("");
    setSubjectCodeError("");

    try {
      await updateExperimentSubjectRequest(
        experimentId,
        subjectId,
        editFormData,
        token
      );

      await loadSubjects();
      setEditingSubjectId(null);
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to update subject.";

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

  const handleDelete = async (subjectId) => {
    try {
      setError("");
      await deleteExperimentSubjectRequest(experimentId, subjectId, token);
      await loadSubjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete subject.");
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
            Add experiment subjects. A subject can optionally be linked to one of
            the existing groups.
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
                    {group.name} — {group.groupType}
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
                aria-describedby={
                  subjectCodeError ? "subject-code-error" : undefined
                }
              />

              {subjectCodeError && (
                <p
                  id="subject-code-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
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
								maxLength={500}
                className="min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="Add subject notes"
              />
							<CharacterCount current={(formData.notes || "").length} max={500} />
            </div>

            <Button type="submit">Add Subject</Button>
          </form>
        )}

        <div className="space-y-3">
          {loading && (
            <p className="text-sm text-slate-500">Loading subjects...</p>
          )}

          {!loading && subjects.length === 0 && (
            <p className="text-sm text-slate-500">No subjects added yet.</p>
          )}

          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              {editingSubjectId === subject.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-subject-group-${subject.id}`}>
                      Group (optional)
                    </Label>
                    <select
                      id={`edit-subject-group-${subject.id}`}
                      name="groupId"
                      value={editFormData.groupId}
                      onChange={handleEditChange}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="">No group selected</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name} — {group.groupType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-subject-code-${subject.id}`}>
                      Subject code
                    </Label>
                    <Input
                      id={`edit-subject-code-${subject.id}`}
                      name="subjectCode"
                      value={editFormData.subjectCode}
                      onChange={handleEditChange}
                      required
                    />
                    {subjectCodeError && (
                      <p className="text-sm text-red-600" role="alert">
                        {subjectCodeError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Sex (optional)</Label>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={editFormData.sex === "male" ? "default" : "outline"}
                        onClick={() =>
                          setEditFormData((prev) => ({
                            ...prev,
                            sex: prev.sex === "male" ? "" : "male",
                          }))
                        }
                      >
                        Male
                      </Button>

                      <Button
                        type="button"
                        variant={
                          editFormData.sex === "female" ? "default" : "outline"
                        }
                        onClick={() =>
                          setEditFormData((prev) => ({
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
                    <Label htmlFor={`edit-subject-type-${subject.id}`}>
                      Subject type (optional)
                    </Label>
                    <Input
                      id={`edit-subject-type-${subject.id}`}
                      name="subjectType"
                      value={editFormData.subjectType}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-subject-genotype-${subject.id}`}>
                      Genotype (optional)
                    </Label>
                    <Input
                      id={`edit-subject-genotype-${subject.id}`}
                      name="genotype"
                      value={editFormData.genotype}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-subject-notes-${subject.id}`}>
                      Notes (optional)
                    </Label>
                    <textarea
                      id={`edit-subject-notes-${subject.id}`}
                      name="notes"
											maxLength={500}
                      value={editFormData.notes}
                      onChange={handleEditChange}
                      className="min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
										<CharacterCount current={(formData.notes || "").length} max={500} />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" onClick={() => handleUpdate(subject.id)}>
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {subject.subjectCode}
                    </p>

                    {subject.group && (
                      <p className="text-sm text-slate-600">
                        Group: {subject.group.name} — {subject.group.groupType}
                      </p>
                    )}

                    {subject.subjectType && (
                      <p className="text-sm text-slate-600">
                        Type: {subject.subjectType}
                      </p>
                    )}

                    {subject.sex && (
                      <p className="text-sm text-slate-600">
                        Sex: {subject.sex}
                      </p>
                    )}

                    {subject.genotype && (
                      <p className="text-sm text-slate-600">
                        Genotype: {subject.genotype}
                      </p>
                    )}

                    {subject.notes && (
                      <p className="mt-2 text-sm text-slate-600">
                        {subject.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startEditing(subject)}
                    >
                      Update
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDelete(subject.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExperimentSubjectsSection;