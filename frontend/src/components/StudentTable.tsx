import React, { useState } from "react";
import { Student } from "../types";
import { Eye, Edit3, Trash2, ArrowUpDown, Search, Award } from "lucide-react";

interface StudentTableProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  showRank?: boolean;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  showRank = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const departments = Array.from(new Set(students.map((s) => s.department)));

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll_no.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "all" || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "A":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "B":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "C":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "D":
        return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      default:
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    }
  };

  const getRankBadge = (rank?: number) => {
    if (!rank) return null;
    if (rank === 1) {
      return (
        <span className="flex items-center gap-1 font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full text-xs">
          <Award className="w-3.5 h-3.5 text-amber-400" /> Rank #1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center gap-1 font-mono font-bold text-slate-200 bg-slate-400/20 border border-slate-400/40 px-2 py-0.5 rounded-full text-xs">
          Rank #2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center gap-1 font-mono font-bold text-amber-500 bg-amber-700/20 border border-amber-700/40 px-2 py-0.5 rounded-full text-xs">
          Rank #3
        </span>
      );
    }
    return (
      <span className="font-mono text-slate-400 text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs text-slate-400 whitespace-nowrap">Department:</label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table container */}
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold tracking-wider uppercase">
                {showRank && <th className="p-3.5 text-center">Rank</th>}
                <th className="p-3.5">Roll No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5 text-center">Math</th>
                <th className="p-3.5 text-center">Phys</th>
                <th className="p-3.5 text-center">Prog</th>
                <th className="p-3.5 text-center">DS</th>
                <th className="p-3.5 text-center">Algo</th>
                <th className="p-3.5 text-center font-bold text-slate-200">Total</th>
                <th className="p-3.5 text-center font-bold text-slate-200">Percentage</th>
                <th className="p-3.5 text-center">Grade</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={showRank ? 13 : 12} className="p-8 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-800/40 transition-colors duration-150 group"
                  >
                    {showRank && (
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {getRankBadge(s.rank)}
                      </td>
                    )}
                    <td className="p-3.5 font-mono text-brand-cyan font-semibold whitespace-nowrap">
                      {s.roll_no}
                    </td>
                    <td className="p-3.5 font-medium text-white whitespace-nowrap">{s.name}</td>
                    <td className="p-3.5 text-slate-300 whitespace-nowrap">{s.department}</td>
                    <td className="p-3.5 text-center font-mono text-slate-300">{s.mathematics}</td>
                    <td className="p-3.5 text-center font-mono text-slate-300">{s.physics}</td>
                    <td className="p-3.5 text-center font-mono text-slate-300">{s.programming}</td>
                    <td className="p-3.5 text-center font-mono text-slate-300">{s.data_structures}</td>
                    <td className="p-3.5 text-center font-mono text-slate-300">{s.algorithms}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-indigo-300">
                      {s.total} <span className="text-[10px] text-slate-400">/ 500</span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-white">
                      {s.percentage}%
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs border ${getGradeBadge(
                          s.grade
                        )}`}
                      >
                        {s.grade}
                      </span>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onViewStudent(s)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition"
                          title="View Analysis"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditStudent(s)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition"
                          title="Edit Student"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(s)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
