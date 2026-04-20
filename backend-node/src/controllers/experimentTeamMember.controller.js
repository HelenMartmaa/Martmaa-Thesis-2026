import { createExperimentTeamMemberService, getExperimentTeamMembersService } from "../services/experimentTeamMember.service.js";

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

export { createExperimentTeamMemberController, getExperimentTeamMembersController };