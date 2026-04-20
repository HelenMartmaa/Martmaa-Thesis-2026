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

// Returns one team member by id
const getExperimentTeamMemberById = async (memberId) => {
  return prisma.experimentTeamMember.findUnique({
    where: { id: memberId },
  });
};

// Updates one team member by id
const updateExperimentTeamMemberById = async ({
  memberId,
  memberName,
  memberRole,
  memberEmail,
}) => {
  return prisma.experimentTeamMember.update({
    where: { id: memberId },
    data: {
      memberName,
      memberRole,
      memberEmail,
    },
  });
};

// Deletes one team member by id
const deleteExperimentTeamMemberById = async (memberId) => {
  return prisma.experimentTeamMember.delete({
    where: { id: memberId },
  });
};

export {
  createExperimentTeamMember,
  getExperimentTeamMembersByExperimentId,
  getExperimentTeamMemberById,
  updateExperimentTeamMemberById,
  deleteExperimentTeamMemberById,
};