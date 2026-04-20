import { useEffect, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import {
  createExperimentGroupRequest,
  getExperimentGroupsRequest,
  updateExperimentGroupRequest,
  deleteExperimentGroupRequest,
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

// Displays and adds experiment groups
function ExperimentGroupsSection({ experimentId, groups, setGroups }) {
  const { token } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [groupNameError, setGroupNameError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    groupType: "",
		customGroupType: "",
    description: "",
  });
  const [error, setError] = useState("");

	const [editingGroupId, setEditingGroupId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    groupType: "",
    customGroupType: "",
    description: "",
  });

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

  const handleEditChange = (event) => {
    setEditFormData((prev) => ({
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
    setGroupNameError("");

    const finalGroupType =
      formData.groupType === "custom"
        ? formData.customGroupType.trim()
        : formData.groupType;

    try {
      await createExperimentGroupRequest(
        experimentId,
        {
          name: formData.name,
          groupType: finalGroupType,
          description: formData.description,
        },
        token
      );

      setFormData({
        name: "",
        groupType: "",
        customGroupType: "",
        description: "",
      });

      await loadGroups();
      setShowForm(false);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to create group.";

      if (
        message.toLowerCase().includes("group") &&
        message.toLowerCase().includes("exists")
      ) {
        setGroupNameError(message);
      } else {
        setError(message);
      }
    }
  };

	const startEditing = (group) => {
    const predefinedTypes = [
      "control group",
      "placebo group",
      "treatment group",
      "experimental group",
    ];

    const isCustomType = !predefinedTypes.includes(group.groupType);

    setEditingGroupId(group.id);
    setGroupNameError("");
    setEditFormData({
      name: group.name,
      groupType: isCustomType ? "custom" : group.groupType,
      customGroupType: isCustomType ? group.groupType : "",
      description: group.description || "",
    });
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setGroupNameError("");
  };

  const handleUpdate = async (groupId) => {
    setError("");
    setGroupNameError("");

    const finalGroupType =
      editFormData.groupType === "custom"
        ? editFormData.customGroupType.trim()
        : editFormData.groupType;

    try {
      await updateExperimentGroupRequest(
        experimentId,
        groupId,
        {
          name: editFormData.name,
          groupType: finalGroupType,
          description: editFormData.description,
        },
        token
      );

      await loadGroups();
      setEditingGroupId(null);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to update group.";

      if (
        message.toLowerCase().includes("group") &&
        message.toLowerCase().includes("exists")
      ) {
        setGroupNameError(message);
      } else {
        setError(message);
      }
    }
  };

  const handleDelete = async (groupId) => {
    try {
      setError("");
      await deleteExperimentGroupRequest(experimentId, groupId, token);
      await loadGroups();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete group.");
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
							className={groupNameError ? "border-red-500 focus-visible:ring-red-500" : ""}
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
							maxLength={500}
              className="min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              placeholder="Add extra details about this group"
            />
						<CharacterCount current={(formData.description || "").length} max={500} />
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
              {editingGroupId === group.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-group-name-${group.id}`}>Group name</Label>
                    <Input
                      id={`edit-group-name-${group.id}`}
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      required
											aria-invalid={Boolean(groupNameError)}
              				aria-describedby={groupNameError ? "group-name-error" : undefined}
											className={groupNameError ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {groupNameError && (
                      <p className="text-sm text-red-600" role="alert">
                        {groupNameError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-group-type-${group.id}`}>Group type</Label>
                    <select
                      id={`edit-group-type-${group.id}`}
                      name="groupType"
                      value={editFormData.groupType}
                      onChange={handleEditChange}
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
                  </div>

                  {editFormData.groupType === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor={`edit-custom-group-type-${group.id}`}>
                        Custom group type
                      </Label>
                      <Input
                        id={`edit-custom-group-type-${group.id}`}
                        name="customGroupType"
                        value={editFormData.customGroupType}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor={`edit-group-description-${group.id}`}>
                      Description (optional)
                    </Label>
                    <textarea
                      id={`edit-group-description-${group.id}`}
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
											maxLength={500}
                      className="min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
										<CharacterCount current={(formData.description || "").length} max={500} />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" onClick={() => handleUpdate(group.id)}>
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
                    <p className="font-medium text-slate-900">{group.name}</p>
                    <p className="text-sm text-slate-600">{group.groupType}</p>
                    {group.description && (
                      <p className="mt-2 text-sm text-slate-600">
                        {group.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startEditing(group)}
                    >
                      Update
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDelete(group.id)}
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

export default ExperimentGroupsSection;
