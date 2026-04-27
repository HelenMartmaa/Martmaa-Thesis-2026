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

# For checking the service
@app.get("/health")
def health_check():
    return {"status": "ok"}

# -----------------------------
# JSON cleaning

def safe_number(value):
    if value is None:
        return None
    try:
        numeric_value = float(value)
    except (TypeError, ValueError):
        return None
    if math.isnan(numeric_value) or math.isinf(numeric_value):
        return None
    return numeric_value
def clean_for_json(value):
    if isinstance(value, dict):
        return {key: clean_for_json(item) for key, item in value.items()}
    if isinstance(value, list):
        return [clean_for_json(item) for item in value]
    if isinstance(value, tuple):
        return [clean_for_json(item) for item in value]
    if isinstance(value, np.integer):
        return int(value)
    if isinstance(value, (np.floating, float)):
        return safe_number(value)
    return value

# -----------------------------
# Basic descriptive statistics

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

# -----------------------------
# Grouping helpers

# For splitting into groups by sex (male vs female), groupId/groupLabel, none = all data in group "all"
def get_entry_group_key(entry: ResultEntry, grouping_mode: Optional[str]) -> str:
    if grouping_mode == "sex":
        return entry.sex or "unspecified"

    if grouping_mode == "group":
        return entry.groupLabel or str(entry.groupId or "unspecified")

    return "all"

def split_values_by_group(entries: List[ResultEntry], grouping_mode: Optional[str]) -> dict:
    groups = {}

    for entry in entries:
        if entry.numericValue is None:
            continue

        key = get_entry_group_key(entry, grouping_mode)

        if key not in groups:
            groups[key] = []

        groups[key].append(entry.numericValue)

    return groups

# Splitting timepoint values by group
def split_timecourse_by_group(entries: List[ResultEntry], grouping_mode: Optional[str]) -> dict:
    groups = {}

    for entry in entries:
        if entry.numericValue is None or entry.timepointValue is None:
            continue

        key = get_entry_group_key(entry, grouping_mode)

        if key not in groups:
            groups[key] = []

        groups[key].append({
            "time": entry.timepointValue,
            "value": entry.numericValue,
        })

    for key in groups:
        groups[key] = sorted(groups[key], key=lambda item: item["time"])

    return groups

# Splitting survival values by groups (event occured vs event didn't occur)
def split_survival_by_group(entries: List[ResultEntry], grouping_mode: Optional[str]) -> dict:
    groups = {}

    for entry in entries:
        if entry.timepointValue is None or entry.eventOccurred is None:
            continue

        key = get_entry_group_key(entry, grouping_mode)

        if key not in groups:
            groups[key] = []

        groups[key].append({
            "time": entry.timepointValue,
            "event": entry.eventOccurred,
        })

    for key in groups:
        groups[key] = sorted(groups[key], key=lambda item: item["time"])

    return groups

# Presenting calculations for selected group
def calculate_group_statistics(values: List[float], selected_metrics: List[str]) -> dict:
    result = {"count": len(values)}

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

# -----------------------------
# Statistical tests

# Shapiro-Wilk test
def run_shapiro_wilk(values: List[float]) -> dict:
    if len(values) < 3:
        return {
            "statistic": None,
            "pValue": None,
            "message": "Shapiro-Wilk test requires at least 3 values.",
        }

    statistic, p_value = stats.shapiro(values)

    return {
        "statistic": statistic,
        "pValue": p_value,
        "message": "Tests whether the data differs significantly from a normal distribution. A p-value below 0.05 usually suggests non-normality.",
    }

# Student t-test
def run_student_t_test(groups: dict, comparison_groups: List[str]) -> dict:
    if comparison_groups:
        if len(comparison_groups) != 2:
            return {
                "statistic": None,
                "pValue": None,
                "message": "Student’s t-test requires exactly two selected groups.",
            }

        missing_groups = [group for group in comparison_groups if group not in groups]

        if missing_groups:
            return {
                "statistic": None,
                "pValue": None,
                "message": "One or more selected comparison groups were not found in the dataset.",
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
                "message": "Student’s t-test requires exactly two groups. Please select two groups to compare.",
            }

        group_a = valid_group_items[0][1]
        group_b = valid_group_items[1][1]
        comparison_groups = [valid_group_items[0][0], valid_group_items[1][0]]

    if len(group_a) < 2 or len(group_b) < 2:
        return {
            "statistic": None,
            "pValue": None,
            "message": "Each group must contain at least 2 values.",
        }

    statistic, p_value = stats.ttest_ind(group_a, group_b, equal_var=False)

    return {
        "statistic": statistic,
        "pValue": p_value,
        "comparisonGroups": comparison_groups,
        "message": "Welch’s independent samples t-test was used. This test is commonly used for normally distributed data.",
    }

