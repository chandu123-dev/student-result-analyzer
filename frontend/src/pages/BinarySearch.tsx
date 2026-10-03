import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { BinarySearchResponse } from "../types";
import { AlgorithmStats } from "../components/AlgorithmStats";
import { SearchVisualizer } from "../components/SearchVisualizer";
import { Search, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

export const BinarySearchPage: React.FC = () => {
  const [targetInput, setTargetInput] = useState<string>("87.0");
  const [searchKey, setSearchKey] = useState<string>("percentage");
  const [searchResult, setSearchResult] = useState<BinarySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial search execution
    executeSearch("87.0", "percentage");
  }, []);

  const executeSearch = async (val: string, key: string) => {
    if (!val.trim()) return;
    try {
      setIsLoading(true);
      setError(null);
      const parsedVal = key === "percentage" ? parseFloat(val) : val.trim();
      const res = await api.binarySearch(parsedVal, key);
      setSearchResult(res);
    } catch (err: any) {
      setError(err.message || "Binary search execution failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(targetInput, searchKey);
  };

  const presetValues = [
    { label: "87.0% (Found)", value: "87.0", key: "percentage" },
    { label: "72.0% (Mid-range)", value: "72.0", key: "percentage" },
    { label: "96.0% (Top End)", value: "96.0", key: "percentage" },
    { label: "45.0% (First Element)", value: "45.0", key: "percentage" },
    { label: "99.5% (Not Found)", value: "99.5", key: "percentage" }
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & Concept Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-brand-cyan border border-blue-500/30">
              <Search className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Binary Search Algorithm Visualizer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logarithmic O(log n) search on pre-sorted student results array
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-xl text-blue-300 text-xs">
          <Sparkles className="w-4 h-4 text-brand-cyan" />
          <span>Requirement: Pre-sorted dataset (Ascending)</span>
        </div>
      </div>

      {/* Search Input Bar & Presets */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-44">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Search Attribute
            </label>
            <select
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="roll_no">Roll Number</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Target Value {searchKey === "percentage" ? "(e.g. 87.0 or 75.0)" : "(e.g. CS2024-001)"}
            </label>
            <input
              type="text"
              required
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder={searchKey === "percentage" ? "Enter target percentage..." : "Enter roll number..."}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="self-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Execute Binary Search"}
            </button>
          </div>
        </form>

        {/* Quick Test Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
          {presetValues.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTargetInput(p.value);
                setSearchKey(p.key);
                executeSearch(p.value, p.key);
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
      {searchResult && (
        <AlgorithmStats
          algorithm="Binary Search"
          complexity={searchResult.complexity}
          executionTimeMs={searchResult.execution_time_ms}
          comparisons={searchResult.comparisons}
          inputSize={searchResult.input_size}
          stepsCount={searchResult.steps.length}
          extraStats={[
            {
              label: "Status",
              value: searchResult.found ? "FOUND" : "NOT FOUND",
              color: searchResult.found ? "text-emerald-400" : "text-rose-400"
            },
            {
              label: "Index",
              value: searchResult.found ? `Index [${searchResult.index}]` : "N/A",
              color: searchResult.found ? "text-blue-300" : "text-slate-400"
            }
          ]}
        />
      )}

      {/* Search Visualizer Array Component */}
      {searchResult && (
        <SearchVisualizer
          sortedArray={searchResult.sorted_array}
          target={searchResult.target}
          found={searchResult.found}
          foundIndex={searchResult.index}
          foundStudent={searchResult.student}
          steps={searchResult.steps}
          comparisons={searchResult.comparisons}
          executionTimeMs={searchResult.execution_time_ms}
          onSelectTarget={(val) => {
            setTargetInput(String(val));
            executeSearch(String(val), searchKey);
          }}
        />
      )}

      {/* Step-by-Step Decision Audit Table */}
      {searchResult && searchResult.steps.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="font-bold text-sm text-white">Execution Trace &amp; Audit Trail</h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Steps: {searchResult.steps.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="p-3 text-center">Step</th>
                  <th className="p-3 text-center">Low</th>
                  <th className="p-3 text-center">Mid</th>
                  <th className="p-3 text-center">High</th>
                  <th className="p-3 text-center">Mid Value</th>
                  <th className="p-3">Comparison Condition</th>
                  <th className="p-3">Algorithmic Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {searchResult.steps.map((st) => (
                  <tr key={st.step} className="hover:bg-slate-800/40">
                    <td className="p-3 text-center font-bold text-brand-cyan">{st.step}</td>
                    <td className="p-3 text-center text-emerald-400">{st.low}</td>
                    <td className="p-3 text-center text-purple-400 font-bold">
                      {st.mid >= 0 ? st.mid : "N/A"}
                    </td>
                    <td className="p-3 text-center text-pink-400">{st.high}</td>
                    <td className="p-3 text-center text-white">{st.mid_value ?? "—"}</td>
                    <td className="p-3 text-slate-300 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700 text-xs">
                        {st.comparison}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-slate-200">{st.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
