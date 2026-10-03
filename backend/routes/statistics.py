from flask import Blueprint, jsonify
from models import StudentModel

statistics_bp = Blueprint("statistics", __name__, url_prefix="/api/statistics")

@statistics_bp.route("", methods=["GET"])
def get_statistics():
    """
    Computes summary metrics for Dashboard and Visual Analysis:
    - Total Students
    - Average Percentage
    - Highest & Lowest Percentage
    - Pass Rate
    - A+ Student count
    - Subject Averages
    - Grade Distributions
    - Department Breakdown
    """
    try:
        students = StudentModel.get_all()
        total_count = len(students)

        if total_count == 0:
            return jsonify({
                "success": True,
                "total_students": 0,
                "average_percentage": 0.0,
                "highest_percentage": 0.0,
                "lowest_percentage": 0.0,
                "pass_rate": 0.0,
                "a_plus_students": 0,
                "subject_averages": {
                    "Mathematics": 0.0,
                    "Physics": 0.0,
                    "Programming": 0.0,
                    "Data Structures": 0.0,
                    "Algorithms": 0.0
                },
                "grade_distribution": {"A+": 0, "A": 0, "B": 0, "C": 0, "D": 0, "F": 0},
                "department_distribution": {},
                "score_bands": []
            }), 200

        percentages = [s["percentage"] for s in students]
        avg_pct = round(sum(percentages) / total_count, 2)
        highest_pct = round(max(percentages), 2)
        lowest_pct = round(min(percentages), 2)

        passing_count = sum(1 for p in percentages if p >= 50.0)
        pass_rate = round((passing_count / total_count) * 100.0, 2)
        a_plus_count = sum(1 for p in percentages if p >= 90.0)

        # Subject averages
        math_avg = round(sum(s["mathematics"] for s in students) / total_count, 2)
        phys_avg = round(sum(s["physics"] for s in students) / total_count, 2)
        prog_avg = round(sum(s["programming"] for s in students) / total_count, 2)
        ds_avg = round(sum(s["data_structures"] for s in students) / total_count, 2)
        algo_avg = round(sum(s["algorithms"] for s in students) / total_count, 2)

        # Grade distribution
        grades = {"A+": 0, "A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
        dept_counts = {}
        for s in students:
            g = s.get("grade", "F")
            grades[g] = grades.get(g, 0) + 1
            d = s.get("department", "General")
            dept_counts[d] = dept_counts.get(d, 0) + 1

        # Percentage score bands for charts
        bands = [
            {"range": "90-100%", "count": 0},
            {"range": "80-89%", "count": 0},
            {"range": "70-79%", "count": 0},
            {"range": "60-69%", "count": 0},
            {"range": "50-59%", "count": 0},
            {"range": "Below 50%", "count": 0}
        ]
        for p in percentages:
            if p >= 90:
                bands[0]["count"] += 1
            elif p >= 80:
                bands[1]["count"] += 1
            elif p >= 70:
                bands[2]["count"] += 1
            elif p >= 60:
                bands[3]["count"] += 1
            elif p >= 50:
                bands[4]["count"] += 1
            else:
                bands[5]["count"] += 1

        return jsonify({
            "success": True,
            "total_students": total_count,
            "average_percentage": avg_pct,
            "highest_percentage": highest_pct,
            "lowest_percentage": lowest_pct,
            "pass_rate": pass_rate,
            "a_plus_students": a_plus_count,
            "subject_averages": {
                "Mathematics": math_avg,
                "Physics": phys_avg,
                "Programming": prog_avg,
                "Data Structures": ds_avg,
                "Algorithms": algo_avg
            },
            "grade_distribution": grades,
            "department_distribution": dept_counts,
            "score_bands": bands
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
