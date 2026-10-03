from flask import Blueprint, request, jsonify
from models import StudentModel
from algorithms.sorting import merge_sort_students

students_bp = Blueprint("students", __name__, url_prefix="/api/students")

SUBJECTS = ["mathematics", "physics", "programming", "data_structures", "algorithms"]



@students_bp.route("", methods=["GET"])
def get_all_students():
    try:
        students = StudentModel.get_all()
        return jsonify({
            "success": True,
            "count": len(students),
            "students": students
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@students_bp.route("/<int:student_id>", methods=["GET"])
def get_student(student_id: int):
    try:
        student = StudentModel.get_by_id(student_id)
        if not student:
            return jsonify({"success": False, "error": f"Student with ID {student_id} not found"}), 404

        # Subject breakdown & analysis
        subject_scores = {
            "Mathematics": student["mathematics"],
            "Physics": student["physics"],
            "Programming": student["programming"],
            "Data Structures": student["data_structures"],
            "Algorithms": student["algorithms"]
        }

        strongest_subject = max(subject_scores.items(), key=lambda x: x[1])
        weakest_subject = min(subject_scores.items(), key=lambda x: x[1])
        avg_marks = round(sum(subject_scores.values()) / 5.0, 2)

        # Compute dynamic rank using Merge Sort on all students
        all_students = StudentModel.get_all()
        sorted_pack = merge_sort_students(all_students, key="percentage", reverse=True)
        sorted_list = sorted_pack["sorted_data"]
        
        current_rank = 1
        for idx, s in enumerate(sorted_list):
            if s["id"] == student_id:
                current_rank = idx + 1
                break

        return jsonify({
            "success": True,
            "student": student,
            "analysis": {
                "rank": current_rank,
                "total_students": len(all_students),
                "strongest_subject": {"subject": strongest_subject[0], "marks": strongest_subject[1]},
                "weakest_subject": {"subject": weakest_subject[0], "marks": weakest_subject[1]},
                "average_marks": avg_marks,
                "subject_scores": subject_scores
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@students_bp.route("", methods=["POST"])
def create_student():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be valid JSON"}), 400

        # Field presence
        required_fields = ["roll_no", "name", "department"]
        for f in required_fields:
            if not data.get(f) or not str(data.get(f)).strip():
                return jsonify({"success": False, "error": f"Field '{f}' is required"}), 400

        # Unique roll_no check
        roll_no = str(data["roll_no"]).strip()
        if StudentModel.get_by_roll_no(roll_no):
            return jsonify({"success": False, "error": f"Roll number '{roll_no}' already exists"}), 409

        # Validate marks
        marks_dict = {}
        for subj in SUBJECTS:
            val = data.get(subj)
            if val is None:
                return jsonify({"success": False, "error": f"Marks for '{subj}' are required"}), 400
            try:
                num = float(val)
                if num < 0.0 or num > 100.0:
                    return jsonify({"success": False, "error": f"Marks for '{subj}' must be between 0 and 100"}), 400
                marks_dict[subj] = round(num, 2)
            except (ValueError, TypeError):
                return jsonify({"success": False, "error": f"Marks for '{subj}' must be a valid number"}), 400

        student_data = {
            "roll_no": roll_no,
            "name": str(data["name"]).strip(),
            "department": str(data["department"]).strip(),
            **marks_dict
        }

        created = StudentModel.create(student_data)
        return jsonify({
            "success": True,
            "message": "Student created successfully",
            "student": created
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@students_bp.route("/<int:student_id>", methods=["PUT"])
def update_student(student_id: int):
    try:
        existing = StudentModel.get_by_id(student_id)
        if not existing:
            return jsonify({"success": False, "error": f"Student with ID {student_id} not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be valid JSON"}), 400

        # If roll_no is changed, check uniqueness
        new_roll = data.get("roll_no")
        if new_roll:
            new_roll = str(new_roll).strip()
            existing_with_roll = StudentModel.get_by_roll_no(new_roll)
            if existing_with_roll and existing_with_roll["id"] != student_id:
                return jsonify({"success": False, "error": f"Roll number '{new_roll}' is already used by another student"}), 409

        # Validate marks if provided
        for subj in SUBJECTS:
            if subj in data:
                try:
                    num = float(data[subj])
                    if num < 0.0 or num > 100.0:
                        return jsonify({"success": False, "error": f"Marks for '{subj}' must be between 0 and 100"}), 400
                except (ValueError, TypeError):
                    return jsonify({"success": False, "error": f"Marks for '{subj}' must be a valid number"}), 400

        updated = StudentModel.update(student_id, data)
        return jsonify({
            "success": True,
            "message": "Student updated successfully",
            "student": updated
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@students_bp.route("/<int:student_id>", methods=["DELETE"])
def delete_student(student_id: int):
    try:
        existing = StudentModel.get_by_id(student_id)
        if not existing:
            return jsonify({"success": False, "error": f"Student with ID {student_id} not found"}), 404

        success = StudentModel.delete(student_id)
        return jsonify({
            "success": success,
            "message": f"Student '{existing['name']}' ({existing['roll_no']}) deleted successfully"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
