import {
  Student,
  StudentInput,
  StudentDetailResponse,
  RankingsResponse,
  BinarySearchResponse,
  RangeQueryResponse,
  GraphResponse,
  GraphTraversalResponse,
  StatisticsResponse
} from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
    }

    return data as T;
  } catch (err: any) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Statistics
  getStatistics: () => request<StatisticsResponse>("/api/statistics"),

  // Students CRUD
  getStudents: () => request<{ success: boolean; count: number; students: Student[] }>("/api/students"),
  getStudentById: (id: number) => request<StudentDetailResponse>(`/api/students/${id}`),
  createStudent: (student: StudentInput) =>
    request<{ success: boolean; message: string; student: Student }>("/api/students", {
      method: "POST",
      body: JSON.stringify(student)
    }),
  updateStudent: (id: number, student: Partial<StudentInput>) =>
    request<{ success: boolean; message: string; student: Student }>(`/api/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(student)
    }),
  deleteStudent: (id: number) =>
    request<{ success: boolean; message: string }>(`/api/students/${id}`, {
      method: "DELETE"
    }),

  // Sorting / Rankings
  getRankings: (key: string = "percentage", order: string = "desc") =>
    request<RankingsResponse>(`/api/rankings?key=${encodeURIComponent(key)}&order=${encodeURIComponent(order)}`),

  // Binary Search
  binarySearch: (target: number | string, key: string = "percentage") =>
    request<BinarySearchResponse>("/api/binary-search", {
      method: "POST",
      body: JSON.stringify({ target, key })
    }),

  // Range Query
  rangeQuery: (min_percentage: number, max_percentage: number) =>
    request<RangeQueryResponse>("/api/range-query", {
      method: "POST",
      body: JSON.stringify({ min_percentage, max_percentage })
    }),

  // Graph & Traversals
  getGraph: () => request<GraphResponse>("/api/graph"),
  runBFS: (start_node: string) =>
    request<GraphTraversalResponse>("/api/graph/bfs", {
      method: "POST",
      body: JSON.stringify({ start_node })
    }),
  runDFS: (start_node: string) =>
    request<GraphTraversalResponse>("/api/graph/dfs", {
      method: "POST",
      body: JSON.stringify({ start_node })
    })
};
