import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { StatisticsResponse } from "../types";
import { StatCard } from "../components/StatCard";
import {
  Users,
  Award,
  TrendingUp,
  Percent,
  CheckCircle2,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
  Legend
} from "recharts";

interface DashboardProps {
  onNavigate: (page: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getStatistics();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load statistics.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-800 rounded-2xl"></div>
          <div className="h-72 bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 max-w-md mx-auto">
          {error || "Unable to retrieve dashboard analytics."}
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs hover:bg-slate-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Format Subject Averages for Chart
  const subjectChartData = Object.entries(stats.subject_averages).map(([name, avg]) => ({
    subject: name,
    average: avg
  }));

  const subjectColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899"];

  // Format Grade Distribution
  const gradeChartData = Object.entries(stats.grade_distribution).map(([grade, count]) => ({
    grade,
    count
  }));

  const gradeColors: Record<string, string> = {
    "A+": "#10B981",
    A: "#3B82F6",
    B: "#06B6D4",
    C: "#F59E0B",
    D: "#F97316",
    F: "#F43F5E"
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hackathon Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-7 bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-purple-950/70 border border-blue-500/20 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-brand-cyan border border-blue-500/30 shadow-glow-blue">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DAA Algorithmic Result Analyzer · Active Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Real-time Academic Analytics &amp; Algorithms
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Equipped with manual Divide-and-Conquer Merge Sort, O(log n) Binary Search with
              range boundaries, and Pearson-correlation Subject Relationship Graph Traversals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("rankings")}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-xs font-bold shadow-glow-blue hover:scale-105 transition"
            >
              <span>View Rankings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate("subject_graph")}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <span>Explore Graph</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value={stats.total_students}
          subtitle="Enrolled cohort"
          icon={Users}
          color="blue"
          badge="Size N"
        />
        <StatCard
          title="Avg Percentage"
          value={`${stats.average_percentage}%`}
          subtitle="Cohort mean"
          icon={Percent}
          color="cyan"
          badge="Mean"
        />
        <StatCard
          title="Highest Score"
          value={`${stats.highest_percentage}%`}
          subtitle="Rank #1 Peak"
          icon={TrendingUp}
          color="emerald"
          badge="Max"
        />
        <StatCard
          title="Lowest Score"
          value={`${stats.lowest_percentage}%`}
          subtitle="Cohort floor"
          icon={TrendingUp}
          color="amber"
          badge="Min"
        />
        <StatCard
          title="Pass Rate"
          value={`${stats.pass_rate}%`}
          subtitle=">= 50% score"
          icon={CheckCircle2}
          color="purple"
          badge="Pass"
        />
        <StatCard
          title="A+ Achievers"
          value={stats.a_plus_students}
          subtitle=">= 90% score"
          icon={Award}
          color="pink"
          badge="Honors"
        />
      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Distribution (Score Bands) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-blue-500/20 text-brand-cyan">
                <BarChart2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-white">Student Performance Distribution</h3>
                <p className="text-[11px] text-slate-400">Score percentage brackets across dataset</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              Total N: {stats.total_students}
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.score_bands} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                  {stats.score_bands.map((_, index) => (
                    <Cell
                      key={`band-${index}`}
                      fill={index === 0 ? "#10B981" : index === 5 ? "#F43F5E" : "#3B82F6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <PieIcon className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-white">Grade Breakdown</h3>
                <p className="text-[11px] text-slate-400">Standard grading distribution</p>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gradeChartData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="grade" type="category" stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {gradeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={gradeColors[entry.grade] || "#3B82F6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject Averages Bar Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <BarChart2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-white">Subject Averages (Out of 100)</h3>
              <p className="text-[11px] text-slate-400">
                Performance across curriculum foundation and CS core
              </p>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={subjectChartData}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
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
              <Bar dataKey="average" radius={[6, 6, 0, 0]}>
                {subjectChartData.map((_, index) => (
                  <Cell key={`subj-${index}`} fill={subjectColors[index % subjectColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
