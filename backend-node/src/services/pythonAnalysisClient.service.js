import axios from "axios";

const PYTHON_ANALYSIS_SERVICE_URL =
  process.env.PYTHON_ANALYSIS_SERVICE_URL || "http://127.0.0.1:8000";

// Sends analysis payload to Python microservice
const runPythonAnalysis = async (payload) => {
  const response = await axios.post(
    `${PYTHON_ANALYSIS_SERVICE_URL}/analyze`,
    payload
  );

  return response.data;
};

export { runPythonAnalysis };