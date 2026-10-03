import React from "react";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Search,
  SlidersHorizontal,
  Share2,
  Cpu,
  Info,
  GraduationCap
} from "lucide-react";

export type PageId =
  | "dashboard"
  | "students"
  | "rankings"
  | "binary_search"
  | "range_query"
  | "subject_graph"
  | "algorithm_lab"
  | "about";

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  studentCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  studentCount = 24
}) => {
  const navItems = [
    {
      id: "dashboard" as PageId,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "students" as PageId,
      label: "Students",
      icon: Users,
      badge: studentCount > 0 ? `${studentCount}` : undefined
    },
    {
      id: "rankings" as PageId,
      label: "Rankings",
      icon: Trophy,
      badge: "Merge Sort"
    },
    {
      id: "binary_search" as PageId,
      label: "Binary Search",
      icon: Search,
      badge: "O(log n)"
    },
    {
      id: "range_query" as PageId,
      label: "Range Query",
      icon: SlidersHorizontal,
      badge: "O(log n + k)"
    },
    {
      id: "subject_graph" as PageId,
      label: "Subject Graph",
      icon: Share2,
      badge: "BFS / DFS"
    },
    {
      id: "algorithm_lab" as PageId,
      label: "Algorithm Lab",
      icon: Cpu,
      badge: "Benchmark"
    },
    {
      id: "about" as PageId,
      label: "About & DAA",
      icon: Info,
      badge: null
    }
  ];

  return (
    <aside className="w-64 min-h-screen bg-navy-900/90 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between shrink-0 shadow-2xl z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-pink flex items-center justify-center shadow-glow-blue">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Result Analyzer
              </h1>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                DAA Algorithmic Engine
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 text-blue-300 border border-blue-500/30 shadow-glow-blue"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-brand-cyan" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold tracking-tight ${
                      isActive
                        ? "bg-brand-blue/30 text-blue-200 border border-blue-400/40"
                        : "bg-slate-800 text-slate-400 group-hover:bg-slate-700/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800/60 m-3 rounded-2xl bg-navy-950/60 border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400 font-medium">Backend Engine</span>
          <span className="flex items-center text-emerald-400 space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
          <p>DB: SQLite3</p>
          <p>Algos: MergeSort · Binary · BFS/DFS</p>
        </div>
      </div>
    </aside>
  );
};
