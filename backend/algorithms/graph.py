import time
import math
from typing import List, Dict, Any, Tuple, Optional
from collections import deque

SUBJECTS = [
    "Mathematics",
    "Physics",
    "Programming",
    "Data Structures",
    "Algorithms"
]

SUBJECT_KEY_MAP = {
    "Mathematics": "mathematics",
    "Physics": "physics",
    "Programming": "programming",
    "Data Structures": "data_structures",
    "Algorithms": "algorithms"
}

# Standard baseline curriculum correlations as academic fallback / prior
BASELINE_EDGES = [
    {"source": "Programming", "target": "Data Structures", "weight": 0.91, "relation": "Prerequisite & Memory Models"},
    {"source": "Data Structures", "target": "Algorithms", "weight": 0.94, "relation": "Core Data Organization & Design"},
    {"source": "Mathematics", "target": "Algorithms", "weight": 0.82, "relation": "Discrete Mathematics & Complexity"},
    {"source": "Mathematics", "target": "Physics", "weight": 0.76, "relation": "Mathematical Physics & Calculus"},
    {"source": "Physics", "target": "Programming", "weight": 0.65, "relation": "Scientific Computation & Simulation"},
    {"source": "Programming", "target": "Algorithms", "weight": 0.88, "relation": "Algorithmic Implementation"},
    {"source": "Mathematics", "target": "Data Structures", "weight": 0.70, "relation": "Graph Theory & Combinatorics"}
]

def calculate_pearson_correlation(x_vals: List[float], y_vals: List[float]) -> float:
    """
    Computes Pearson Correlation Coefficient r between two subject score sets:
    r = sum((x - mean_x)*(y - mean_y)) / (sqrt(sum((x - mean_x)^2)) * sqrt(sum((y - mean_y)^2)))
    """
    n = len(x_vals)
    if n < 2:
        return 0.0

    mean_x = sum(x_vals) / n
    mean_y = sum(y_vals) / n

    cov = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_vals, y_vals))
    var_x = sum((x - mean_x) ** 2 for x in x_vals)
    var_y = sum((y - mean_y) ** 2 for y in y_vals)

    denominator = math.sqrt(var_x * var_y)
    if denominator == 0:
        return 0.0

    r = cov / denominator
    return max(-1.0, min(1.0, r))

