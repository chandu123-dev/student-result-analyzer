import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { RankingsResponse, Student } from "../types";
import { AlgorithmStats } from "../components/AlgorithmStats";
import { SortingVisualizer } from "../components/SortingVisualizer";
import { StudentTable } from "../components/StudentTable";
import { StudentDetailModal } from "../components/StudentDetailModal";
import {
  Trophy,
  GitMerge,
  Sliders,
  ChevronDown,
  Layers,
  ArrowUpDown
} from "lucide-react";

export const Rankings: React.FC = () => {
  const [rankingsData, setRankingsData] = useState<RankingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("percentage");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [showVisualizer, setShowVisualizer] = useState(true);

  // Selected student for detail
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadRankings();
  }, [sortKey, sortOrder]);

  const loadRankings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getRankings(sortKey, sortOrder);
      setRankingsData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load rankings.");
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* Title & Sorting Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Academic Leaderboard &amp; Rankings
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generated using manual Divide-and-Conquer Merge Sort with competition tie handling
          </p>
        </div>

        {/* Dynamic Criteria Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-slate-400">Sort By:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="bg-transparent text-brand-cyan font-semibold focus:outline-none cursor-pointer"
            >
              <option value="percentage" className="bg-navy-900 text-white">
                Percentage
              </option>
              <option value="total" className="bg-navy-900 text-white">
                Total Marks
              </option>
              <option value="algorithms" className="bg-navy-900 text-white">
                Algorithms
              </option>
              <option value="data_structures" className="bg-navy-900 text-white">
                Data Structures
              </option>
              <option value="programming" className="bg-navy-900 text-white">
                Programming
              </option>
              <option value="mathematics" className="bg-navy-900 text-white">
                Mathematics
              </option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{sortOrder === "desc" ? "Highest First (Desc)" : "Lowest First (Asc)"}</span>
          </button>

          <button
            onClick={() => setShowVisualizer(!showVisualizer)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              showVisualizer
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>{showVisualizer ? "Hide Visualizer" : "Show Visualizer"}</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Algorithm Telemetry Stats Banner */}
      {rankingsData && (
        <AlgorithmStats
          algorithm="Merge Sort (Divide-and-Conquer)"
          complexity={rankingsData.complexity}
          executionTimeMs={rankingsData.execution_time_ms}
          comparisons={rankingsData.comparisons}
          mergesCount={rankingsData.merges}
          inputSize={rankingsData.input_size}
          stepsCount={rankingsData.steps.length}
        />
      )}

      {/* Sorting Visualizer Component */}
      {showVisualizer && rankingsData && rankingsData.steps.length > 0 && (
        <SortingVisualizer
          steps={rankingsData.steps}
          comparisonsCount={rankingsData.comparisons}
          mergesCount={rankingsData.merges}
          executionTimeMs={rankingsData.execution_time_ms}
          students={rankingsData.rankings}
        />
      )}

      {/* Leaderboard Table */}
      {isLoading ? (
        <div className="glass-card rounded-2xl p-8 space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      ) : rankingsData ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300">
              Ranked Students (Ties handled according to academic guidelines)
            </span>
            <span className="font-mono">Total Ranked: {rankingsData.rankings.length}</span>
          </div>

          <StudentTable
            students={rankingsData.rankings}
            showRank={true}
            onViewStudent={handleViewStudent}
            onEditStudent={() => {}}
            onDeleteStudent={() => {}}
          />
        </div>
      ) : null}

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        data={selectedStudentDetail}
      />
    </div>
  );
};
