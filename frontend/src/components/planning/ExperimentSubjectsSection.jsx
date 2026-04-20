import { useEffect, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import {
  createExperimentSubjectRequest,
  getExperimentGroupsRequest,
  getExperimentSubjectsRequest,
} from "../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Displays and adds experiment subjects
function ExperimentSubjectsSection({ experimentId }) {
  const { token } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);
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

  const loadGroups = async () => {
    try {
      const data = await getExperimentGroupsRequest(experimentId, token);
      setGroups(data.groups);
    } catch (err) {
      // Group loading failure should not crash the whole section
    }
  };

  useEffect(() => {
    loadSubjects();
    loadGroups();
  }, [experimentId, token]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

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

      loadSubjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create subject.");
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Experiment Subjects</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
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
                  {group.name}
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
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject-sex">Sex (optional)</Label>
              <Input
                id="subject-sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                placeholder="Example: male / female"
              />
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

        <div className="space-y-3">
          {loading && <p className="text-sm text-slate-500">Loading subjects...</p>}

          {!loading && subjects.length === 0 && (
            <p className="text-sm text-slate-500">No subjects added yet.</p>
          )}

          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-900">{subject.subjectCode}</p>
              {subject.group && (
                <p className="text-sm text-slate-600">Group: {subject.group.name}</p>
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