# Mann-Whitney U-test
def run_mann_whitney_u(groups: dict, comparison_groups: List[str]) -> dict:
    if comparison_groups:
        if len(comparison_groups) != 2:
            return {
                "statistic": None,
                "pValue": None,
                "message": "Mann-Whitney U-test requires exactly two selected groups.",
            }

        missing_groups = [group for group in comparison_groups if group not in groups]

        if missing_groups:
            return {
                "statistic": None,
                "pValue": None,
                "message": "One or more selected comparison groups were not found in the dataset.",
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
                "message": "Mann-Whitney U-test requires exactly two groups. Please select two groups to compare.",
            }

        group_a = valid_group_items[0][1]
        group_b = valid_group_items[1][1]
        comparison_groups = [valid_group_items[0][0], valid_group_items[1][0]]

    statistic, p_value = stats.mannwhitneyu(
        group_a,
        group_b,
        alternative="two-sided",
    )

    return {
        "statistic": statistic,
        "pValue": p_value,
        "comparisonGroups": comparison_groups,
        "message": "Two-sided Mann-Whitney U-test was used. This test is commonly used for non-normally distributed data.",
    }

# -----------------------------
# Growth / time-course analysis

# Growth rate
def calculate_growth_rate(values: List[float], times: List[float]) -> Optional[float]:
    if len(values) < 2 or len(times) < 2:
        return None

    first_value = values[0]
    last_value = values[-1]
    first_time = times[0]
    last_time = times[-1]

    delta_time = last_time - first_time

    if delta_time == 0:
        return None

    return (last_value - first_value) / delta_time

# Doubling time
def calculate_doubling_time(values: List[float], times: List[float]) -> Optional[float]:
    if len(values) < 2 or len(times) < 2:
        return None

    first = values[0]
    last = values[-1]
    delta_t = times[-1] - times[0]

    if first <= 0 or last <= first or delta_t <= 0:
        return None

    growth_constant = math.log(last / first) / delta_t

    if growth_constant == 0:
        return None

    return math.log(2) / growth_constant

# Timecourse
def calculate_timecourse_results(entries: List[ResultEntry], grouping_mode: Optional[str]) -> dict:
    grouped_timecourse = split_timecourse_by_group(entries, grouping_mode)
    results = {}

    for group_name, points in grouped_timecourse.items():
        times = [point["time"] for point in points]
        values = [point["value"] for point in points]

        results[group_name] = {
            "count": len(points),
            "growthRate": calculate_growth_rate(values, times),
            "doublingTime": calculate_doubling_time(values, times),
            "points": points,
        }

    return results

# -----------------------------
# Kaplan-Meier survival analysis

# Kaplan-Meier
def kaplan_meier(times: List[float], events: List[int]) -> List[dict]:
    pairs = sorted(zip(times, events), key=lambda item: item[0])

    at_risk = len(pairs)
    survival = 1.0
    curve = [{"time": 0, "survival": 1.0}]

    unique_times = sorted(set(times))

    for current_time in unique_times:
        event_count = sum(
            1 for time, event in pairs if time == current_time and event == 1
        )
        censored_count = sum(
            1 for time, event in pairs if time == current_time and event == 0
        )

        if at_risk > 0:
            survival *= 1 - (event_count / at_risk)

        curve.append({
            "time": current_time,
            "survival": survival,
            "events": event_count,
            "censored": censored_count,
            "atRisk": at_risk,
        })

        at_risk -= event_count + censored_count

    return curve

# Kaplan-Meier when grouping mode is used
def calculate_kaplan_meier_by_group(entries: List[ResultEntry], grouping_mode: Optional[str]) -> dict:
    grouped_survival = split_survival_by_group(entries, grouping_mode)
    results = {}

    for group_name, points in grouped_survival.items():
        times = [point["time"] for point in points]
        events = [point["event"] for point in points]

        results[group_name] = {
            "count": len(points),
            "eventCount": sum(1 for event in events if event == 1),
            "censoredCount": sum(1 for event in events if event == 0),
            "curve": kaplan_meier(times, events),
        }

    return results

# -----------------------------
# Chart data

