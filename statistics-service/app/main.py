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
    comparisonGroups: List[str] = []
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
            key = entry.groupLabel or str(entry.groupId or "unspecified")
        else:
            key = "all"

        if key not in groups:
            groups[key] = []

        groups[key].append(entry.numericValue)

    return groups

# For presenting calculations for selected group
def calculate_group_statistics(values: List[float], selected_metrics: List[str]) -> dict:
    result = {
        "count": len(values)
    }

    if not values:
        return result

    if "mean" in selected_metrics:
        result["mean"] = get_mean(values)

    if "median" in selected_metrics:
        result["median"] = get_median(values)

    if "standard_deviation" in selected_metrics:
        result["standardDeviation"] = get_standard_deviation(values)

    if "variance" in selected_metrics:
        result["variance"] = get_variance(values)

    if "standard_error" in selected_metrics:
        result["standardError"] = get_standard_error(values)

    if "range" in selected_metrics:
        result["range"] = get_range(values)

    result["confidenceInterval95"] = get_confidence_interval_95(values)

    return result

# Student t-test
def run_student_t_test(groups: dict, comparison_groups: List[str]) -> dict:
    if comparison_groups:
        if len(comparison_groups) != 2:
            return {
                "statistic": None,
                "pValue": None,
                "message": "Student’s t-test requires exactly two selected groups."
            }

        missing_groups = [
            group for group in comparison_groups if group not in groups
        ]

        if missing_groups:
            return {
                "statistic": None,
                "pValue": None,
                "message": "One or more selected comparison groups were not found in the dataset."
            }

        group_a = groups[comparison_groups[0]]
        group_b = groups[comparison_groups[1]]
    else:
        valid_group_items = [
            (name, values) for name, values in groups.items() if len(values) > 0
        ]

        if len(valid_group_items) != 2:
            return {
                "statistic": None,
                "pValue": None,
                "message": "Student’s t-test requires exactly two groups. Please select two groups to compare."
            }

        group_a = valid_group_items[0][1]
        group_b = valid_group_items[1][1]
        comparison_groups = [valid_group_items[0][0], valid_group_items[1][0]]

    if len(group_a) < 2 or len(group_b) < 2:
        return {
            "statistic": None,
            "pValue": None,
            "message": "Each group must contain at least 2 values."
        }

    statistic, p_value = stats.ttest_ind(
        group_a,
        group_b,
        equal_var=False
    )

    return {
        "statistic": statistic,
        "pValue": p_value,
        "comparisonGroups": comparison_groups,
        "message": "Welch’s independent samples t-test was used. Should be used for normally distributed data."
    }

# Mann-Whitney U-test
def run_mann_whitney_u(groups: dict, comparison_groups: List[str]) -> dict:
    if comparison_groups:
        if len(comparison_groups) != 2:
            return {
                "statistic": None,
                "pValue": None,
                "message": "Mann-Whitney U-test requires exactly two selected groups."
            }

        missing_groups = [
            group for group in comparison_groups if group not in groups
        ]

        if missing_groups:
            return {
                "statistic": None,
                "pValue": None,
                "message": "One or more selected comparison groups were not found in the dataset."
            }

        group_a = groups[comparison_groups[0]]
        group_b = groups[comparison_groups[1]]
    else:
        valid_group_items = [
            (name, values) for name, values in groups.items() if len(values) > 0
        ]

        if len(valid_group_items) != 2:
            return {
                "statistic": None,
                "pValue": None,
                "message": "Mann-Whitney U-test requires exactly two groups. Please select two groups to compare."
            }

        group_a = valid_group_items[0][1]
        group_b = valid_group_items[1][1]
        comparison_groups = [valid_group_items[0][0], valid_group_items[1][0]]

    statistic, p_value = stats.mannwhitneyu(
        group_a,
        group_b,
        alternative="two-sided"
    )

    return {
        "statistic": statistic,
        "pValue": p_value,
        "comparisonGroups": comparison_groups,
        "message": "Two-sided Mann-Whitney U-test was used. THis test result should be used for not normally distributed data. "
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

    group_statistics = {
        key: calculate_group_statistics(group_values, payload.selectedMetrics)
        for key, group_values in groups.items()
    }

    test_results = {}

    if "shapiro_wilk" in payload.selectedTests:
        test_results["shapiroWilk"] = run_shapiro_wilk(values)

    if "student_t_test" in payload.selectedTests:
        test_results["studentTTest"] = run_student_t_test(
					groups,
					payload.comparisonGroups
      	)

    if "mann_whitney_u" in payload.selectedTests:
        test_results["mannWhitneyU"] = run_mann_whitney_u(
					groups,
					payload.comparisonGroups
				)

    return {
				"entryCount": len(payload.entries),
				"numericValueCount": len(values),
				"groupingMode": payload.groupingMode,
				"groupCount": len(groups),
				"comparisonGroups": payload.comparisonGroups,
				"groups": {
            key: {
                "count": len(group_values),
                "mean": get_mean(group_values) if len(group_values) > 0 else None,
                "median": get_median(group_values) if len(group_values) > 0 else None
            }
            for key, group_values in groups.items()
        },
        "groupStatistics": group_statistics,
        "descriptiveMetrics": descriptive_results,
        "confidenceIntervals": confidence_intervals,
        "tests": test_results,
    }