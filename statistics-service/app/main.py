from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import math
import statistics

app = FastAPI()

class ResultEntry(BaseModel):
    numericValue: Optional[float] = None
    timepointValue: Optional[float] = None
    eventOccurred: Optional[int] = None
    sex: Optional[str] = None
    subjectId: Optional[int] = None
    groupId: Optional[int] = None
    sampleCode: Optional[str] = None
    groupLabel: Optional[str] = None

class AnalysisRequest(BaseModel):
    analysisName: str
    groupingMode: Optional[str] = None
    selectedMetrics: List[str] = []
    selectedTests: List[str] = []
    filters: dict = {}
    chartConfig: dict = {}
    entries: List[ResultEntry]

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Average
def get_mean(values: List[float]) -> float:
    return statistics.mean(values)

# Median
def get_median(values: List[float]) -> float:
    return statistics.median(values)

# Variance
def get_variance(values: List[float]) -> float:
    if len(values) < 2:
        return 0.0
    return statistics.variance(values)

# Standard deviation SM
def get_standard_deviation(values: List[float]) -> float:
    if len(values) < 2:
        return 0.0
    return statistics.stdev(values)

# Standard error of the mean SEM
def get_standard_error(values: List[float]) -> float:
    if len(values) < 2:
        return 0.0
    return get_standard_deviation(values) / math.sqrt(len(values))

# Range
def get_range(values: List[float]) -> dict:
    return {
        "min": min(values),
        "max": max(values),
        "difference": max(values) - min(values),
    }

@app.post("/analyze")
def analyze_dataset(payload: AnalysisRequest):
    values = [
        entry.numericValue
        for entry in payload.entries
        if entry.numericValue is not None
    ]

    if not values:
        return {
            "entryCount": len(payload.entries),
            "numericValueCount": 0,
            "descriptiveMetrics": {},
            "tests": {},
            "error": "No numeric values available for analysis.",
        }

    results = {}

    if "mean" in payload.selectedMetrics:
        results["mean"] = get_mean(values)

    if "median" in payload.selectedMetrics:
        results["median"] = get_median(values)

    if "standard_deviation" in payload.selectedMetrics:
        results["standardDeviation"] = get_standard_deviation(values)

    if "variance" in payload.selectedMetrics:
        results["variance"] = get_variance(values)

    if "standard_error" in payload.selectedMetrics:
        results["standardError"] = get_standard_error(values)

    if "range" in payload.selectedMetrics:
        results["range"] = get_range(values)

    return {
        "entryCount": len(payload.entries),
        "numericValueCount": len(values),
        "descriptiveMetrics": results,
        "tests": {},
    }