def build_chart_data(
    entries: List[ResultEntry],
    grouping_mode: Optional[str],
    groups: dict,
    group_statistics: dict,
    timecourse_results: dict,
    kaplan_results: dict,
) -> dict:
    chart_data = {}

    numeric_entries = [
        entry for entry in entries if entry.numericValue is not None
    ]

    if numeric_entries:
        chart_data["scatter"] = [
            {
                "x": index + 1,
                "y": entry.numericValue,
                "group": get_entry_group_key(entry, grouping_mode),
                "timepoint": entry.timepointValue,
            }
            for index, entry in enumerate(numeric_entries)
        ]

    if groups:
        chart_data["groupMeans"] = [
            {
                "group": group_name,
                "mean": group_statistics.get(group_name, {}).get("mean"),
                "sd": group_statistics.get(group_name, {}).get("standardDeviation"),
                "sem": group_statistics.get(group_name, {}).get("standardError"),
            }
            for group_name in groups.keys()
        ]

    if timecourse_results:
        chart_data["timecourse"] = [
            {
                "group": group_name,
                "time": point["time"],
                "value": point["value"],
            }
            for group_name, result in timecourse_results.items()
            for point in result.get("points", [])
        ]

    if kaplan_results:
        chart_data["kaplanMeier"] = [
            {
                "group": group_name,
                **point,
            }
            for group_name, result in kaplan_results.items()
            for point in result.get("curve", [])
        ]

    return chart_data

# -----------------------------
# Main endpoint

@app.post("/analyze")
def analyze_dataset(payload: AnalysisRequest):
    values = [
        entry.numericValue
        for entry in payload.entries
        if entry.numericValue is not None
    ]

    survival_entries = [
        entry
        for entry in payload.entries
        if entry.timepointValue is not None and entry.eventOccurred is not None
    ]

    timecourse_entries = [
        entry
        for entry in payload.entries
        if entry.numericValue is not None and entry.timepointValue is not None
    ]

    descriptive_results = {}
    confidence_intervals = {}
    test_results = {}
    growth_results = {}
    survival_results = {}

    groups = split_values_by_group(payload.entries, payload.groupingMode)

    group_statistics = {
        key: calculate_group_statistics(group_values, payload.selectedMetrics)
        for key, group_values in groups.items()
    }

    if values:
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

        confidence_intervals["mean95"] = get_confidence_interval_95(values)

        if "shapiro_wilk" in payload.selectedTests:
            test_results["shapiroWilk"] = run_shapiro_wilk(values)

        if "student_t_test" in payload.selectedTests:
            test_results["studentTTest"] = run_student_t_test(
                groups,
                payload.comparisonGroups,
            )

        if "mann_whitney_u" in payload.selectedTests:
            test_results["mannWhitneyU"] = run_mann_whitney_u(
                groups,
                payload.comparisonGroups,
            )

    if "growth_rate" in payload.selectedMetrics or "doubling_time" in payload.selectedMetrics:
        if timecourse_entries:
            growth_results = calculate_timecourse_results(
                timecourse_entries,
                payload.groupingMode,
            )

    if "kaplan_meier" in payload.selectedMetrics:
        if survival_entries:
            survival_results = calculate_kaplan_meier_by_group(
                survival_entries,
                payload.groupingMode,
            )

    chart_data = build_chart_data(
        entries=payload.entries,
        grouping_mode=payload.groupingMode,
        groups=groups,
        group_statistics=group_statistics,
        timecourse_results=growth_results,
        kaplan_results=survival_results,
    )

    if not values and not survival_entries:
        return {
            "entryCount": len(payload.entries),
            "numericValueCount": 0,
            "survivalEntryCount": 0,
            "descriptiveMetrics": {},
            "confidenceIntervals": {},
            "tests": {},
            "groups": {},
            "groupStatistics": {},
            "growthResults": {},
            "survivalResults": {},
            "chartData": {},
            "groupCount": 0,
            "groupingMode": payload.groupingMode,
            "comparisonGroups": payload.comparisonGroups,
            "error": "No analyzable numeric or survival/event values were available.",
        }
    
        return clean_for_json(result)

    return {
        "entryCount": len(payload.entries),
        "numericValueCount": len(values),
        "survivalEntryCount": len(survival_entries),
        "timecourseEntryCount": len(timecourse_entries),
        "groupingMode": payload.groupingMode,
        "groupCount": len(groups),
        "comparisonGroups": payload.comparisonGroups,
        "groups": {
            key: {
                "count": len(group_values),
                "mean": get_mean(group_values) if len(group_values) > 0 else None,
                "median": get_median(group_values) if len(group_values) > 0 else None,
            }
            for key, group_values in groups.items()
        },
        "groupStatistics": group_statistics,
        "descriptiveMetrics": descriptive_results,
        "confidenceIntervals": confidence_intervals,
        "tests": test_results,
        "growthResults": growth_results,
        "survivalResults": survival_results,
        "chartData": chart_data,
    }

    return clean_for_json(result)