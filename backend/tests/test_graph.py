import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from algorithms.graph import build_subject_graph, bfs, dfs, calculate_pearson_correlation

def test_pearson_correlation():
    x = [80.0, 85.0, 90.0, 95.0, 100.0]
    y = [75.0, 80.0, 85.0, 90.0, 95.0]
    # Perfect linear correlation
    r = calculate_pearson_correlation(x, y)
    assert round(r, 2) == 1.0

def test_graph_construction():
    students = [
        {"mathematics": 90, "physics": 85, "programming": 92, "data_structures": 90, "algorithms": 94},
        {"mathematics": 70, "physics": 65, "programming": 72, "data_structures": 70, "algorithms": 74},
        {"mathematics": 80, "physics": 75, "programming": 82, "data_structures": 80, "algorithms": 84},
        {"mathematics": 60, "physics": 55, "programming": 62, "data_structures": 60, "algorithms": 64},
        {"mathematics": 50, "physics": 45, "programming": 52, "data_structures": 50, "algorithms": 54}
    ]
    graph_data = build_subject_graph(students)
    assert "nodes" in graph_data
    assert len(graph_data["nodes"]) == 5
    assert "adjacency_list" in graph_data
    assert "Programming" in graph_data["adjacency_list"]
    assert len(graph_data["edges"]) > 0

def test_bfs_traversal():
    graph_data = build_subject_graph([])
    adj_list = graph_data["adjacency_list"]
    
    res = bfs(adj_list, "Programming")
    assert res["algorithm"] == "BFS"
    assert res["start_node"] == "Programming"
    assert len(res["visit_order"]) == 5
    assert res["visit_order"][0] == "Programming"
    assert len(res["steps"]) > 0
    assert res["complexity"] == "O(V + E)"

def test_dfs_traversal():
    graph_data = build_subject_graph([])
    adj_list = graph_data["adjacency_list"]

    res = dfs(adj_list, "Programming")
    assert res["algorithm"] == "DFS"
    assert res["start_node"] == "Programming"
    assert len(res["visit_order"]) == 5
    assert res["visit_order"][0] == "Programming"
    assert len(res["steps"]) > 0
    assert res["complexity"] == "O(V + E)"

def test_invalid_start_node():
    graph_data = build_subject_graph([])
    adj_list = graph_data["adjacency_list"]

    with pytest.raises(ValueError) as excinfo:
        bfs(adj_list, "Quantum Mechanics")
    assert "not found in graph" in str(excinfo.value)

    with pytest.raises(ValueError) as excinfo:
        dfs(adj_list, "Quantum Mechanics")
    assert "not found in graph" in str(excinfo.value)
