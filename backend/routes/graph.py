from flask import Blueprint, request, jsonify
from models import StudentModel
from algorithms.graph import build_subject_graph, bfs, dfs, SUBJECTS

graph_bp = Blueprint("graph", __name__, url_prefix="/api/graph")

@graph_bp.route("", methods=["GET"])
def get_graph():
    """
    Returns the subject relationship graph.
    Edge weights are calculated via Pearson correlation over current student marks.
    """
    try:
        students = StudentModel.get_all()
        graph_data = build_subject_graph(students)
        return jsonify({
            "success": True,
            **graph_data
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@graph_bp.route("/bfs", methods=["POST"])
def run_bfs():
    """
    Executes manual Breadth-First Search (BFS) using a FIFO queue.
    Accepts JSON: { "start_node": "Programming" }
    """
    try:
        data = request.get_json() or {}
        start_node = data.get("start_node", "Programming")
        
        if not start_node or start_node not in SUBJECTS:
            return jsonify({
                "success": False, 
                "error": f"Invalid start_node '{start_node}'. Valid subjects: {SUBJECTS}"
            }), 400

        students = StudentModel.get_all()
        graph_data = build_subject_graph(students)
        adj_list = graph_data["adjacency_list"]

        bfs_result = bfs(adj_list, start_node)
        return jsonify({
            "success": True,
            **bfs_result
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@graph_bp.route("/dfs", methods=["POST"])
def run_dfs():
    """
    Executes manual Depth-First Search (DFS) using an explicit LIFO stack.
    Accepts JSON: { "start_node": "Programming" }
    """
    try:
        data = request.get_json() or {}
        start_node = data.get("start_node", "Programming")

        if not start_node or start_node not in SUBJECTS:
            return jsonify({
                "success": False, 
                "error": f"Invalid start_node '{start_node}'. Valid subjects: {SUBJECTS}"
            }), 400

        students = StudentModel.get_all()
        graph_data = build_subject_graph(students)
        adj_list = graph_data["adjacency_list"]

        dfs_result = dfs(adj_list, start_node)
        return jsonify({
            "success": True,
            **dfs_result
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
