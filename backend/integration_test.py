import urllib.request
import json

BASE = "http://127.0.0.1:5000/api"

def req(path, method="GET", payload=None):
    url = f"{BASE}{path}"
    headers = {"Content-Type": "application/json"}
    data = json.dumps(payload).encode("utf-8") if payload else None
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(request) as resp:
        return json.loads(resp.read().decode("utf-8"))

def run_tests():
    print("[1] Testing CRUD: Create Student...")
    create_payload = {
        "roll_no": "TEST-2024-999",
        "name": "Integration Test Student",
        "department": "Computer Science",
        "mathematics": 95.0,
        "physics": 92.0,
        "programming": 98.0,
        "data_structures": 96.0,
        "algorithms": 97.0
    }
    created = req("/students", method="POST", payload=create_payload)
    assert created["success"] is True
    student_id = created["student"]["id"]
    print(f"    Created student ID: {student_id}, Total: {created['student']['total']}, %: {created['student']['percentage']}, Grade: {created['student']['grade']}")

    print("[2] Testing CRUD: Read Student Details...")
    detail = req(f"/students/{student_id}")
    assert detail["success"] is True
    assert detail["student"]["roll_no"] == "TEST-2024-999"
    print(f"    Rank: #{detail['analysis']['rank']}, Strongest: {detail['analysis']['strongest_subject']['subject']} ({detail['analysis']['strongest_subject']['marks']})")

    print("[3] Testing CRUD: Update Student...")
    update_payload = {"mathematics": 99.0}
    updated = req(f"/students/{student_id}", method="PUT", payload=update_payload)
    assert updated["success"] is True
    assert updated["student"]["mathematics"] == 99.0
    print(f"    Updated mathematics to {updated['student']['mathematics']}, New Total: {updated['student']['total']}")

    print("[4] Testing Core Algorithm: Merge Sort Rankings...")
    rankings = req("/rankings?key=percentage&order=desc")
    assert rankings["success"] is True
    assert rankings["algorithm"] == "Merge Sort"
    assert rankings["comparisons"] > 0
    assert rankings["merges"] > 0
    print(f"    Input Size: {rankings['input_size']}, Comparisons: {rankings['comparisons']}, Merges: {rankings['merges']}, Time: {rankings['execution_time_ms']} ms")
    print(f"    Rank #1 Student: {rankings['rankings'][0]['name']} ({rankings['rankings'][0]['percentage']}%)")

    print("[5] Testing Core Algorithm: Binary Search...")
    search_target = updated["student"]["percentage"]
    search_res = req("/binary-search", method="POST", payload={"target": search_target, "key": "percentage"})
    assert search_res["success"] is True
    assert search_res["found"] is True
    print(f"    Target {search_target}% Found at index [{search_res['index']}], Comparisons: {search_res['comparisons']}, Steps: {len(search_res['steps'])}")

    print("[6] Testing Core Algorithm: Range Query [90% - 100%]...")
    range_res = req("/range-query", method="POST", payload={"min_percentage": 90.0, "max_percentage": 100.0})
    assert range_res["success"] is True
    assert range_res["students_found"] >= 1
    print(f"    Range [90% - 100%]: Boundaries [{range_res['left_boundary']} .. {range_res['right_boundary']}], Found: {range_res['students_found']} students")

    print("[7] Testing Core Algorithm: Graph BFS...")
    bfs_res = req("/graph/bfs", method="POST", payload={"start_node": "Programming"})
    assert bfs_res["success"] is True
    assert bfs_res["algorithm"] == "BFS"
    print(f"    BFS Visit Order: {' -> '.join(bfs_res['visit_order'])}, Steps: {len(bfs_res['steps'])}")

    print("[8] Testing Core Algorithm: Graph DFS...")
    dfs_res = req("/graph/dfs", method="POST", payload={"start_node": "Programming"})
    assert dfs_res["success"] is True
    assert dfs_res["algorithm"] == "DFS"
    print(f"    DFS Visit Order: {' -> '.join(dfs_res['visit_order'])}, Steps: {len(dfs_res['steps'])}")

    print("[9] Testing CRUD: Delete Student...")
    deleted = req(f"/students/{student_id}", method="DELETE")
    assert deleted["success"] is True
    print(f"    Deleted student ID: {student_id} successfully.")

    print("\n>>> ALL 9 END-TO-END INTEGRATION TESTS PASSED PERFECTLY! <<<")

if __name__ == "__main__":
    run_tests()
