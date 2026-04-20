import { createExperimentGroup, getExperimentGroupsByExperimentId } from "../repositories/experimentGroup.repository.js";
import { getExperimentByIdAndUserId } from "../repositories/experiment.repository.js";

// Validates and creates a new group for an experiment
const createExperimentGroupService = async ({
  experimentId,
  userId,
  name,
  groupType,
  description,
}) => {
  const parsedExperimentId = Number(experimentId);

  if (!parsedExperimentId || Number.isNaN(parsedExperimentId)) {
    throw new Error("Invalid experiment id.");
  }

  const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  const trimmedName = name?.trim();
  const trimmedGroupType = groupType?.trim();

  if (!trimmedName || !trimmedGroupType) {
    throw new Error("Group name and group type are required.");
  }

  return createExperimentGroup({
    experimentId: parsedExperimentId,
    name: trimmedName,
    groupType: trimmedGroupType,
    description: description?.trim() || null,
  });
};

// Returns all groups for one experiment owned by the current user
const getExperimentGroupsService = async ({ experimentId, userId }) => {
  const parsedExperimentId = Number(experimentId);

  if (!parsedExperimentId || Number.isNaN(parsedExperimentId)) {
    throw new Error("Invalid experiment id.");
  }

  const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  return getExperimentGroupsByExperimentId(parsedExperimentId);
};

export { createExperimentGroupService, getExperimentGroupsService };