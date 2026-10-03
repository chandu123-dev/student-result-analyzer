import time
from typing import List, Dict, Any, Optional

def binary_search(
    arr: List[Dict[str, Any]], 
    target: Any, 
    key: str = "percentage"
) -> Dict[str, Any]:
    """
    Manually searches for a student in a sorted array using Binary Search.
    DOES NOT use 'in', 'index()', or 'list.index()'.
    
    Tracks:
      low, mid, high, middle_value, comparison, decision, step-by-step history.
      
    Args:
      arr: list of student dictionaries, must be pre-sorted.
      target: search target (e.g. percentage number or roll_no string).
      key: key to inspect ('percentage', 'roll_no', 'total', etc.).
      
    Returns:
      Dict with search results, steps, comparisons, execution time, and complexity.
    """
    start_time = time.perf_counter()
    steps = []
    comparisons = 0
    found = False
    found_index = -1
    found_student = None

    n = len(arr)
    if n == 0:
        end_time = time.perf_counter()
        return {
            "found": False,
            "index": -1,
            "student": None,
            "comparisons": 0,
            "steps": [],
            "execution_time": round((end_time - start_time) * 1000.0, 4),
            "complexity": "O(log n)",
            "input_size": 0
        }

    # Detect if array is sorted ascending or descending
    first_val = arr[0].get(key, 0)
    last_val = arr[-1].get(key, 0)
    is_ascending = first_val <= last_val

    # Convert target to float if key is numeric
    numeric_target = None
    if key in ["percentage", "total", "mathematics", "physics", "programming", "data_structures", "algorithms"]:
        try:
            numeric_target = float(target)
        except (ValueError, TypeError):
            numeric_target = None

    low = 0
    high = n - 1
    step_num = 1

    while low <= high:
        mid = (low + high) // 2
        comparisons += 1
        mid_item = arr[mid]
        mid_val = mid_item.get(key)
        
        # Comparison logic
        is_equal = False
        is_greater = False
        is_less = False

        if numeric_target is not None:
            mid_num = float(mid_val) if mid_val is not None else 0.0
            # Use small tolerance for float equality
            if abs(numeric_target - mid_num) < 0.05:
                is_equal = True
            elif numeric_target > mid_num:
                is_greater = True
            else:
                is_less = True
            display_target = numeric_target
            display_mid = mid_num
        else:
            str_target = str(target).strip().lower()
            str_mid = str(mid_val).strip().lower()
            if str_target == str_mid:
                is_equal = True
            elif str_target > str_mid:
                is_greater = True
            else:
                is_less = True
            display_target = target
            display_mid = mid_val

        # Step record
        step_info = {
            "step": step_num,
            "low": low,
            "mid": mid,
            "high": high,
            "low_value": arr[low].get(key),
            "mid_value": display_mid,
            "high_value": arr[high].get(key),
            "mid_student": mid_item.get("name", ""),
            "mid_roll_no": mid_item.get("roll_no", ""),
            "target": display_target
        }

        if is_equal:
            step_info["comparison"] = f"{display_target} == {display_mid}"
            step_info["decision"] = f"TARGET FOUND at index {mid} ({mid_item.get('name')})"
            steps.append(step_info)
            found = True
            found_index = mid
            found_student = mid_item
            break
        elif is_ascending:
            if is_greater:
                step_info["comparison"] = f"{display_target} > {display_mid}"
                step_info["decision"] = f"Target > Middle: Eliminate left half. Search right half (Low = {mid + 1})"
                steps.append(step_info)
                low = mid + 1
            else:
                step_info["comparison"] = f"{display_target} < {display_mid}"
                step_info["decision"] = f"Target < Middle: Eliminate right half. Search left half (High = {mid - 1})"
                steps.append(step_info)
                high = mid - 1
        else: # Descending array
            if is_greater:
                step_info["comparison"] = f"{display_target} > {display_mid}"
                step_info["decision"] = f"Target > Middle (Descending): Search left half (High = {mid - 1})"
                steps.append(step_info)
                high = mid - 1
            else:
                step_info["comparison"] = f"{display_target} < {display_mid}"
                step_info["decision"] = f"Target < Middle (Descending): Search right half (Low = {mid + 1})"
                steps.append(step_info)
                low = mid + 1

        step_num += 1

    if not found:
        steps.append({
            "step": step_num,
            "low": low,
            "mid": -1,
            "high": high,
            "comparison": f"Low ({low}) > High ({high})",
            "decision": "Search space exhausted. Result: TARGET NOT FOUND",
            "target": target
        })

    end_time = time.perf_counter()
    execution_time_ms = round((end_time - start_time) * 1000.0, 4)

    return {
        "found": found,
        "index": found_index,
        "student": found_student,
        "comparisons": comparisons,
        "steps_count": len(steps),
        "steps": steps,
        "execution_time": execution_time_ms,
        "complexity": "O(log n)",
        "input_size": n
    }
