export interface Student {
  id: number;
  roll_no: string;
  name: string;
  department: string;
  mathematics: number;
  physics: number;
  programming: number;
  data_structures: number;
  algorithms: number;
  total: number;
  percentage: number;
  grade: string;
  created_at?: string;
  rank?: number;
}

export interface StudentInput {
  roll_no: string;
  name: string;
  department: string;
  mathematics: number;
  physics: number;
  programming: number;
  data_structures: number;
  algorithms: number;
}

export interface StudentAnalysis {
  rank: number;
  total_students: number;
  strongest_subject: { subject: string; marks: number };
  weakest_subject: { subject: string; marks: number };
  average_marks: number;
  subject_scores: Record<string, number>;
}

export interface StudentDetailResponse {
  success: boolean;
  student: Student;
  analysis: StudentAnalysis;
}

export interface SortingStep {
  step: number;
  phase: string;
  left: number | string;
  right: number | string;
  left_student: string;
  right_student: string;
  comparison: string;
  decision: string;
}

export interface RankingsResponse {
  success: boolean;
  algorithm: string;
  sort_key: string;
  order: string;
  input_size: number;
  comparisons: number;
  merges: number;
  execution_time_ms: number;
  complexity: string;
  rankings: Student[];
  steps: SortingStep[];
}

export interface BinarySearchStep {
  step: number;
  low: number;
  mid: number;
  high: number;
  low_value?: number | string;
  mid_value?: number | string;
  high_value?: number | string;
  mid_student?: string;
  mid_roll_no?: string;
  target?: number | string;
  comparison: string;
  decision: string;
}

export interface SortedArrayItem {
  index: number;
  id: number;
  roll_no: string;
  name: string;
  value: number | string;
  percentage: number;
  grade: string;
}

export interface BinarySearchResponse {
  success: boolean;
  target: number | string;
  search_key: string;
  found: boolean;
  index: number;
  student: Student | null;
  comparisons: number;
  steps: BinarySearchStep[];
  execution_time_ms: number;
  complexity: string;
  input_size: number;
  sorted_array: SortedArrayItem[];
}

export interface RangeQueryStep {
  phase: string;
  step?: number;
  low?: number;
  mid?: number;
  high?: number;
  mid_value?: number;
  target?: number;
  student_name?: string;
  comparison?: string;
  decision?: string;
  description?: string;
}

export interface RangeArrayItem {
  index: number;
  id: number;
  roll_no: string;
  name: string;
  percentage: number;
  grade: string;
  in_range: boolean;
}

export interface RangeQueryResponse {
  success: boolean;
  min_percentage: number;
  max_percentage: number;
  left_boundary: number;
  right_boundary: number;
  students_found: number;
  students: Student[];
  comparisons: number;
  steps: RangeQueryStep[];
  execution_time_ms: number;
  complexity: string;
  input_size: number;
  sorted_array: RangeArrayItem[];
}

export interface GraphNode {
  id: string;
  name: string;
  category: string;
  color: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  relationship: string;
  formula?: string;
}

export interface GraphResponse {
  success: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  adjacency_list: Record<string, Array<{ node: string; weight: number; relationship: string }>>;
  correlation_formula: string;
}

export interface GraphTraversalStep {
  step: number;
  action: string;
  current_node: string;
  neighbor?: string;
  queue?: string[];
  stack?: string[];
  visited: string[];
  traversed_edge?: { from: string; to: string; weight: number } | null;
  decision: string;
}

export interface GraphTraversalResponse {
  success: boolean;
  algorithm: "BFS" | "DFS";
  start_node: string;
  visit_order: string[];
  visited_nodes: string[];
  visited_edges: Array<{ from: string; to: string; weight: number }>;
  steps: GraphTraversalStep[];
  execution_time: number;
  complexity: string;
  total_nodes_visited: number;
}

export interface StatisticsResponse {
  success: boolean;
  total_students: number;
  average_percentage: number;
  highest_percentage: number;
  lowest_percentage: number;
  pass_rate: number;
  a_plus_students: number;
  subject_averages: Record<string, number>;
  grade_distribution: Record<string, number>;
  department_distribution: Record<string, number>;
  score_bands: Array<{ range: string; count: number }>;
}
