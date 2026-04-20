import { createExperimentTeamMember, getExperimentTeamMembersByExperimentId } from "../repositories/experimentTeamMember.repository.js";
import { getExperimentByIdAndUserId } from "../repositories/experiment.repository.js";

// Validates and creates a new team member for an experiment
const createExperimentTeamMemberService = async ({
  experimentId,
  userId,
  memberName,
  memberRole,
  memberEmail,
}) => {
  const parsedExperimentId = Number(experimentId);

  if (!parsedExperimentId || Number.isNaN(parsedExperimentId)) {
    throw new Error("Invalid experiment id.");
  }

  const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  const trimmedMemberName = memberName?.trim();

  if (!trimmedMemberName) {
    throw new Error("Member name is required.");
  }

  return createExperimentTeamMember({
    experimentId: parsedExperimentId,
    memberName: trimmedMemberName,
    memberRole: memberRole?.trim() || null,
    memberEmail: memberEmail?.trim() || null,
  });
};

// Returns all team members for one experiment owned by the current user
const getExperimentTeamMembersService = async ({ experimentId, userId }) => {
  const parsedExperimentId = Number(experimentId);

  if (!parsedExperimentId || Number.isNaN(parsedExperimentId)) {
    throw new Error("Invalid experiment id.");
  }

  const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  return getExperimentTeamMembersByExperimentId(parsedExperimentId);
};

export { createExperimentTeamMemberService, getExperimentTeamMembersService };