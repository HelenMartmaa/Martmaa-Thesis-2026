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
function ExperimentGroupsSection({ experimentId, groups, setGroups }) {
  const { token } = useAuth();

  
  const [groupNameError, setGroupNameError] = useState("");
  const [showForm, setShowForm] = useState(false);
/*   const [groups, setGroups] = useState([]); */
  const [formData, setFormData] = useState({
    name: "",
    groupType: "",
		customGroupType: "",
    description: "",
  });
  const [error, setError] = useState("");
/*   const [loading, setLoading] = useState(true); */

  const loadGroups = async () => {
    try {
      const data = await getExperimentGroupsRequest(experimentId, token);
      setGroups(data.groups);
    } catch (err) {
      setError("Failed to load groups.");
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

    if (event.target.name === "name") {
      setGroupNameError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

		const finalGroupType =
  		formData.groupType === "custom"
    		? formData.customGroupType.trim()
    		: formData.groupType;


    try {
      await createExperimentGroupRequest(experimentId, formData, token);

      setFormData({
        name: "",
        groupType: "",
				customGroupType: "",
        description: "",
      });

      await loadGroups();
      setShowForm(false);
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to create group.";

      if (message.includes("group with this name already exists")) {
        setGroupNameError(message);
      } else {
        setError(message);
      }
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Experiment Groups</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Define subject groups first if the subjects need to be assigned to one of these groups.
          </p>

          <Button type="button" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Close form" : "Add new group"}
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
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Example: WT mice"
              required
              aria-invalid={Boolean(groupNameError)}
              aria-describedby={groupNameError ? "group-name-error" : undefined}
            />

            {groupNameError && (
              <p id="group-name-error" className="text-sm text-red-600" role="alert">
                {groupNameError}
              </p>
            )}
          </div>

					<div className="space-y-2">
						<Label htmlFor="group-type">Group type</Label>
						<select
							id="group-type"
							name="groupType"
							value={formData.groupType}
							onChange={handleChange}
							className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
							required
						>
							<option value="">Select group type</option>
							<option value="control group">Control group</option>
							<option value="placebo group">Placebo group</option>
							<option value="treatment group">Treatment group</option>
							<option value="experimental group">Experimental group</option>
							<option value="custom">Custom</option>
						</select>

						{formData.groupType === "custom" && (
							<div className="space-y-2">
								<Label htmlFor="custom-group-type">Custom group type</Label>
								<Input
									id="custom-group-type"
									name="customGroupType"
									value={formData.customGroupType}
									onChange={handleChange}
									placeholder="Enter custom group type"
									required
								/>
							</div>
						)}
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
        )}
        

        <div className="space-y-3">
          {groups.length === 0 && (
            <p className="text-sm text-slate-500">No groups added yet.</p>
          )}

          {groups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-900">{group.name}</p>
              <p className="text-sm text-slate-600">{group.groupType}</p>
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
