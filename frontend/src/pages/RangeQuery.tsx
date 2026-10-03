import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { RangeQueryResponse, Student } from "../types";
import { AlgorithmStats } from "../components/AlgorithmStats";
import { StudentTable } from "../components/StudentTable";
import { StudentDetailModal } from "../components/StudentDetailModal";
import {
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle,
  Layers
} from "lucide-react";

export const RangeQueryPage: React.FC = () => {
  const [minPct, setMinPct] = useState<number>(70);
  const [maxPct, setMaxPct] = useState<number>(90);
  const [rangeData, setRangeData] = useState<RangeQueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student Detail Modal
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    executeRangeQuery(70, 90);
  }, []);

  const executeRangeQuery = async (minVal: number, maxVal: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.rangeQuery(minVal, maxVal);
      setRangeData(res);
    } catch (err: any) {
      setError(err.message || "Failed to execute range query.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeRangeQuery(minPct, maxPct);
  };

  const presetRanges = [
    { label: "70% – 90% (First Class)", min: 70, max: 90 },
    { label: "80% – 100% (Distinction)", min: 80, max: 100 },
    { label: "90% – 100% (A+ Achievers)", min: 90, max: 100 },
    { label: "50% – 70% (Pass / Average)", min: 50, max: 70 },
    { label: "0% – 49.9% (Below Pass)", min: 0, max: 49.9 }
  ];

  const handleViewStudent = async (student: Student) => {
    try {
      const detail = await api.getStudentById(student.id);
      setSelectedStudentDetail(detail);
      setIsDetailOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Range Query Analyzer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dual Binary Search lower-bound &amp; upper-bound boundaries with O(log n + k) extraction
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl text-purple-300 text-xs">
          <Sparkles className="w-4 h-4 text-brand-purple" />
          <span>Non-linear scan: O(log n + k)</span>
        </div>
      </div>

      {/* Range Filter Controls & Presets */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-1/3">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Minimum Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              required
              value={minPct}
              onChange={(e) => setMinPct(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Maximum Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              required
              value={maxPct}
              onChange={(e) => setMaxPct(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="w-full sm:w-auto">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Querying..." : "Execute Range Query"}
            </button>
          </div>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
          {presetRanges.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMinPct(p.min);
                setMaxPct(p.max);
                executeRangeQuery(p.min, p.max);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 font-mono transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Algorithm Telemetry Banner */}
      {rangeData && (
        <AlgorithmStats
          algorithm="Binary Search Range Boundary Query"
          complexity={rangeData.complexity}
          executionTimeMs={rangeData.execution_time_ms}
          comparisons={rangeData.comparisons}
          inputSize={rangeData.input_size}
          stepsCount={rangeData.steps.length}
          extraStats={[
            {
              label: "Range Boundaries",
              value:
                rangeData.left_boundary !== -1
                  ? `[${rangeData.left_boundary} .. ${rangeData.right_boundary}]`
                  : "None",
              color: "text-brand-cyan"
            },
            {
              label: "Matching (k)",
              value: `${rangeData.students_found} Students`,
              color: "text-emerald-400"
            }
          ]}
        />
      )}

      {/* Range Highlighted Array Visualization */}
      {rangeData && rangeData.sorted_array && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white">
                Pre-Sorted Array Range Boundary Spotlight
              </h3>
              <p className="text-[11px] text-slate-400">
                Left Boundary: [{rangeData.left_boundary}] · Right Boundary: [
                {rangeData.right_boundary}]
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow-emerald"></span>
                In Range ({rangeData.students_found})
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                Out of Range
              </span>
            </div>
          </div>

          {/* Array Boxes Stream */}
          <div className="flex items-center gap-2 overflow-x-auto p-4 bg-navy-950 rounded-2xl border border-slate-800 shadow-inner">
            {rangeData.sorted_array.map((item, idx) => {
              const isLeftBoundary = idx === rangeData.left_boundary;
              const isRightBoundary = idx === rangeData.right_boundary;
              const isInRange = item.in_range;

              return (
                <div
                  key={item.id || idx}
                  className={`relative flex flex-col items-center justify-center min-w-[58px] h-20 rounded-xl border transition-all duration-300 select-none ${
                    isInRange
                      ? "bg-gradient-to-b from-emerald-600/30 to-emerald-950/60 border-emerald-500/60 text-emerald-200 shadow-glow-emerald scale-100"
                      : "bg-slate-900/40 border-slate-800 text-slate-600 opacity-40"
                  }`}
                >
                  {/* Boundary markers */}
                  <div className="absolute -top-3.5 flex items-center gap-1">
                    {isLeftBoundary && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-500 text-navy-950">
                        LEFT
                      </span>
                    )}
                    {isRightBoundary && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-500 text-white">
                        RIGHT
                      </span>
                    )}
                  </div>

                  {/* Percentage */}
                  <span className="text-sm font-black font-mono tracking-tight">
                    {item.percentage}%
                  </span>

                  {/* Index */}
                  <span className="text-[10px] font-mono opacity-70 mt-1">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Matching Students Result Table */}
      {rangeData && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300">
              Students within Range {rangeData.min_percentage}% – {rangeData.max_percentage}%
            </span>
            <span className="font-mono text-emerald-400">
              Found {rangeData.students_found} students (k = {rangeData.students_found})
            </span>
          </div>

          <StudentTable
            students={rangeData.students}
            onViewStudent={handleViewStudent}
            onEditStudent={() => {}}
            onDeleteStudent={() => {}}
          />
        </div>
      )}

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        data={selectedStudentDetail}
      />
    </div>
  );
};
