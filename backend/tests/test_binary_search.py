import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from algorithms.binary_search import binary_search

SAMPLE_ARRAY = [
    {"id": 1, "name": "A", "percentage": 45.0, "roll_no": "R01"},
    {"id": 2, "name": "B", "percentage": 52.0, "roll_no": "R02"},
    {"id": 3, "name": "C", "percentage": 61.0, "roll_no": "R03"},
    {"id": 4, "name": "D", "percentage": 67.0, "roll_no": "R04"},
    {"id": 5, "name": "E", "percentage": 72.0, "roll_no": "R05"},
    {"id": 6, "name": "F", "percentage": 78.0, "roll_no": "R06"},
    {"id": 7, "name": "G", "percentage": 82.0, "roll_no": "R07"},
    {"id": 8, "name": "H", "percentage": 87.0, "roll_no": "R08"},
    {"id": 9, "name": "I", "percentage": 91.0, "roll_no": "R09"},
    {"id": 10, "name": "J", "percentage": 96.0, "roll_no": "R10"}
]

def test_target_exists():
    res = binary_search(SAMPLE_ARRAY, 87.0, key="percentage")
    assert res["found"] is True
    assert res["index"] == 7
    assert res["student"]["name"] == "H"
    assert res["comparisons"] > 0
    assert len(res["steps"]) > 0
    assert "low" in res["steps"][0]
    assert "mid" in res["steps"][0]
    assert "high" in res["steps"][0]

def test_target_does_not_exist():
    res = binary_search(SAMPLE_ARRAY, 99.0, key="percentage")
    assert res["found"] is False
    assert res["index"] == -1
    assert res["student"] is None
    assert res["comparisons"] > 0
    assert len(res["steps"]) > 0
    last_step = res["steps"][-1]
    assert "NOT FOUND" in last_step["decision"]

def test_first_element():
    res = binary_search(SAMPLE_ARRAY, 45.0, key="percentage")
    assert res["found"] is True
    assert res["index"] == 0
    assert res["student"]["name"] == "A"

def test_last_element():
    res = binary_search(SAMPLE_ARRAY, 96.0, key="percentage")
    assert res["found"] is True
    assert res["index"] == 9
    assert res["student"]["name"] == "J"

def test_search_by_string_roll_no():
    res = binary_search(SAMPLE_ARRAY, "R05", key="roll_no")
    assert res["found"] is True
    assert res["index"] == 4
    assert res["student"]["name"] == "E"

def test_empty_array():
    res = binary_search([], 75.0, key="percentage")
    assert res["found"] is False
    assert res["index"] == -1
    assert res["comparisons"] == 0
