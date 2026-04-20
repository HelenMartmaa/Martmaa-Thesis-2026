import {
  createExperimentSubjectService,
  getExperimentSubjectsService,
  updateExperimentSubjectService,
  deleteExperimentSubjectService,
} from "../services/experimentSubject.service.js";


// Handles request for creating a new experiment subject
const createExperimentSubjectController = async (req, res) => {
  try {
    const subject = await createExperimentSubjectService({
      experimentId: req.params.experimentId,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(201).json({
      message: "Experiment subject created successfully.",
      subject,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for loading all subjects of one experiment
const getExperimentSubjectsController = async (req, res) => {
  try {
    const subjects = await getExperimentSubjectsService({
      experimentId: req.params.experimentId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      subjects,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for updating one subject
const updateExperimentSubjectController = async (req, res) => {
  try {
    const subject = await updateExperimentSubjectService({
      experimentId: req.params.experimentId,
      subjectId: req.params.subjectId,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      message: "Experiment subject updated successfully.",
      subject,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for deleting one subject
const deleteExperimentSubjectController = async (req, res) => {
  try {
    await deleteExperimentSubjectService({
      experimentId: req.params.experimentId,
      subjectId: req.params.subjectId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      message: "Experiment subject deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export {
  createExperimentSubjectController,
  getExperimentSubjectsController,
  updateExperimentSubjectController,
  deleteExperimentSubjectController,
};