import { createExperimentGroupService, getExperimentGroupsService } from "../services/experimentGroup.service.js";

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

export { createExperimentGroupController, getExperimentGroupsController };