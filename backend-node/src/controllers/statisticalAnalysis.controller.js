import { createStatisticalAnalysisService, getUserStatisticalAnalysesService, getStatisticalAnalysisByIdService, deleteStatisticalAnalysisService } from "../services/statisticalAnalysis.service.js";

// Handles request for creating a statistical analysis
const createStatisticalAnalysisController = async (req, res) => {
  try {
    const analysis = await createStatisticalAnalysisService({
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(201).json({
      message: "Statistical analysis created successfully.",
      analysis,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for loading user analyses
const getUserStatisticalAnalysesController = async (req, res) => {
  try {
    const analyses = await getUserStatisticalAnalysesService(req.user.userId);

    return res.status(200).json({
      analyses,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for loading one analysis
const getStatisticalAnalysisByIdController = async (req, res) => {
  try {
    const analysis = await getStatisticalAnalysisByIdService(
      req.params.id,
      req.user.userId
    );

    return res.status(200).json({
      analysis,
    });
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
};

// Handles request for deleting one analysis
const deleteStatisticalAnalysisController = async (req, res) => {
  try {
    await deleteStatisticalAnalysisService(req.params.id, req.user.userId);

    return res.status(200).json({
      message: "Statistical analysis deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export { createStatisticalAnalysisController, getUserStatisticalAnalysesController, getStatisticalAnalysisByIdController, deleteStatisticalAnalysisController };