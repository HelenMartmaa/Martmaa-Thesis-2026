import { createExperimentSubject, getExperimentSubjectsByExperimentId,  getExperimentSubjectByCode } from "../repositories/experimentSubject.repository.js";
import { getExperimentByIdAndUserId } from "../repositories/experiment.repository.js";

// Validates and creates a new subject for an experiment
const createExperimentSubjectService = async ({
  experimentId,
  userId,
  groupId,
  subjectCode,
  sex,
  genotype,
  subjectType,
  notes,
}) => {
  const parsedExperimentId = Number(experimentId);

  if (!parsedExperimentId || Number.isNaN(parsedExperimentId)) {
    throw new Error("Invalid experiment id.");
  }

  const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  const trimmedSubjectCode = subjectCode?.trim();

  if (!trimmedSubjectCode) {
    throw new Error("Subject code is required.");
  }

	const existingSubject = await getExperimentSubjectByCode(
		parsedExperimentId,
		trimmedSubjectCode
	);

	if (existingSubject) {
		throw new Error("A subject with this code already exists in this experiment.");
	}

  return createExperimentSubject({
    experimentId: parsedExperimentId,
    groupId: groupId ? Number(groupId) : null,
    subjectCode: trimmedSubjectCode,
    sex: sex?.trim() || null,
    genotype: genotype?.trim() || null,
    subjectType: subjectType?.trim() || null,
    notes: notes?.trim() || null,
  });
};

// Returns all subjects for one experiment owned by the current user
const getExperimentSubjectsService = async ({ experimentId, userId }) => {
  const parsedExperimentId = Number(experimentId);

  if (!parsedExperimentId || Number.isNaN(parsedExperimentId)) {
    throw new Error("Invalid experiment id.");
  }

  const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  return getExperimentSubjectsByExperimentId(parsedExperimentId);
};

export { createExperimentSubjectService, getExperimentSubjectsService };