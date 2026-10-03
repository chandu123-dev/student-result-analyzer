from flask import Blueprint, request, jsonify
from models import StudentModel
from algorithms.sorting import merge_sort_students
from algorithms.binary_search import binary_search
from algorithms.range_query import range_query_by_percentage

search_bp = Blueprint("search", __name__, url_prefix="/api")

@search_bp.route("/binary-search", methods=["POST"])
def search_binary():
    """
    Executes manual Binary Search on a pre-sorted array of students.
    Accepts JSON:
      {
         "target": 87.0 or "CS2024-001",
         "key": "percentage" (default) or "roll_no" or "total"
      }
    Returns detailed step-by-step low/mid/high states and visual array.
    """
    try:
        data = request.get_json() or {}
        target = data.get("target")
        if target is None or str(target).strip() == "":
            return jsonify({"success": False, "error": "Search target is required"}), 400

        key = data.get("key", "percentage")
        students = StudentModel.get_all()
        
        if not students:
            return jsonify({
                "success": True,
                "found": False,
                "index": -1,
                "student": None,
                "comparisons": 0,
                "steps": [],
                "execution_time_ms": 0.0,
                "complexity": "O(log n)",
                "sorted_array": []
            }), 200

        # Sort students ascending using our manual Merge Sort
        sort_result = merge_sort_students(students, key=key, reverse=False)
        sorted_students = sort_result["sorted_data"]

        # Run manual Binary Search
        search_res = binary_search(sorted_students, target, key=key)

        return jsonify({
            "success": True,
            "target": target,
            "search_key": key,
            "found": search_res["found"],
            "index": search_res["index"],
            "student": search_res["student"],
            "comparisons": search_res["comparisons"],
            "steps": search_res["steps"],
            "execution_time_ms": search_res["execution_time"],
            "complexity": search_res["complexity"],
            "input_size": len(sorted_students),
            "sorted_array": [
                {
                    "index": i,
                    "id": s["id"],
                    "roll_no": s["roll_no"],
                    "name": s["name"],
                    "value": s.get(key),
                    "percentage": s.get("percentage"),
                    "grade": s.get("grade")
                }
                for i, s in enumerate(sorted_students)
            ]
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@search_bp.route("/range-query", methods=["POST"])
def query_range():
    """
    Executes Range Query [min_percentage, max_percentage] using Binary Search
    to locate lower_bound (>= min) and upper_bound (> max).
    Time Complexity: O(log n + k).
    """
    try:
        data = request.get_json() or {}
        min_pct = data.get("min_percentage")
        max_pct = data.get("max_percentage")

        if min_pct is None or max_pct is None:
            return jsonify({"success": False, "error": "Both 'min_percentage' and 'max_percentage' are required"}), 400

        try:
            min_val = float(min_pct)
            max_val = float(max_pct)
        except (ValueError, TypeError):
            return jsonify({"success": False, "error": "Percentages must be numeric values"}), 400

        if min_val > max_val:
            return jsonify({"success": False, "error": "min_percentage cannot be greater than max_percentage"}), 400

        students = StudentModel.get_all()
        if not students:
            return jsonify({
                "success": True,
                "min_percentage": min_val,
                "max_percentage": max_val,
                "left_boundary": -1,
                "right_boundary": -1,
                "students_found": 0,
                "students": [],
                "comparisons": 0,
                "steps": [],
                "execution_time_ms": 0.0,
                "complexity": "O(log n + k)",
                "sorted_array": []
            }), 200

        # Sort students ascending by percentage using manual Merge Sort
        sort_res = merge_sort_students(students, key="percentage", reverse=False)
        sorted_students = sort_res["sorted_data"]

        # Run O(log n + k) Range Query using binary search bounds
        range_res = range_query_by_percentage(sorted_students, min_val, max_val, key="percentage")

        return jsonify({
            "success": True,
            "min_percentage": min_val,
            "max_percentage": max_val,
            "left_boundary": range_res["left_boundary"],
            "right_boundary": range_res["right_boundary"],
            "students_found": range_res["students_found"],
            "students": range_res["students"],
            "comparisons": range_res["comparisons"],
            "steps": range_res["steps"],
            "execution_time_ms": range_res["execution_time"],
            "complexity": range_res["complexity"],
            "input_size": len(sorted_students),
            "sorted_array": [
                {
                    "index": i,
                    "id": s["id"],
                    "roll_no": s["roll_no"],
                    "name": s["name"],
                    "percentage": s.get("percentage"),
                    "grade": s.get("grade"),
                    "in_range": range_res["left_boundary"] <= i <= range_res["right_boundary"] if range_res["left_boundary"] != -1 else False
                }
                for i, s in enumerate(sorted_students)
            ]
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
