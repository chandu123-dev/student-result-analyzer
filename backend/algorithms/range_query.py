import time
from typing import List, Dict, Any, Tuple

def range_query_by_percentage(
    sorted_arr: List[Dict[str, Any]], 
    min_val: float, 
    max_val: float,
    key: str = "percentage"
) -> Dict[str, Any]:
    """
    Executes a range query [min_val, max_val] on an ascendingly sorted array
    using Binary Search for both lower bound (first index >= min_val) 
    and upper bound (first index > max_val).
    
    Time Complexity: O(log n + k), where k is the number of matching elements.
    DOES NOT perform a linear O(n) scan.
    """
    start_time = time.perf_counter()
    n = len(sorted_arr)
    total_comparisons = 0
    all_steps = []

    if n == 0:
        end_time = time.perf_counter()
        return {
            "students": [],
            "left_boundary": -1,
            "right_boundary": -1,
            "students_found": 0,
            "comparisons": 0,
            "steps": [],
            "execution_time": round((end_time - start_time) * 1000.0, 4),
            "complexity": "O(log n + k)",
            "min_percentage": min_val,
            "max_percentage": max_val,
            "input_size": 0
        }

    # 1. Lower Bound Binary Search: first index where val >= min_val
    low = 0
    high = n - 1
    left_boundary = n
    step_count = 1

    all_steps.append({
        "phase": "lower_bound_start",
        "description": f"Phase 1: Binary Search for Lower Boundary (first index with {key} >= {min_val}%)"
    })

    while low <= high:
        mid = (low + high) // 2
        total_comparisons += 1
        mid_val = sorted_arr[mid].get(key, 0.0)
        
        step_info = {
            "phase": "lower_bound",
            "step": step_count,
            "low": low,
            "mid": mid,
            "high": high,
            "mid_value": mid_val,
            "target": min_val,
            "student_name": sorted_arr[mid].get("name", "")
        }

        if mid_val >= min_val:
            step_info["comparison"] = f"{mid_val} >= {min_val}"
            step_info["decision"] = f"Condition met ({mid_val} >= {min_val}). Candidate left boundary = {mid}. Search left half (High = {mid - 1}) for earlier match."
            left_boundary = mid
            high = mid - 1
        else:
            step_info["comparison"] = f"{mid_val} < {min_val}"
            step_info["decision"] = f"Too low ({mid_val} < {min_val}). Eliminate left half. Search right half (Low = {mid + 1})."
            low = mid + 1

        all_steps.append(step_info)
        step_count += 1

    # 2. Upper Bound Binary Search: first index where val > max_val
    all_steps.append({
        "phase": "upper_bound_start",
        "description": f"Phase 2: Binary Search for Upper Boundary (first index with {key} > {max_val}%)"
    })

    low = 0
    high = n - 1
    right_boundary = n

    while low <= high:
        mid = (low + high) // 2
        total_comparisons += 1
        mid_val = sorted_arr[mid].get(key, 0.0)

        step_info = {
            "phase": "upper_bound",
            "step": step_count,
            "low": low,
            "mid": mid,
            "high": high,
            "mid_value": mid_val,
            "target": max_val,
            "student_name": sorted_arr[mid].get("name", "")
        }

        if mid_val > max_val:
            step_info["comparison"] = f"{mid_val} > {max_val}"
            step_info["decision"] = f"Condition met ({mid_val} > {max_val}). Candidate upper limit index = {mid}. Search left half (High = {mid - 1}) for earlier match."
            right_boundary = mid
            high = mid - 1
        else:
            step_info["comparison"] = f"{mid_val} <= {max_val}"
            step_info["decision"] = f"Still within range ({mid_val} <= {max_val}). Search right half (Low = {mid + 1})."
            low = mid + 1

        all_steps.append(step_info)
        step_count += 1

    # Range extraction slice: [left_boundary, right_boundary)
    if left_boundary < right_boundary:
        matching_students = sorted_arr[left_boundary:right_boundary]
        inclusive_right_idx = right_boundary - 1
    else:
        matching_students = []
        inclusive_right_idx = -1
        left_boundary = -1

    all_steps.append({
        "phase": "result",
        "description": f"Phase 3: Range extracted. Left Boundary = {left_boundary}, Right Boundary = {inclusive_right_idx}. Students Found = {len(matching_students)}"
    })

    end_time = time.perf_counter()
    execution_time_ms = round((end_time - start_time) * 1000.0, 4)

    return {
        "students": matching_students,
        "left_boundary": left_boundary,
        "right_boundary": inclusive_right_idx,
        "slice_end_boundary": right_boundary,
        "students_found": len(matching_students),
        "comparisons": total_comparisons,
        "steps": all_steps,
        "execution_time": execution_time_ms,
        "complexity": "O(log n + k)",
        "min_percentage": min_val,
        "max_percentage": max_val,
        "input_size": n
    }
