import React from "react";
import { Sparkles, RefreshCw, Plus, Database } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  studentCount?: number;
  onRefresh?: () => void;
  onAddStudent?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  studentCount,
  onRefresh,
  onAddStudent,
  isRefreshing = false
}) => {
  return (
    <header className="px-8 py-5 border-b border-slate-800/80 bg-navy-900/60 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20">
      <div>
        <div className="flex items-center space-x-2.5">
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-brand-cyan border border-blue-500/20">
            <Sparkles className="w-3 h-3" />
            DAA Engine
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center space-x-3">
        {studentCount !== undefined && (
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-brand-blue" />
            <span>
              <strong className="text-white font-mono">{studentCount}</strong> Students
            </span>
          </div>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-cyan" : ""}`} />
          </button>
        )}

        {onAddStudent && (
          <button
            onClick={onAddStudent}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        )}
      </div>
    </header>
  );
};
