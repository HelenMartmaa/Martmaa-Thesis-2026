import {
  createExperimentGroupService,
  getExperimentGroupsService,
  updateExperimentGroupService,
  deleteExperimentGroupService,
} from "../services/experimentGroup.service.js";

// Handles request for creating a new experiment group
const createExperimentGroupController = async (req, res) => {
  try {
    const group = await createExperimentGroupService({
      experimentId: req.params.experimentId,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(201).json({
      message: "Experiment group created successfully.",
      group,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for loading all groups of one experiment
const getExperimentGroupsController = async (req, res) => {
  try {
    const groups = await getExperimentGroupsService({
      experimentId: req.params.experimentId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      groups,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for updating one group
const updateExperimentGroupController = async (req, res) => {
  try {
    const group = await updateExperimentGroupService({
      experimentId: req.params.experimentId,
      groupId: req.params.groupId,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      message: "Experiment group updated successfully.",
      group,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for deleting one group
const deleteExperimentGroupController = async (req, res) => {
  try {
    await deleteExperimentGroupService({
      experimentId: req.params.experimentId,
      groupId: req.params.groupId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      message: "Experiment group deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export {
  createExperimentGroupController,
  getExperimentGroupsController,
  updateExperimentGroupController,
  deleteExperimentGroupController,
};