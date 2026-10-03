import React from "react";
import { Info, CheckCircle2, ShieldCheck, Database, Cpu, GitMerge, Search, Share2, Layers } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-brand-cyan border border-blue-500/30">
          <Info className="w-3.5 h-3.5" />
          <span>DAA Hackathon Architecture Documentation</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Student Result Analyzer &amp; Algorithm Engine
        </h2>
        <p className="text-sm text-slate-300">
          A production-grade, algorithm-centric academic intelligence platform built with pure manual algorithmic implementations.
        </p>
      </div>

      {/* DAA Pipeline Flowchart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">
          End-to-End Algorithmic Architecture Pipeline
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs font-mono font-semibold">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-blue-400 w-full sm:w-auto">
            1. STUDENT DATA<br />
            <span className="text-[10px] text-slate-400">SQLite Table</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">→</span>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-purple-400 w-full sm:w-auto">
            2. MERGE SORT<br />
            <span className="text-[10px] text-slate-400">O(n log n)</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">→</span>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 w-full sm:w-auto">
            3. RANKING<br />
            <span className="text-[10px] text-slate-400">Tie Handling</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">→</span>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 w-full sm:w-auto">
            4. BINARY SEARCH<br />
            <span className="text-[10px] text-slate-400">O(log n)</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">→</span>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 w-full sm:w-auto">
            5. RANGE QUERY<br />
            <span className="text-[10px] text-slate-400">O(log n + k)</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">→</span>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-pink-400 w-full sm:w-auto">
            6. GRAPH &amp; BFS/DFS<br />
            <span className="text-[10px] text-slate-400">O(V + E)</span>
          </div>
        </div>
      </div>

      {/* Algorithmic Integrity & Compliance */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-emerald-950/20 space-y-4">
        <div className="flex items-center space-x-3 text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
          <h3 className="font-bold text-base text-white">Manual Algorithm Implementation Guarantee</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Built-in Sorting:</strong> Merge Sort is implemented manually in <code className="text-emerald-300">backend/algorithms/sorting.py</code> without <code className="text-rose-400">sorted()</code> or <code className="text-rose-400">.sort()</code>.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Pure Binary Search:</strong> Implemented without <code className="text-rose-400">in</code> or <code className="text-rose-400">.index()</code>. Tracks Low, Mid, High, and search window division.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Non-linear Range Retrieval:</strong> Range queries use binary search lower_bound and upper_bound in O(log n + k) instead of scanning the full dataset.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Dynamic Pearson Correlation:</strong> Edge weights are mathematically calculated from student score covariance across the 5 subjects.
            </span>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">
          System Technologies &amp; Architecture
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Frontend</span>
            <div className="text-sm font-bold text-white">React + TypeScript</div>
            <div className="text-[11px] text-slate-400">Vite 6 + Tailwind CSS</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Backend API</span>
            <div className="text-sm font-bold text-white">Python Flask</div>
            <div className="text-[11px] text-slate-400">Modular REST Blueprints</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Database</span>
            <div className="text-sm font-bold text-white">SQLite3</div>
            <div className="text-[11px] text-slate-400">Parameterized SQL</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Visualization</span>
            <div className="text-sm font-bold text-white">Recharts + SVG</div>
            <div className="text-[11px] text-slate-400">Lucide React Icons</div>
          </div>
        </div>
      </div>
    </div>
  );
};
