import { useEffect, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import {
  createExperimentTeamMemberRequest,
  getExperimentTeamMembersRequest,
  updateExperimentTeamMemberRequest,
  deleteExperimentTeamMemberRequest,
} from "../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Displays and manages experiment team members
function ExperimentTeamMembersSection({ experimentId }) {
  const { token } = useAuth();

  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    memberName: "",
    memberRole: "",
    memberEmail: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    memberName: "",
    memberRole: "",
    memberEmail: "",
  });

  const loadTeamMembers = async () => {
    try {
      const data = await getExperimentTeamMembersRequest(experimentId, token);
      setTeamMembers(data.teamMembers);
    } catch (err) {
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, [experimentId, token]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditChange = (event) => {
    setEditFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await createExperimentTeamMemberRequest(experimentId, formData, token);

      setFormData({
        memberName: "",
        memberRole: "",
        memberEmail: "",
      });

      await loadTeamMembers();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add team member.");
    }
  };

  const startEditing = (member) => {
    setEditingMemberId(member.id);
    setEditFormData({
      memberName: member.memberName || "",
      memberRole: member.memberRole || "",
      memberEmail: member.memberEmail || "",
    });
  };

  const cancelEditing = () => {
    setEditingMemberId(null);
  };

  const handleUpdate = async (memberId) => {
    setError("");

    try {
      await updateExperimentTeamMemberRequest(
        experimentId,
        memberId,
        editFormData,
        token
      );

      await loadTeamMembers();
      setEditingMemberId(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update team member.");
    }
  };

  const handleDelete = async (memberId) => {
    try {
      setError("");
      await deleteExperimentTeamMemberRequest(experimentId, memberId, token);
      await loadTeamMembers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete team member.");
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Experiment Team Members</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Add research team members and collaborators related to this
            experiment.
          </p>

          <Button type="button" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Close form" : "Add team member"}
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
              <Label htmlFor="member-name">Member name</Label>
              <Input
                id="member-name"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                placeholder="Enter team member name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-role">Member role (optional)</Label>
              <Input
                id="member-role"
                name="memberRole"
                value={formData.memberRole}
                onChange={handleChange}
                placeholder="Example: Principal investigator"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-email">Member email (optional)</Label>
              <Input
                id="member-email"
                name="memberEmail"
                type="email"
                value={formData.memberEmail}
                onChange={handleChange}
                placeholder="name@example.com"
              />
            </div>

            <Button type="submit">Add Team Member</Button>
          </form>
        )}

        <div className="space-y-3">
          {loading && (
            <p className="text-sm text-slate-500">Loading team members...</p>
          )}

          {!loading && teamMembers.length === 0 && (
            <p className="text-sm text-slate-500">No team members added yet.</p>
          )}

          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              {editingMemberId === member.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-member-name-${member.id}`}>
                      Member name
                    </Label>
                    <Input
                      id={`edit-member-name-${member.id}`}
                      name="memberName"
                      value={editFormData.memberName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-member-role-${member.id}`}>
                      Member role (optional)
                    </Label>
                    <Input
                      id={`edit-member-role-${member.id}`}
                      name="memberRole"
                      value={editFormData.memberRole}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-member-email-${member.id}`}>
                      Member email (optional)
                    </Label>
                    <Input
                      id={`edit-member-email-${member.id}`}
                      name="memberEmail"
                      type="email"
                      value={editFormData.memberEmail}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" onClick={() => handleUpdate(member.id)}>
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
                      {member.memberName}
                    </p>
                    {member.memberRole && (
                      <p className="text-sm text-slate-600">
                        Role: {member.memberRole}
                      </p>
                    )}
                    {member.memberEmail && (
                      <p className="text-sm text-slate-600">
                        Email: {member.memberEmail}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startEditing(member)}
                    >
                      Update
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
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

export default ExperimentTeamMembersSection;