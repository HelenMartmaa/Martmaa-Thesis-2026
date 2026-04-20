import { createExperimentSubjectService,getExperimentSubjectsService} from "../services/experimentSubject.service.js";

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

export { createExperimentSubjectController, getExperimentSubjectsController };