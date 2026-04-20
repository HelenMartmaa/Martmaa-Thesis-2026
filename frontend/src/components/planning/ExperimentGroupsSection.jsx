import { useEffect, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import {
  createExperimentGroupRequest,
  getExperimentGroupsRequest,
} from "../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Displays and adds experiment groups
function ExperimentGroupsSection({ experimentId }) {
  const { token } = useAuth();

  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    groupType: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    try {
      const data = await getExperimentGroupsRequest(experimentId, token);
      setGroups(data.groups);
    } catch (err) {
      setError("Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      await createExperimentGroupRequest(experimentId, formData, token);

      setFormData({
        name: "",
        groupType: "",
        description: "",
      });

      loadGroups();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create group.");
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Experiment Groups</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Example: Control group"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-type">Group type</Label>
            <Input
              id="group-type"
              name="groupType"
              value={formData.groupType}
              onChange={handleChange}
              placeholder="Example: control / treatment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-description">Description (optional)</Label>
            <textarea
              id="group-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              placeholder="Add extra details about this group"
            />
          </div>

          <Button type="submit">Add Group</Button>
        </form>

        <div className="space-y-3">
          {loading && <p className="text-sm text-slate-500">Loading groups...</p>}

          {!loading && groups.length === 0 && (
            <p className="text-sm text-slate-500">No groups added yet.</p>
          )}

          {groups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-900">{group.name}</p>
              <p className="text-sm text-slate-600">Type: {group.groupType}</p>
              {group.description && (
                <p className="mt-2 text-sm text-slate-600">{group.description}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExperimentGroupsSection;
