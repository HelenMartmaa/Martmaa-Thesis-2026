import {
  createExperimentGroup,
  getExperimentGroupsByExperimentId,
  getExperimentGroupByName,
  getExperimentGroupById,
  updateExperimentGroupById,
  deleteExperimentGroupById,
} from "../repositories/experimentGroup.repository.js";
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

  const existingGroup = await getExperimentGroupByName(
    parsedExperimentId,
    trimmedName
  );

  if (existingGroup) {
    throw new Error("A group with this name already exists in this experiment.");
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

// Validates and updates one group for an experiment
const updateExperimentGroupService = async ({
  experimentId,
  groupId,
  userId,
  name,
  groupType,
  description,
}) => {
  const parsedExperimentId = Number(experimentId);
  const parsedGroupId = Number(groupId);

  if (
    !parsedExperimentId ||
    Number.isNaN(parsedExperimentId) ||
    !parsedGroupId ||
    Number.isNaN(parsedGroupId)
  ) {
    throw new Error("Invalid id.");
  }

  const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  const existingGroup = await getExperimentGroupById(parsedGroupId);

  if (!existingGroup || existingGroup.experimentId !== parsedExperimentId) {
    throw new Error("Group not found.");
  }

  const trimmedName = name?.trim();
  const trimmedGroupType = groupType?.trim();

  if (!trimmedName || !trimmedGroupType) {
    throw new Error("Group name and group type are required.");
  }

  const duplicateGroup = await getExperimentGroupByName(
    parsedExperimentId,
    trimmedName
  );

  if (duplicateGroup && duplicateGroup.id !== parsedGroupId) {
    throw new Error("A group with this name already exists in this experiment.");
  }

  return updateExperimentGroupById({
    groupId: parsedGroupId,
    name: trimmedName,
    groupType: trimmedGroupType,
    description: description?.trim() || null,
  });
};

// Deletes one group for an experiment
const deleteExperimentGroupService = async ({
  experimentId,
  groupId,
  userId,
}) => {
  const parsedExperimentId = Number(experimentId);
  const parsedGroupId = Number(groupId);

  if (
    !parsedExperimentId ||
    Number.isNaN(parsedExperimentId) ||
    !parsedGroupId ||
    Number.isNaN(parsedGroupId)
  ) {
    throw new Error("Invalid id.");
  }

  const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  const existingGroup = await getExperimentGroupById(parsedGroupId);

  if (!existingGroup || existingGroup.experimentId !== parsedExperimentId) {
    throw new Error("Group not found.");
  }

  return deleteExperimentGroupById(parsedGroupId);
};

export {
  createExperimentGroupService,
  getExperimentGroupsService,
  updateExperimentGroupService,
  deleteExperimentGroupService,
};