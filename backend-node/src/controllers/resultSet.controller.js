import {
  createResultSetService,
  getUserResultSetsService,
  getResultSetByIdService,
  updateResultSetService,
  deleteResultSetService
} from "../services/resultSet.service.js";

// Handles request for creating a new result set
const createResultSetController = async (req, res) => {
  try {
    const resultSet = await createResultSetService({
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(201).json({
      message: "Result set created successfully.",
      resultSet,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for loading all result sets
const getUserResultSetsController = async (req, res) => {
  try {
    const resultSets = await getUserResultSetsService(req.user.userId);

    return res.status(200).json({
      resultSets,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for loading one result set
const getResultSetByIdController = async (req, res) => {
  try {
    const resultSet = await getResultSetByIdService(
      req.params.id,
      req.user.userId
    );

    return res.status(200).json({
      resultSet,
    });
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
};

// Handles request for updating one result set
const updateResultSetController = async (req, res) => {
  try {
    const resultSet = await updateResultSetService({
      resultSetId: req.params.id,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      message: "Result set updated successfully.",
      resultSet,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for deleting one result set
const deleteResultSetController = async (req, res) => {
  try {
    await deleteResultSetService(req.params.id, req.user.userId);

    return res.status(200).json({
      message: "Result set deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export {
  createResultSetController,
  getUserResultSetsController,
  getResultSetByIdController,
  updateResultSetController,
  deleteResultSetController
};