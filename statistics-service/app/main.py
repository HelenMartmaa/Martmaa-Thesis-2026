from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import math
import statistics
import numpy as np
from scipy import stats

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

# Standard error (Standard error of the mean SEM)
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

# 95% CI
def get_confidence_interval_95(values: List[float]) -> dict:
    if len(values) < 2:
        return {
            "lower": None,
            "upper": None,
            "message": "At least two values are required for a 95% confidence interval."
        }

    mean_value = statistics.mean(values)
    standard_error = stats.sem(values)

    confidence_interval = stats.t.interval(
        confidence=0.95,
        df=len(values) - 1,
        loc=mean_value,
        scale=standard_error
    )

    return {
        "lower": confidence_interval[0],
        "upper": confidence_interval[1]
    }

# Shapiro-Wilk test
def run_shapiro_wilk(values: List[float]) -> dict:
    if len(values) < 3:
        return {
            "statistic": None,
            "pValue": None,
            "message": "Shapiro-Wilk test requires at least 3 values."
        }

    statistic, p_value = stats.shapiro(values)

    return {
        "statistic": statistic,
        "pValue": p_value,
        "message": "Tests whether the data differs significantly from a normal distribution. p-value less than 0.05 indicates that the data is normal."
    }

# For splitting into groups by sex (male vs female), groupId/groupLabel, none = all data in group "all"
def split_values_by_group(entries: List[ResultEntry], grouping_mode: Optional[str]) -> dict:
    groups = {}

    for entry in entries:
        if entry.numericValue is None:
            continue

        if grouping_mode == "sex":
            key = entry.sex or "unspecified"
        elif grouping_mode == "group":
            key = str(entry.groupId or entry.groupLabel or "unspecified")
        else:
            key = "all"

        if key not in groups:
            groups[key] = []

        groups[key].append(entry.numericValue)

    return groups

# Student t-test
def run_student_t_test(groups: dict) -> dict:
    valid_groups = [values for values in groups.values() if len(values) > 0]

    if len(valid_groups) != 2:
        return {
            "statistic": None,
            "pValue": None,
            "message": "Student’s t-test requires exactly two groups."
        }

    if len(valid_groups[0]) < 2 or len(valid_groups[1]) < 2:
        return {
            "statistic": None,
            "pValue": None,
            "message": "Each group must contain at least 2 values."
        }

    statistic, p_value = stats.ttest_ind(
        valid_groups[0],
        valid_groups[1],
        equal_var=False
    )

    return {
        "statistic": statistic,
        "pValue": p_value,
        "message": "Welch’s independent samples t-test was used. Should be used for normally distributed data."
    }

# Mann-Whitney U-test
def run_mann_whitney_u(groups: dict) -> dict:
    valid_groups = [values for values in groups.values() if len(values) > 0]

    if len(valid_groups) != 2:
        return {
            "statistic": None,
            "pValue": None,
            "message": "Mann-Whitney U-test requires exactly two groups."
        }

    statistic, p_value = stats.mannwhitneyu(
        valid_groups[0],
        valid_groups[1],
        alternative="two-sided"
    )

    return {
        "statistic": statistic,
        "pValue": p_value,
        "message": "Two-sided Mann-Whitney U-test was used. Should be used for not normally distributed data. "
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
            "confidenceIntervals": {},
            "groups": {},
            "groupCount": 0,
            "groupingMode": payload.groupingMode,
            "error": "No numeric values available for analysis.",
        }

    descriptive_results = {}

    if "mean" in payload.selectedMetrics:
        descriptive_results["mean"] = get_mean(values)

    if "median" in payload.selectedMetrics:
        descriptive_results["median"] = get_median(values)

    if "standard_deviation" in payload.selectedMetrics:
        descriptive_results["standardDeviation"] = get_standard_deviation(values)

    if "variance" in payload.selectedMetrics:
        descriptive_results["variance"] = get_variance(values)

    if "standard_error" in payload.selectedMetrics:
        descriptive_results["standardError"] = get_standard_error(values)

    if "range" in payload.selectedMetrics:
        descriptive_results["range"] = get_range(values)

    confidence_intervals = {
        "mean95": get_confidence_interval_95(values)
    }

    groups = split_values_by_group(payload.entries, payload.groupingMode)

    test_results = {}

    if "shapiro_wilk" in payload.selectedTests:
        test_results["shapiroWilk"] = run_shapiro_wilk(values)

    if "student_t_test" in payload.selectedTests:
        test_results["studentTTest"] = run_student_t_test(groups)

    if "mann_whitney_u" in payload.selectedTests:
        test_results["mannWhitneyU"] = run_mann_whitney_u(groups)

    return {
        "entryCount": len(payload.entries),
        "numericValueCount": len(values),
        "groupingMode": payload.groupingMode,
        "groupCount": len(groups),
        "groups": {
            key: {
                "count": len(group_values),
                "mean": get_mean(group_values) if len(group_values) > 0 else None,
                "median": get_median(group_values) if len(group_values) > 0 else None
            }
            for key, group_values in groups.items()
        },
        "descriptiveMetrics": descriptive_results,
        "confidenceIntervals": confidence_intervals,
        "tests": test_results,
    }