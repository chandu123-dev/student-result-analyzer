import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from algorithms.range_query import range_query_by_percentage

SAMPLE_ARRAY = [
    {"id": 1, "name": "A", "percentage": 45.0},
    {"id": 2, "name": "B", "percentage": 52.0},
    {"id": 3, "name": "C", "percentage": 61.0},
    {"id": 4, "name": "D", "percentage": 67.0},
    {"id": 5, "name": "E", "percentage": 72.0},
    {"id": 6, "name": "F", "percentage": 78.0},
    {"id": 7, "name": "G", "percentage": 82.0},
    {"id": 8, "name": "H", "percentage": 87.0},
    {"id": 9, "name": "I", "percentage": 91.0},
    {"id": 10, "name": "J", "percentage": 96.0}
]

def test_normal_range():
    # 70% to 90% should include E (72), F (78), G (82), H (87) -> 4 students
    res = range_query_by_percentage(SAMPLE_ARRAY, 70.0, 90.0)
    assert res["students_found"] == 4
    names = [s["name"] for s in res["students"]]
    assert names == ["E", "F", "G", "H"]
    assert res["left_boundary"] == 4
    assert res["right_boundary"] == 7
    assert res["comparisons"] > 0
    assert res["complexity"] == "O(log n + k)"

def test_empty_range():
    # 98% to 100% -> No students
    res = range_query_by_percentage(SAMPLE_ARRAY, 98.0, 100.0)
    assert res["students_found"] == 0
    assert res["students"] == []
    assert res["left_boundary"] == -1
    assert res["right_boundary"] == -1

def test_full_range():
    # 0% to 100% -> All students
    res = range_query_by_percentage(SAMPLE_ARRAY, 0.0, 100.0)
    assert res["students_found"] == 10
    assert res["left_boundary"] == 0
    assert res["right_boundary"] == 9

def test_single_value_range():
    # 72% to 72% -> exactly E (72.0)
    res = range_query_by_percentage(SAMPLE_ARRAY, 72.0, 72.0)
    assert res["students_found"] == 1
    assert res["students"][0]["name"] == "E"
    assert res["left_boundary"] == 4
    assert res["right_boundary"] == 4

def test_empty_input_array():
    res = range_query_by_percentage([], 50.0, 80.0)
    assert res["students_found"] == 0
    assert res["students"] == []
    assert res["left_boundary"] == -1
    assert res["right_boundary"] == -1
