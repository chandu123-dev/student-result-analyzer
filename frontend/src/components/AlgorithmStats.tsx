import React from "react";
import { Activity, Clock, Cpu, CheckCircle2, GitCommit, Layers } from "lucide-react";

interface AlgorithmStatsProps {
  algorithm: string;
  complexity: string;
  executionTimeMs?: number;
  comparisons?: number;
  stepsCount?: number;
  inputSize?: number;
  mergesCount?: number;
  extraStats?: Array<{ label: string; value: string | number; color?: string }>;
}

export const AlgorithmStats: React.FC<AlgorithmStatsProps> = ({
  algorithm,
  complexity,
  executionTimeMs = 0,
  comparisons,
  stepsCount,
  inputSize,
  mergesCount,
  extraStats = []
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-gradient-to-r from-navy-900/90 via-navy-850/80 to-navy-900/90 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-cyan shadow-glow-blue">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">{algorithm}</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-brand-cyan border border-blue-500/30">
                {complexity}
              </span>
            </div>
            <p className="text-xs text-slate-400">Algorithmic Execution Metrics & Telemetry</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Execution Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
        {inputSize !== undefined && (
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-400" />
              Input Size (N)
            </span>
            <div className="text-lg font-bold font-mono text-white mt-1">{inputSize}</div>
          </div>
        )}

        {comparisons !== undefined && (
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" />
              Comparisons
            </span>
            <div className="text-lg font-bold font-mono text-purple-300 mt-1">{comparisons}</div>
          </div>
        )}

        {stepsCount !== undefined && (
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <GitCommit className="w-3 h-3 text-amber-400" />
              Steps Recorded
            </span>
            <div className="text-lg font-bold font-mono text-amber-300 mt-1">{stepsCount}</div>
          </div>
        )}

        {mergesCount !== undefined && (
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <GitCommit className="w-3 h-3 text-pink-400" />
              Merges
            </span>
            <div className="text-lg font-bold font-mono text-pink-300 mt-1">{mergesCount}</div>
          </div>
        )}

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            Execution Time
          </span>
          <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
            {executionTimeMs} <span className="text-xs text-slate-400">ms</span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Complexity
          </span>
          <div className="text-lg font-bold font-mono text-emerald-300 mt-1">{complexity}</div>
        </div>

        {extraStats.map((item, idx) => (
          <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {item.label}
            </span>
            <div className={`text-lg font-bold font-mono mt-1 ${item.color || "text-white"}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
