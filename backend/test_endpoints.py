import urllib.request
import json

def test(name, url, payload=None):
    try:
        req = urllib.request.Request(url, headers={'Content-Type': 'application/json'})
        if payload:
            req.data = json.dumps(payload).encode('utf-8')
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"[PASS] {name} ({resp.status}): keys={list(data.keys())[:5]}")
            return data
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
        return None

if __name__ == "__main__":
    test("Health", "http://127.0.0.1:5000/api/health")
    test("Statistics", "http://127.0.0.1:5000/api/statistics")
    test("Students List", "http://127.0.0.1:5000/api/students")
    test("Student Details", "http://127.0.0.1:5000/api/students/1")
    test("Rankings (Merge Sort)", "http://127.0.0.1:5000/api/rankings")
    test("Binary Search", "http://127.0.0.1:5000/api/binary-search", {"target": 87.0, "key": "percentage"})
    test("Range Query", "http://127.0.0.1:5000/api/range-query", {"min_percentage": 70.0, "max_percentage": 90.0})
    test("Graph Structure", "http://127.0.0.1:5000/api/graph")
    test("Graph BFS", "http://127.0.0.1:5000/api/graph/bfs", {"start_node": "Programming"})
    test("Graph DFS", "http://127.0.0.1:5000/api/graph/dfs", {"start_node": "Programming"})
