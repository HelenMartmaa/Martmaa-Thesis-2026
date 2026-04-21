// Utility helpers for statistical calculations

const getMean = (values) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const getMedian = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
};

const getVariance = (values) => {
  const mean = getMean(values);
  return (
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    (values.length - 1)
  );
};

const getStandardDeviation = (values) => Math.sqrt(getVariance(values));

const getStandardError = (values) =>
  getStandardDeviation(values) / Math.sqrt(values.length);

const getRange = (values) => {
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    min,
    max,
    difference: max - min,
  };
};

// Main descriptive statistics calculator
const calculateDescriptiveMetrics = (values, selectedMetrics) => {
  const results = {};

  if (selectedMetrics.includes("mean")) {
    results.mean = getMean(values);
  }

  if (selectedMetrics.includes("median")) {
    results.median = getMedian(values);
  }

  if (selectedMetrics.includes("standard_deviation")) {
    results.standardDeviation = getStandardDeviation(values);
  }

  if (selectedMetrics.includes("variance")) {
    results.variance = getVariance(values);
  }

  if (selectedMetrics.includes("standard_error")) {
    results.standardError = getStandardError(values);
  }

  if (selectedMetrics.includes("range")) {
    results.range = getRange(values);
  }

  return results;
};

export { calculateDescriptiveMetrics };