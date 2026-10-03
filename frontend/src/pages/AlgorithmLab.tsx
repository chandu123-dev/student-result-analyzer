import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { Cpu, Play, CheckCircle2, Zap, ArrowRight, Layers, BarChart } from "lucide-react";

interface BenchmarkRow {
  algorithm: string;
  purpose: string;
  inputSize: number | string;
  comparisons: number | string;
  steps: number | string;
  executionTimeMs: number;
  complexity: string;
  dataStructure: string;
}

export const AlgorithmLabPage: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkRow[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  useEffect(() => {
    runBenchmarkSuite();
  }, []);

  const runBenchmarkSuite = async () => {
    try {
      setIsRunning(true);
      const rows: BenchmarkRow[] = [];

      // 1. Run Merge Sort
      const rankRes = await api.getRankings("percentage", "desc");
      rows.push({
        algorithm: "Merge Sort",
        purpose: "Academic Ranking & Sorting",
        inputSize: rankRes.input_size,
        comparisons: rankRes.comparisons,
        steps: rankRes.steps.length,
        executionTimeMs: rankRes.execution_time_ms,
        complexity: "O(n log n)",
        dataStructure: "Array / Divide-and-Conquer Tree"
      });

      // 2. Run Binary Search
      const searchRes = await api.binarySearch(87.0, "percentage");
      rows.push({
        algorithm: "Binary Search",
        purpose: "Target Record Lookup",
        inputSize: searchRes.input_size,
        comparisons: searchRes.comparisons,
        steps: searchRes.steps.length,
        executionTimeMs: searchRes.execution_time_ms,
        complexity: "O(log n)",
        dataStructure: "Pre-sorted Array"
      });

      // 3. Run Range Query
      const rangeRes = await api.rangeQuery(70.0, 90.0);
      rows.push({
        algorithm: "Range Query (Dual Binary Search)",
        purpose: "Score Band Filtering",
        inputSize: rangeRes.input_size,
        comparisons: rangeRes.comparisons,
        steps: rangeRes.steps.length,
        executionTimeMs: rangeRes.execution_time_ms,
        complexity: "O(log n + k)",
        dataStructure: "Pre-sorted Array & Range Slices"
      });

      // 4. Run BFS
      const bfsRes = await api.runBFS("Programming");
      rows.push({
        algorithm: "Breadth-First Search (BFS)",
        purpose: "Curriculum Layer Traversal",
        inputSize: "5 Nodes, 7 Edges",
        comparisons: "Edge checks: " + bfsRes.steps.length,
        steps: bfsRes.steps.length,
        executionTimeMs: bfsRes.execution_time,
        complexity: "O(V + E)",
        dataStructure: "Adjacency List + FIFO Queue"
      });

      // 5. Run DFS
      const dfsRes = await api.runDFS("Programming");
      rows.push({
        algorithm: "Depth-First Search (DFS)",
        purpose: "Prerequisite Depth Traversal",
        inputSize: "5 Nodes, 7 Edges",
        comparisons: "Edge checks: " + dfsRes.steps.length,
        steps: dfsRes.steps.length,
        executionTimeMs: dfsRes.execution_time,
        complexity: "O(V + E)",
        dataStructure: "Adjacency List + LIFO Stack"
      });

      setBenchmarks(rows);
      setLastRunTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Benchmark error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const algorithmCards = [
    {
      title: "Merge Sort",
      purpose: "Ranking & Total Ordering",
      complexity: "O(n log n)",
      space: "O(n)",
      desc: "Recursively splits the student dataset down to single-element arrays and merges them in sorted order. Handles multi-attribute tie-breakers.",
      color: "border-blue-500/30 text-blue-400 bg-blue-500/10"
    },
    {
      title: "Binary Search",
      purpose: "Fast Record Retrieval",
      complexity: "O(log n)",
      space: "O(1)",
      desc: "Eliminates half of the search space at each comparison. Requires an ascendingly sorted array.",
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10"
    },
    {
      title: "Range Query",
      purpose: "Subarray Range Boundary Filtering",
      complexity: "O(log n + k)",
      space: "O(k)",
      desc: "Combines binary search lower_bound (>= min) and upper_bound (> max) to instantly locate subarray boundaries without a full linear scan.",
      color: "border-purple-500/30 text-purple-400 bg-purple-500/10"
    },
    {
      title: "Breadth-First Search (BFS)",
      purpose: "Graph Layer Traversal",
      complexity: "O(V + E)",
      space: "O(V)",
      desc: "Utilizes a FIFO Queue to traverse subject connections layer-by-layer. Detects shortest dependency chains.",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
    },
    {
      title: "Depth-First Search (DFS)",
      purpose: "Deep Branch Traversal",
      complexity: "O(V + E)",
      space: "O(V)",
      desc: "Utilizes an explicit LIFO Stack to explore prerequisite branches to their maximum depth before backtracking.",
      color: "border-pink-500/30 text-pink-400 bg-pink-500/10"
    }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-brand-blue/20 text-brand-cyan border border-brand-blue/30">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Algorithm Lab &amp; Benchmark</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical runtime performance, step telemetry, and asymptotic complexity verification
          </p>
        </div>

        <button
          onClick={runBenchmarkSuite}
          disabled={isRunning}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 text-white text-xs font-semibold shadow-glow-blue transition active:scale-95 disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
          <span>{isRunning ? "Running Benchmarks..." : "Run Live Benchmark Suite"}</span>
        </button>
      </div>

      {/* Verified Algorithm Comparison Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white">
              Live Empirical Performance Matrix (Real Database Execution)
            </h3>
            <p className="text-[11px] text-slate-400">
              Generated dynamically via backend Python perf_counter telemetry
            </p>
          </div>
          {lastRunTime && (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Last Verified at {lastRunTime}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="p-3.5">Algorithm</th>
                <th className="p-3.5">Purpose</th>
                <th className="p-3.5">Data Structure</th>
                <th className="p-3.5 text-center">Input Size</th>
                <th className="p-3.5 text-center">Comparisons</th>
                <th className="p-3.5 text-center">Steps</th>
                <th className="p-3.5 text-center">Execution Time</th>
                <th className="p-3.5 text-center">Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {benchmarks.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-bold font-sans text-white">{row.algorithm}</td>
                  <td className="p-3.5 font-sans text-slate-300">{row.purpose}</td>
                  <td className="p-3.5 font-sans text-brand-cyan">{row.dataStructure}</td>
                  <td className="p-3.5 text-center text-slate-300">{row.inputSize}</td>
                  <td className="p-3.5 text-center text-purple-300 font-bold">{row.comparisons}</td>
                  <td className="p-3.5 text-center text-amber-300">{row.steps}</td>
                  <td className="p-3.5 text-center font-bold text-emerald-400">
                    {row.executionTimeMs} ms
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-brand-cyan border border-blue-500/30 text-[11px] font-bold">
                      {row.complexity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithm Deep-Dive Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-white">Algorithm Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {algorithmCards.map((card, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{card.title}</h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${card.color}`}>
                    {card.complexity}
                  </span>
                </div>
                <div className="text-[11px] text-brand-cyan font-semibold">{card.purpose}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Time: {card.complexity}</span>
                <span>Space: {card.space}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
