import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { GraphResponse, GraphTraversalResponse } from "../types";
import { GraphVisualizer } from "../components/GraphVisualizer";
import { AlgorithmStats } from "../components/AlgorithmStats";
import { Share2, Network, Sparkles, BookOpen, Layers, GitBranch } from "lucide-react";

export const SubjectGraphPage: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [traversalResult, setTraversalResult] = useState<GraphTraversalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getGraph();
      setGraphData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load graph data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunTraversal = async (type: "BFS" | "DFS", startNode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      let res: GraphTraversalResponse;
      if (type === "BFS") {
        res = await api.runBFS(startNode);
      } else {
        res = await api.runDFS(startNode);
      }
      setTraversalResult(res);
    } catch (err: any) {
      setError(err.message || `Failed to execute ${type} traversal.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Share2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Subject Relationship Graph &amp; Traversals
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Undirected graph with edge weights derived from Pearson correlation across student marks
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-indigo-300 text-xs">
          <Sparkles className="w-4 h-4 text-brand-purple" />
          <span>Graph Theory: Adjacency List &amp; O(V + E)</span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Algorithm Telemetry Banner */}
      {traversalResult && (
        <AlgorithmStats
          algorithm={`${traversalResult.algorithm} Traversal (${traversalResult.start_node})`}
          complexity={traversalResult.complexity}
          executionTimeMs={traversalResult.execution_time}
          stepsCount={traversalResult.steps.length}
          extraStats={[
            {
              label: "Traversed Nodes",
              value: `${traversalResult.total_nodes_visited} / 5`,
              color: "text-brand-cyan"
            },
            {
              label: "Traversed Edges",
              value: traversalResult.visited_edges.length,
              color: "text-purple-300"
            }
          ]}
        />
      )}

      {/* Interactive Graph Visualizer Component */}
      {graphData && (
        <GraphVisualizer
          nodes={graphData.nodes}
          edges={graphData.edges}
          traversalResult={traversalResult}
          onRunTraversal={handleRunTraversal}
          isLoading={isLoading}
        />
      )}

      {/* Algorithm Theory & Methodology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BFS Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-blue-400">
            <Layers className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Breadth-First Search (BFS)</h3>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <p>
              <strong>Data Structure:</strong> FIFO Queue (<code className="text-blue-300">collections.deque</code>)
            </p>
            <p>
              <strong>Time Complexity:</strong> <span className="font-mono text-emerald-400">O(V + E)</span>
            </p>
            <p>
              <strong>Space Complexity:</strong> <span className="font-mono text-emerald-400">O(V)</span>
            </p>
            <p className="text-slate-400 pt-1">
              Visits all adjacent subject nodes layer-by-layer before descending deeper. Ideal for finding shortest curriculum path dependencies.
            </p>
          </div>
        </div>

        {/* DFS Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-purple-400">
            <GitBranch className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Depth-First Search (DFS)</h3>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <p>
              <strong>Data Structure:</strong> Explicit LIFO Stack
            </p>
            <p>
              <strong>Time Complexity:</strong> <span className="font-mono text-emerald-400">O(V + E)</span>
            </p>
            <p>
              <strong>Space Complexity:</strong> <span className="font-mono text-emerald-400">O(V)</span>
            </p>
            <p className="text-slate-400 pt-1">
              Traverses deeply along each branch of subject dependency before backtracking. Essential for topological ordering and cycle detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
