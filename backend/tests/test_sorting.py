import pytest
import sys
import os

# Add parent directory to sys.path so algorithms can be imported directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from algorithms.sorting import merge_sort_students

def test_empty_array():
    res = merge_sort_students([], key="percentage", reverse=True)
    assert res["sorted_data"] == []
    assert res["comparison_count"] == 0
    assert res["merge_count"] == 0
    assert res["input_size"] == 0

def test_one_student():
    student = [{"id": 1, "name": "Alice", "percentage": 85.0, "total": 425}]
    res = merge_sort_students(student, key="percentage", reverse=True)
    assert len(res["sorted_data"]) == 1
    assert res["sorted_data"][0]["name"] == "Alice"
    assert res["comparison_count"] == 0
    assert res["merge_count"] == 0

def test_multiple_students():
    students = [
        {"id": 1, "name": "Charlie", "percentage": 72.0, "total": 360},
        {"id": 2, "name": "Alice", "percentage": 95.0, "total": 475},
        {"id": 3, "name": "Bob", "percentage": 84.0, "total": 420},
        {"id": 4, "name": "David", "percentage": 60.0, "total": 300},
    ]
    res = merge_sort_students(students, key="percentage", reverse=True)
    sorted_names = [s["name"] for s in res["sorted_data"]]
    assert sorted_names == ["Alice", "Bob", "Charlie", "David"]
    assert res["comparison_count"] > 0
    assert res["merge_count"] > 0
    assert len(res["steps"]) > 0

def test_duplicate_marks():
    students = [
        {"id": 1, "name": "Student A", "percentage": 80.0, "total": 400, "algorithms": 85},
        {"id": 2, "name": "Student B", "percentage": 80.0, "total": 400, "algorithms": 90},
        {"id": 3, "name": "Student C", "percentage": 90.0, "total": 450, "algorithms": 95},
    ]
    # In descending order, 90.0 first. For tied 80.0, higher algorithms (Student B: 90) comes before Student A (85)
    res = merge_sort_students(students, key="percentage", reverse=True)
    sorted_names = [s["name"] for s in res["sorted_data"]]
    assert sorted_names[0] == "Student C"
    assert sorted_names[1] == "Student B"
    assert sorted_names[2] == "Student A"

def test_descending_vs_ascending_ranking():
    students = [
        {"id": 1, "name": "Low", "percentage": 50.0},
        {"id": 2, "name": "High", "percentage": 90.0},
        {"id": 3, "name": "Mid", "percentage": 70.0},
    ]
    desc = merge_sort_students(students, key="percentage", reverse=True)
    assert [s["percentage"] for s in desc["sorted_data"]] == [90.0, 70.0, 50.0]

    asc = merge_sort_students(students, key="percentage", reverse=False)
    assert [s["percentage"] for s in asc["sorted_data"]] == [50.0, 70.0, 90.0]