def build_subject_graph(students: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Builds the subject relationship graph using adjacency list representation.
    Derives edge weights dynamically from Pearson correlation across student marks.
    If student count is too small or variance is zero, merges with baseline correlations.
    """
    adj_list: Dict[str, List[Dict[str, Any]]] = {subj: [] for subj in SUBJECTS}
    edges = []

    # Extract score vectors
    subject_scores = {}
    for subj in SUBJECTS:
        key = SUBJECT_KEY_MAP[subj]
        subject_scores[subj] = [float(s.get(key, 0.0)) for s in students if key in s]

    # Predefined curriculum connections
    pairs = [
        ("Programming", "Data Structures", "Prerequisite & Memory Models"),
        ("Data Structures", "Algorithms", "Core Data Organization & Design"),
        ("Mathematics", "Algorithms", "Discrete Mathematics & Complexity"),
        ("Mathematics", "Physics", "Mathematical Physics & Calculus"),
        ("Physics", "Programming", "Scientific Computation & Simulation"),
        ("Programming", "Algorithms", "Algorithmic Implementation"),
        ("Mathematics", "Data Structures", "Graph Theory & Combinatorics")
    ]

    has_sufficient_data = len(students) >= 5

    for u, v, rel in pairs:
        x_vec = subject_scores[u]
        y_vec = subject_scores[v]
        
        weight = 0.75  # sensible default
        if has_sufficient_data and len(x_vec) == len(y_vec) and len(x_vec) >= 5:
            r = calculate_pearson_correlation(x_vec, y_vec)
            # Normalize correlation to positive weight (0.50 - 0.99)
            norm_r = round(max(0.40, min(0.99, abs(r))), 2)
            weight = norm_r
        else:
            # Baseline weight fallback
            for b in BASELINE_EDGES:
                if (b["source"] == u and b["target"] == v) or (b["source"] == v and b["target"] == u):
                    weight = b["weight"]
                    break

        # Undirected graph edge
        edge_data = {
            "source": u,
            "target": v,
            "weight": weight,
            "relationship": rel,
            "formula": "Pearson Correlation: r = Cov(X,Y) / (sigma_X * sigma_Y)"
        }
        edges.append(edge_data)

        # Adjacency list
        adj_list[u].append({"node": v, "weight": weight, "relationship": rel})
        adj_list[v].append({"node": u, "weight": weight, "relationship": rel})

    nodes = [
        {"id": "Mathematics", "name": "Mathematics", "category": "Foundation", "color": "#3B82F6"},
        {"id": "Physics", "name": "Physics", "category": "Applied Sciences", "color": "#8B5CF6"},
        {"id": "Programming", "name": "Programming", "category": "Core Engineering", "color": "#10B981"},
        {"id": "Data Structures", "name": "Data Structures", "category": "Core CS", "color": "#F59E0B"},
        {"id": "Algorithms", "name": "Algorithms", "category": "Advanced Theory", "color": "#EC4899"}
    ]

    return {
        "nodes": nodes,
        "edges": edges,
        "adjacency_list": adj_list,
        "correlation_formula": "Pearson r = sum((X - mean(X))*(Y - mean(Y))) / (sqrt(sum((X - mean(X))^2)) * sqrt(sum((Y - mean(Y))^2)))"
    }

def bfs(graph: Dict[str, List[Dict[str, Any]]], start: str) -> Dict[str, Any]:
    """
    Executes Breadth-First Search (BFS) manually using a FIFO Queue.
    Tracks visit order, visited nodes, traversed edges, queue snapshots, and step-by-step trace.
    Complexity: O(V + E)
    """
    if start not in graph:
        raise ValueError(f"Start node '{start}' not found in graph.")

    start_time = time.perf_counter()
    steps = []
    visit_order = []
    visited_nodes = []
    visited_edges = []
    
    # Explicit FIFO Queue
    queue = deque([start])
    visited_set = {start}
    step_num = 1

    steps.append({
        "step": step_num,
        "action": f"Initialize BFS with start node '{start}' in queue.",
        "current_node": start,
        "queue": list(queue),
        "visited": list(visited_set),
        "traversed_edge": None,
        "decision": f"Enqueue '{start}'. Queue: {[start]}"
    })
    step_num += 1

    while queue:
        current = queue.popleft()
        visit_order.append(current)
        if current not in visited_nodes:
            visited_nodes.append(current)

        neighbors = graph.get(current, [])
        unvisited_neighbors = []

        for edge in neighbors:
            neighbor = edge["node"]
            weight = edge.get("weight", 1.0)
            
            if neighbor not in visited_set:
                visited_set.add(neighbor)
                queue.append(neighbor)
                visited_edges.append({"from": current, "to": neighbor, "weight": weight})
                unvisited_neighbors.append(neighbor)
                
                steps.append({
                    "step": step_num,
                    "action": f"Visit neighbor '{neighbor}' from '{current}' (weight {weight})",
                    "current_node": current,
                    "neighbor": neighbor,
                    "queue": list(queue),
                    "visited": list(visited_set),
                    "traversed_edge": {"from": current, "to": neighbor, "weight": weight},
                    "decision": f"'{neighbor}' is unvisited. Add edge ({current} -> {neighbor}) and enqueue '{neighbor}'."
                })
                step_num += 1
            else:
                steps.append({
                    "step": step_num,
                    "action": f"Inspect neighbor '{neighbor}' from '{current}'",
                    "current_node": current,
                    "neighbor": neighbor,
                    "queue": list(queue),
                    "visited": list(visited_set),
                    "traversed_edge": None,
                    "decision": f"'{neighbor}' is already visited. Skip edge."
                })
                step_num += 1

    end_time = time.perf_counter()
    execution_time_ms = round((end_time - start_time) * 1000.0, 4)

    return {
        "algorithm": "BFS",
        "start_node": start,
        "visit_order": visit_order,
        "visited_nodes": visited_nodes,
        "visited_edges": visited_edges,
        "steps": steps,
        "execution_time": execution_time_ms,
        "complexity": "O(V + E)",
        "total_nodes_visited": len(visit_order)
    }

def dfs(graph: Dict[str, List[Dict[str, Any]]], start: str) -> Dict[str, Any]:
    """
    Executes Depth-First Search (DFS) manually using an explicit LIFO Stack.
    Tracks visit order, visited nodes, traversed edges, stack snapshots, and step-by-step trace.
    Complexity: O(V + E)
    """
    if start not in graph:
        raise ValueError(f"Start node '{start}' not found in graph.")

    start_time = time.perf_counter()
    steps = []
    visit_order = []
    visited_nodes = []
    visited_edges = []
    
    # Explicit LIFO Stack: stores tuples of (node, parent, edge_weight)
    stack: List[Tuple[str, Optional[str], Optional[float]]] = [(start, None, None)]
    visited_set = set()
    step_num = 1

    steps.append({
        "step": step_num,
        "action": f"Initialize DFS with start node '{start}' on stack.",
        "current_node": start,
        "stack": [node for node, _, _ in stack],
        "visited": list(visited_set),
        "traversed_edge": None,
        "decision": f"Push '{start}' onto stack. Stack: {[start]}"
    })
    step_num += 1

    while stack:
        current, parent, weight = stack.pop()

        if current not in visited_set:
            visited_set.add(current)
            visit_order.append(current)
            visited_nodes.append(current)

            if parent is not None:
                visited_edges.append({"from": parent, "to": current, "weight": weight})

            steps.append({
                "step": step_num,
                "action": f"Pop and visit node '{current}'" + (f" from parent '{parent}'" if parent else ""),
                "current_node": current,
                "stack": [node for node, _, _ in stack],
                "visited": list(visited_set),
                "traversed_edge": {"from": parent, "to": current, "weight": weight} if parent else None,
                "decision": f"Mark '{current}' as visited and examine adjacent unvisited nodes."
            })
            step_num += 1

            # Push unvisited neighbors onto stack (reverse order for consistent traversal)
            neighbors = graph.get(current, [])
            for edge in reversed(neighbors):
                neighbor = edge["node"]
                edge_weight = edge.get("weight", 1.0)
                if neighbor not in visited_set:
                    stack.append((neighbor, current, edge_weight))
                    steps.append({
                        "step": step_num,
                        "action": f"Push unvisited neighbor '{neighbor}' onto stack",
                        "current_node": current,
                        "neighbor": neighbor,
                        "stack": [node for node, _, _ in stack],
                        "visited": list(visited_set),
                        "traversed_edge": None,
                        "decision": f"Push '{neighbor}' (weight {edge_weight}) onto stack."
                    })
                    step_num += 1

    end_time = time.perf_counter()
    execution_time_ms = round((end_time - start_time) * 1000.0, 4)

    return {
        "algorithm": "DFS",
        "start_node": start,
        "visit_order": visit_order,
        "visited_nodes": visited_nodes,
        "visited_edges": visited_edges,
        "steps": steps,
        "execution_time": execution_time_ms,
        "complexity": "O(V + E)",
        "total_nodes_visited": len(visit_order)
    }
