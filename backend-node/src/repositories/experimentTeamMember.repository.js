import prisma from "../config/prisma.js";

// Creates a new experiment team member
const createExperimentTeamMember = async ({
  experimentId,
  memberName,
  memberRole,
  memberEmail,
}) => {
  return prisma.experimentTeamMember.create({
    data: {
      experimentId,
      memberName,
      memberRole,
      memberEmail,
    },
  });
};

// Returns all team members for one experiment
const getExperimentTeamMembersByExperimentId = async (experimentId) => {
  return prisma.experimentTeamMember.findMany({
    where: { experimentId },
    orderBy: { createdAt: "asc" },
  });
};

export { createExperimentTeamMember, getExperimentTeamMembersByExperimentId };