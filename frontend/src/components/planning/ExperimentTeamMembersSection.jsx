import { useEffect, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import {
  createExperimentTeamMemberRequest,
  getExperimentTeamMembersRequest,
} from "../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Displays and adds experiment team members
function ExperimentTeamMembersSection({ experimentId }) {
  const { token } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    memberName: "",
    memberRole: "",
    memberEmail: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Experiment Team Members</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Add research team members and collaborators related to this experiment.
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
              <p className="font-medium text-slate-900">{member.memberName}</p>
              {member.memberRole && (
                <p className="text-sm text-slate-600">Role: {member.memberRole}</p>
              )}
              {member.memberEmail && (
                <p className="text-sm text-slate-600">Email: {member.memberEmail}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExperimentTeamMembersSection;
