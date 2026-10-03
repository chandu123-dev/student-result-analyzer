import time
from typing import List, Dict, Any, Tuple, Optional

def _get_sort_val(item: Dict[str, Any], key: str) -> Any:
    """Safely extracts value for comparison, defaulting to 0 or empty string."""
    return item.get(key, 0)

def _compare_elements(
    a: Dict[str, Any], 
    b: Dict[str, Any], 
    key: str, 
    reverse: bool
) -> Tuple[bool, str, str]:
    """
    Compares two student dicts by key with tie-breaking.
    Returns:
        (is_first_preferred, comparison_str, decision_str)
    """
    val_a = _get_sort_val(a, key)
    val_b = _get_sort_val(b, key)
    name_a = a.get("name", a.get("roll_no", "Student A"))
    name_b = b.get("name", b.get("roll_no", "Student B"))
    
    comp_sym = ">" if val_a > val_b else ("<" if val_a < val_b else "==")
    comparison_str = f"{name_a} ({val_a}) {comp_sym} {name_b} ({val_b})"
    
    # Tie-breaking rules for ranking when key == 'percentage'
    if val_a == val_b and key == "percentage":
        # Tie-breaker 1: total marks
        tot_a = a.get("total", 0)
        tot_b = b.get("total", 0)
        if tot_a != tot_b:
            if reverse:
                is_preferred = tot_a > tot_b
            else:
                is_preferred = tot_a < tot_b
            decision = f"Tie-break by Total: {tot_a} vs {tot_b} -> Place {name_a if is_preferred else name_b} first"
            return is_preferred, comparison_str, decision
        
        # Tie-breaker 2: algorithms marks
        algo_a = a.get("algorithms", 0)
        algo_b = b.get("algorithms", 0)
        if algo_a != algo_b:
            if reverse:
                is_preferred = algo_a > algo_b
            else:
                is_preferred = algo_a < algo_b
            decision = f"Tie-break by Algorithms: {algo_a} vs {algo_b} -> Place {name_a if is_preferred else name_b} first"
            return is_preferred, comparison_str, decision

    if reverse:
        # Descending (Highest percentage first)
        if val_a >= val_b:
            is_preferred = True
            decision = f"Place {name_a} ({val_a}) first (higher score)"
        else:
            is_preferred = False
            decision = f"Place {name_b} ({val_b}) first (higher score)"
    else:
        # Ascending (Lowest first)
        if val_a <= val_b:
            is_preferred = True
            decision = f"Place {name_a} ({val_a}) first (lower score)"
        else:
            is_preferred = False
            decision = f"Place {name_b} ({val_b}) first (lower score)"
            
    return is_preferred, comparison_str, decision

def merge_sort_students(
    students: List[Dict[str, Any]], 
    key: str = "percentage", 
    reverse: bool = True
) -> Dict[str, Any]:
    """
    Manually sorts students using the Merge Sort algorithm without built-in sorted() or list.sort().
    Tracks every comparison, merge operation, execution time, and step-by-step history.
    
    Args:
        students: list of student dictionaries.
        key: dictionary key to sort by (default 'percentage').
        reverse: True for descending (e.g. ranking highest to lowest), False for ascending.
        
    Returns:
        Dict containing:
            sorted_data: list of sorted students
            comparison_count: total comparisons made
            merge_count: total merge operations
            execution_time: execution time in milliseconds
            steps: list of comparison steps for visualization
            input_size: number of elements sorted
            complexity: algorithmic time complexity
    """
    comparison_count = 0
    merge_count = 0
    steps = []
    MAX_STEPS_LOGGED = 250

    start_time = time.perf_counter()

    def merge(left_arr: List[Dict[str, Any]], right_arr: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        nonlocal comparison_count, merge_count
        merged = []
        i = 0
        j = 0
        merge_count += 1

        while i < len(left_arr) and j < len(right_arr):
            comparison_count += 1
            left_item = left_arr[i]
            right_item = right_arr[j]
            
            is_left_first, comp_str, decision = _compare_elements(left_item, right_item, key, reverse)
            
            if len(steps) < MAX_STEPS_LOGGED:
                steps.append({
                    "step": len(steps) + 1,
                    "phase": "merge_compare",
                    "left": _get_sort_val(left_item, key),
                    "right": _get_sort_val(right_item, key),
                    "left_student": left_item.get("name", "Student"),
                    "right_student": right_item.get("name", "Student"),
                    "comparison": comp_str,
                    "decision": decision
                })
            
            if is_left_first:
                merged.append(left_item)
                i += 1
            else:
                merged.append(right_item)
                j += 1

        # Append remaining elements from left
        while i < len(left_arr):
            merged.append(left_arr[i])
            i += 1

        # Append remaining elements from right
        while j < len(right_arr):
            merged.append(right_arr[j])
            j += 1

        return merged

    def divide_and_conquer(arr: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if len(arr) <= 1:
            return arr

        mid = len(arr) // 2
        # Manual slicing
        left_half = arr[:mid]
        right_half = arr[mid:]

        sorted_left = divide_and_conquer(left_half)
        sorted_right = divide_and_conquer(right_half)

        return merge(sorted_left, sorted_right)

    # Make a shallow copy of students list to prevent mutating original
    input_copy = list(students)
    sorted_result = divide_and_conquer(input_copy)
    
    end_time = time.perf_counter()
    execution_time_ms = round((end_time - start_time) * 1000.0, 4)

    return {
        "sorted_data": sorted_result,
        "comparison_count": comparison_count,
        "merge_count": merge_count,
        "execution_time": execution_time_ms,
        "steps": steps,
        "input_size": len(students),
        "complexity": "O(n log n)"
    }
