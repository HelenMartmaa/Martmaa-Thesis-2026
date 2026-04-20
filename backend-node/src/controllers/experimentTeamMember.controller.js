import {
  createExperimentTeamMemberService,
  getExperimentTeamMembersService,
  updateExperimentTeamMemberService,
  deleteExperimentTeamMemberService,
} from "../services/experimentTeamMember.service.js";

// Handles request for creating a new experiment team member
const createExperimentTeamMemberController = async (req, res) => {
  try {
    const member = await createExperimentTeamMemberService({
      experimentId: req.params.experimentId,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(201).json({
      message: "Experiment team member created successfully.",
      member,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for loading all team members of one experiment
const getExperimentTeamMembersController = async (req, res) => {
  try {
    const teamMembers = await getExperimentTeamMembersService({
      experimentId: req.params.experimentId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      teamMembers,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for updating one team member
const updateExperimentTeamMemberController = async (req, res) => {
  try {
    const member = await updateExperimentTeamMemberService({
      experimentId: req.params.experimentId,
      memberId: req.params.memberId,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      message: "Experiment team member updated successfully.",
      member,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for deleting one team member
const deleteExperimentTeamMemberController = async (req, res) => {
  try {
    await deleteExperimentTeamMemberService({
      experimentId: req.params.experimentId,
      memberId: req.params.memberId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      message: "Experiment team member deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export {
  createExperimentTeamMemberController,
  getExperimentTeamMembersController,
  updateExperimentTeamMemberController,
  deleteExperimentTeamMemberController,
};