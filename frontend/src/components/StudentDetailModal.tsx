import React from "react";
import { StudentDetailResponse } from "../types";
import { X, Award, TrendingUp, TrendingDown, BookOpen, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from "recharts";

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StudentDetailResponse | null;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;

  const { student, analysis } = data;

  const chartData = [
    { subject: "Math", marks: student.mathematics, color: "#3B82F6" },
    { subject: "Physics", marks: student.physics, color: "#8B5CF6" },
    { subject: "Prog", marks: student.programming, color: "#10B981" },
    { subject: "DS", marks: student.data_structures, color: "#F59E0B" },
    { subject: "Algo", marks: student.algorithms, color: "#EC4899" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-2xl w-full max-w-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-navy-900/60">
          <div>
            <span className="text-[11px] font-mono text-brand-cyan tracking-wider uppercase font-semibold">
              Performance Analysis & Telemetry
            </span>
            <h3 className="font-extrabold text-xl text-white mt-0.5">{student.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Top Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Roll Number</span>
              <div className="text-sm font-bold font-mono text-brand-cyan mt-1">
                {student.roll_no}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Class Rank</span>
              <div className="text-sm font-bold font-mono text-amber-300 mt-1 flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span>
                  #{analysis.rank} <span className="text-[10px] text-slate-500">/ {analysis.total_students}</span>
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Percentage</span>
              <div className="text-sm font-bold font-mono text-white mt-1">
                {student.percentage}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Grade</span>
              <div className="text-sm font-bold font-mono text-emerald-300 mt-1">
                {student.grade}
              </div>
            </div>
          </div>

          {/* Strongest & Weakest Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  Strongest Subject
                </span>
                <div className="text-xs font-semibold text-white mt-0.5">
                  {analysis.strongest_subject.subject} ({analysis.strongest_subject.marks})
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400">
                  Weakest Subject
                </span>
                <div className="text-xs font-semibold text-white mt-0.5">
                  {analysis.weakest_subject.subject} ({analysis.weakest_subject.marks})
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400">
                  Average Subject Score
                </span>
                <div className="text-xs font-semibold text-white mt-0.5">
                  {analysis.average_marks} / 100
                </div>
              </div>
            </div>
          </div>

          {/* Subject Scores Bar Chart */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Subject Score Profile
            </span>
            <div className="h-56 p-4 bg-navy-950/80 rounded-2xl border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="marks" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-navy-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
