from flask import Blueprint, request, jsonify
from models import StudentModel
from algorithms.sorting import merge_sort_students

rankings_bp = Blueprint("rankings", __name__, url_prefix="/api/rankings")

@rankings_bp.route("", methods=["GET"])
def get_rankings():
    """
    Ranks students using manual Merge Sort (no sorted() or .sort()).
    Assigns ranks with proper tie handling.
    Returns sorted students, comparison count, merge count, execution time, and step trace.
    """
    try:
        sort_key = request.args.get("key", "percentage")
        reverse_param = request.args.get("order", "desc").lower() == "desc"
        
        students = StudentModel.get_all()
        if not students:
            return jsonify({
                "success": True,
                "algorithm": "Merge Sort",
                "input_size": 0,
                "comparisons": 0,
                "merges": 0,
                "execution_time_ms": 0.0,
                "complexity": "O(n log n)",
                "rankings": [],
                "steps": []
            }), 200

        # Run manual Merge Sort
        sort_result = merge_sort_students(students, key=sort_key, reverse=reverse_param)
        sorted_list = sort_result["sorted_data"]

        # Assign ranks with standard competition tie handling
        ranked_students = []
        current_rank = 1
        for i, s in enumerate(sorted_list):
            item = dict(s)
            if i > 0:
                prev = sorted_list[i - 1]
                prev_val = prev.get(sort_key)
                curr_val = item.get(sort_key)
                if prev_val == curr_val:
                    # Same score gets the same rank as previous
                    item["rank"] = ranked_students[i - 1]["rank"]
                else:
                    # Next rank jumps to i + 1
                    item["rank"] = i + 1
            else:
                item["rank"] = 1
            ranked_students.append(item)

        return jsonify({
            "success": True,
            "algorithm": "Merge Sort",
            "sort_key": sort_key,
            "order": "descending" if reverse_param else "ascending",
            "input_size": sort_result["input_size"],
            "comparisons": sort_result["comparison_count"],
            "merges": sort_result["merge_count"],
            "execution_time_ms": sort_result["execution_time"],
            "complexity": "O(n log n)",
            "rankings": ranked_students,
            "steps": sort_result["steps"]
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
