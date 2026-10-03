# Student Result Analyzer — DAA Algorithmic Platform

[![DAA Hackathon](https://img.shields.io/badge/DAA-Hackathon%20Project-blue.svg)](https://github.com)
[![Python 3.13+](https://img.shields.io/badge/Python-3.13%2B-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Backend-Flask-lightgrey.svg)](https://flask.palletsprojects.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-cyan.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blueviolet.svg)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-21%2F21%20Passed-brightgreen.svg)](https://pytest.org)

An algorithm-centric, production-quality full-stack academic intelligence platform designed for Design & Analysis of Algorithms (DAA) evaluation. It puts **Data Structures & Algorithms** at the center of student performance evaluation, providing live execution telemetry, comparison counters, boundary spotlights, and step-by-step decision animations.

---

## 1. Problem Statement

Academic result processing systems commonly rely on opaque, non-visual library functions. This project solves that deficiency by delivering a transparent, visual algorithm engine that:
1. Stores student subject marks and computes totals, percentages, and letter grades.
2. Ranks students using a **pure, manual Merge Sort** algorithm with multi-attribute tie breaking.
3. Searches students efficiently using a **pure, manual Binary Search** with visual array elimination.
4. Answers score range queries using **Dual Binary Search Lower & Upper Bounds** in $O(\log n + k)$ time instead of a linear scan.
5. Models subject curriculum relationships as an **undirected Graph** weighted by **Pearson Correlation Coefficients** derived from student performance.
6. Traverses the curriculum graph using **manual BFS (FIFO Queue)** and **manual DFS (LIFO Stack)** with live state inspection.
7. Logs every comparison, merge, and pointer update with microsecond execution timings.

---

## 2. Core Algorithmic Architecture Pipeline

```text
STUDENT DATA (SQLite)
        ↓
MANUAL MERGE SORT (Divide & Conquer)
        ↓
ACADEMIC RANKING (Tie Handling)
        ↓
PRE-SORTED ARRAY
        ↓
MANUAL BINARY SEARCH (Low / Mid / High Pointers)
        ↓
RANGE QUERY (Dual Binary Search Boundaries)
        ↓
SUBJECT RELATIONSHIP GRAPH (Pearson Correlation Weights)
        ↓
BFS / DFS TRAVERSAL (Queue / Stack Telemetry)
        ↓
VISUAL EXECUTION & DAA BENCHMARK MATRIX
```

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite 6 | Type-safe dynamic single-page web application |
| **Styling** | Tailwind CSS 3.4 | Dark / Navy / Purple / Cyan glassmorphism interface |
| **Charts** | Recharts, SVG, HTML5 Canvas | Visualizations for score bands, grades, and graph nodes |
| **Icons** | Lucide React | Modern interface iconography |
| **Backend** | Python Flask, Flask-CORS | Modular REST API blueprints and algorithm implementations |
| **Database** | SQLite3 | Parameterized SQL relational persistence |
| **Testing** | Pytest, Unittest | Automated test suites for all 4 core algorithms |

---

## 4. Database Schema

Database file: `backend/student_results.db`

### Table: `students`

```sql
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    mathematics REAL NOT NULL CHECK(mathematics >= 0 AND mathematics <= 100),
    physics REAL NOT NULL CHECK(physics >= 0 AND physics <= 100),
    programming REAL NOT NULL CHECK(programming >= 0 AND programming <= 100),
    data_structures REAL NOT NULL CHECK(data_structures >= 0 AND data_structures <= 100),
    algorithms REAL NOT NULL CHECK(algorithms >= 0 AND algorithms <= 100),
    total REAL NOT NULL,
    percentage REAL NOT NULL,
    grade TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Grade Calculation Formula

$$\text{Total} = \text{Math} + \text{Physics} + \text{Programming} + \text{Data Structures} + \text{Algorithms} \quad (\text{Max } 500)$$

$$\text{Percentage} = \left(\frac{\text{Total}}{500}\right) \times 100$$

| Percentage Range | Letter Grade |
|---|---|
| $90.0\% - 100.0\%$ | **A+** |
| $80.0\% - 89.99\%$ | **A** |
| $70.0\% - 79.99\%$ | **B** |
| $60.0\% - 69.99\%$ | **C** |
| $50.0\% - 59.99\%$ | **D** |
| $0.0\% - 49.99\%$ | **F** |

---

## 5. Algorithms & Data Structures

### 1. Merge Sort (`backend/algorithms/sorting.py`)
- **Zero Library Call Rule:** Implemented completely manually without `sorted()` or `list.sort()`.
- **Strategy:** Divide-and-conquer splitting down to subarrays of length 1, followed by ordered merging.
- **Tie-Breaker:** When percentages are identical, ties are broken sequentially by Total Marks, Algorithms Marks, and Roll Number.
- **Telemetry:** Logs comparison count, merge operations count, execution time in ms, and step-by-step left/right decisions.
- **Complexity:** $O(n \log n)$ time, $O(n)$ auxiliary space.

### 2. Binary Search (`backend/algorithms/binary_search.py`)
- **Zero Library Call Rule:** Implemented without `in`, `index()`, or `list.index()`.
- **Strategy:** Maintains `Low`, `Mid`, `High` pointers on an ascendingly pre-sorted student list, eliminating half of the search space at every step.
- **Telemetry:** Logs pointer movements, middle value comparisons, and elimination decisions.
- **Complexity:** $O(\log n)$ time, $O(1)$ auxiliary space.

### 3. Range Query Analyzer (`backend/algorithms/range_query.py`)
- **Zero Linear Scan Rule:** Does not iterate $O(n)$ across students.
- **Strategy:** Executes two independent Binary Searches:
  1. **Lower Bound:** Finds the first index $i$ where $\text{percentage} \ge \text{min\_val}$.
  2. **Upper Bound:** Finds the first index $j$ where $\text{percentage} > \text{max\_val}$.
  3. Returns slice $[i, j)$ in $O(\log n + k)$ time, where $k$ is the number of matching students.
- **Complexity:** $O(\log n + k)$ time.

### 4. Subject Relationship Graph (`backend/algorithms/graph.py`)
- **Representation:** Adjacency List `Dict[str, List[Dict[str, Any]]]`.
- **Edge Weights (Pearson Correlation):**
  $$r = \frac{\sum (X_i - \bar{X})(Y_i - \bar{Y})}{\sqrt{\sum (X_i - \bar{X})^2 \sum (Y_i - \bar{Y})^2}}$$
  Edge weights between subjects reflect the statistical score correlation across students.
- **Breadth-First Search (BFS):** Implemented using an explicit FIFO Queue (`collections.deque`).
- **Depth-First Search (DFS):** Implemented using an explicit LIFO Stack.
- **Complexity:** $O(V + E)$ time, $O(V)$ auxiliary space.

---

## 6. Asymptotic Complexity Summary

| Algorithm | Data Structure | Time Complexity | Space Complexity | Purpose |
|---|---|---|---|---|
| **Merge Sort** | Array / Tree | $O(n \log n)$ | $O(n)$ | Academic Ranking & Total Ordering |
| **Binary Search** | Pre-sorted Array | $O(\log n)$ | $O(1)$ | Single Student Lookup |
| **Range Query** | Pre-sorted Array | $O(\log n + k)$ | $O(k)$ | Score Band Boundary Extraction |
| **Graph BFS** | Adjacency List + Queue | $O(V + E)$ | $O(V)$ | Layer-wise Curriculum Traversal |
| **Graph DFS** | Adjacency List + Stack | $O(V + E)$ | $O(V)$ | Deep Prerequisite Chain Traversal |

---

## 7. REST API Documentation

| Method | Endpoint | Description | Sample Payload / Params |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | — |
| `GET` | `/api/statistics` | Dashboard cohort telemetry | — |
| `GET` | `/api/students` | Read all students | — |
| `POST` | `/api/students` | Create student record | `{"roll_no":"CS01", "name":"Alice", ...}` |
| `GET` | `/api/students/<id>` | Read single student with rank & strength analysis | — |
| `PUT` | `/api/students/<id>` | Update student information & marks | `{"mathematics": 98.0}` |
| `DELETE`| `/api/students/<id>` | Delete student record | — |
| `GET` | `/api/rankings` | Run manual Merge Sort & assign ranks | `?key=percentage&order=desc` |
| `POST` | `/api/binary-search` | Run manual Binary Search with step trace | `{"target": 87.0, "key": "percentage"}` |
| `POST` | `/api/range-query` | Run Dual Binary Search Range Query | `{"min_percentage": 70.0, "max_percentage": 90.0}` |
| `GET` | `/api/graph` | Fetch graph nodes & Pearson correlation edges | — |
| `POST` | `/api/graph/bfs` | Execute manual BFS from start subject | `{"start_node": "Programming"}` |
| `POST` | `/api/graph/dfs` | Execute manual DFS from start subject | `{"start_node": "Programming"}` |

---

## 8. Installation & Setup Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.13)
- Node.js 18+ and npm

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python seed.py        # Populates 24 realistic student records
python app.py         # Starts Flask API server on http://127.0.0.1:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev           # Starts Vite dev server on http://localhost:5173
```

---

## 9. Running Tests

### Automated Backend Unit Tests

Run the full pytest suite covering empty arrays, single elements, duplicates, tie breaking, edge indices, boundary extraction, Pearson correlations, and graph traversals:

```bash
python -m pytest backend/tests
```

**Result:** `21 passed in 0.12s`

### Automated End-to-End Integration Test

Verify all 9 lifecycle operations (Student CRUD, Merge Sort, Binary Search, Range Query, BFS, DFS) over live HTTP:

```bash
python backend/integration_test.py
```

---

## 10. Hackathon Demonstration Steps for Judges

1. **Dashboard (`/`)**:
   - Inspect cohort telemetry cards (24 Students, Avg %, Highest %, Pass Rate, A+ Students).
   - Review the Score Bands bar chart and Grade Distribution horizontal chart.
2. **Students Directory (`/students`)**:
   - View the interactive student table.
   - Click the Eye icon on any student to view their **radar/bar profile**, calculated rank, strongest subject, and weakest subject.
   - Click **Add Student** to create a student with real-time mark validation (0-100).
3. **Rankings (`/rankings`)**:
   - Observe **Merge Sort** ranking generated with $O(n \log n)$ divide-and-conquer.
   - Click **Auto Play** or **Next Step** on the **Merge Sort Visualizer** to step through comparisons and subarray merges.
   - Verify tie-breaking logic where identical percentages are disambiguated by total marks.
4. **Binary Search Visualizer (`/binary-search`)**:
   - Click preset button `87.0% (Found)`.
   - Watch the animated `LOW`, `MID`, `HIGH` pointers eliminate half the array boxes at each step.
   - Click preset `99.5% (Not Found)` to demonstrate graceful search space exhaustion.
   - Click directly on any array box in the visual stream to set it as target.
5. **Range Query Analyzer (`/range-query`)**:
   - Enter `70%` and `90%` and click **Execute Range Query**.
   - See the Lower Bound and Upper Bound binary search boundaries spotlighted on the sorted array.
   - Verify that only $O(\log n + k)$ operations are executed rather than a full linear scan.
6. **Subject Relationship Graph (`/subject_graph`)**:
   - Drag subject nodes around the SVG constellation to test physics/layout interactivity.
   - Hover over edge weight pills to view Pearson correlation values ($r = 0.91$, $0.82$, etc.).
   - Select **Programming** as the starting node, click **Run BFS**, and step through the FIFO queue.
   - Click **Run DFS** and inspect the LIFO stack trace.
7. **Algorithm Lab (`/algorithm_lab`)**:
   - Click **Run Live Benchmark Suite**.
   - Inspect the live empirical comparison matrix showing actual comparisons, steps, and execution time in milliseconds measured directly on the live database.
8. **About (`/about`)**:
   - Review architectural pipeline documentation and manual implementation guarantees.

---

## 11. Project Directory Structure

```text
student-result-analyzer/
├── backend/
│   ├── algorithms/
│   │   ├── __init__.py
│   │   ├── sorting.py            # Manual Merge Sort (No sorted()/list.sort())
│   │   ├── binary_search.py      # Manual Binary Search (No in/index())
│   │   ├── range_query.py        # Dual Binary Search Lower & Upper Bounds
│   │   └── graph.py              # Pearson Correlation, manual BFS & DFS
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── students.py           # CRUD endpoints with subject analysis
│   │   ├── rankings.py           # Ranking endpoint using Merge Sort
│   │   ├── search.py             # Binary search & Range query endpoints
│   │   ├── graph.py              # Graph, BFS, and DFS endpoints
│   │   └── statistics.py         # Summary analytics endpoint
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_sorting.py       # Sorting unit tests
│   │   ├── test_binary_search.py # Binary search unit tests
│   │   ├── test_range_query.py   # Range query unit tests
│   │   └── test_graph.py         # Graph BFS/DFS unit tests
│   ├── database.py               # SQLite connection & schema initialization
│   ├── models.py                 # StudentModel CRUD & parameterization
│   ├── seed.py                   # 24 realistic students dataset
│   ├── integration_test.py       # Full HTTP end-to-end integration tests
│   ├── app.py                    # Main Flask entrypoint with CORS
│   ├── requirements.txt
│   └── student_results.db
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── index.html
│   └── src/
│       ├── api/
│       │   └── api.ts            # Type-safe API client
│       ├── components/
│       │   ├── Sidebar.tsx       # Navigation drawer with active badges
│       │   ├── Header.tsx        # Title bar & global student addition
│       │   ├── StatCard.tsx      # Glowing metric card
│       │   ├── StudentTable.tsx  # Responsive student data table
│       │   ├── StudentModal.tsx  # Create / Edit modal with validation
│       │   ├── StudentDetailModal.tsx # Performance & subject breakdown modal
│       │   ├── AlgorithmStats.tsx # Algorithmic telemetry banner
│       │   ├── SortingVisualizer.tsx # Merge sort step player & spotlight
│       │   ├── SearchVisualizer.tsx  # Binary search array box stream
│       │   └── GraphVisualizer.tsx   # SVG graph with draggable nodes
│       ├── pages/
│       │   ├── Dashboard.tsx     # Cohort analytics & Recharts
│       │   ├── Students.tsx      # CRUD management page
│       │   ├── Rankings.tsx      # Merge sort leaderboard
│       │   ├── BinarySearch.tsx  # Dedicated binary search visualizer
│       │   ├── RangeQuery.tsx    # Range query analyzer
│       │   ├── SubjectGraph.tsx  # Subject correlation graph & traversals
│       │   ├── AlgorithmLab.tsx  # Live empirical benchmark matrix
│       │   └── About.tsx         # DAA principles & documentation
│       ├── types/
│       │   └── index.ts          # Complete TypeScript interfaces
│       ├── styles/
│       │   └── index.css         # Glassmorphism & Tailwind styles
│       ├── App.tsx
│       └── main.tsx
│
└── README.md
```

---

## 12. Future Enhancements

1. **Dijkstra's Shortest Path:** Finding optimal prerequisite progression paths based on weighted difficulty inverse correlations.
2. **Topological Sort:** Detecting curriculum dependency cycles for prerequisite validation.
3. **Dynamic Programming:** Multi-criteria student scholarship and honor roll knapsack optimization.
4. **CSV Bulk Import/Export:** Direct ingestion of university transcript records.

---

### Developed for DAA Hackathon Evaluation
All algorithms and mathematical models are verified, documented, and reproducible.
