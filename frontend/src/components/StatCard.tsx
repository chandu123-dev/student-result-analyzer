import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "purple" | "cyan" | "emerald" | "amber" | "pink";
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  badge
}) => {
  const colorStyles = {
    blue: {
      border: "border-blue-500/20",
      bg: "from-blue-600/20 to-blue-900/10",
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      glow: "hover:shadow-glow-blue"
    },
    purple: {
      border: "border-purple-500/20",
      bg: "from-purple-600/20 to-purple-900/10",
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      glow: "hover:shadow-glow-purple"
    },
    cyan: {
      border: "border-cyan-500/20",
      bg: "from-cyan-600/20 to-cyan-900/10",
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      glow: "hover:shadow-cyan-500/20"
    },
    emerald: {
      border: "border-emerald-500/20",
      bg: "from-emerald-600/20 to-emerald-900/10",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      glow: "hover:shadow-emerald-500/20"
    },
    amber: {
      border: "border-amber-500/20",
      bg: "from-amber-600/20 to-amber-900/10",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      glow: "hover:shadow-amber-500/20"
    },
    pink: {
      border: "border-pink-500/20",
      bg: "from-pink-600/20 to-pink-900/10",
      iconBg: "bg-pink-500/10 text-pink-400 border-pink-500/30",
      glow: "hover:shadow-pink-500/20"
    }
  };

  const style = colorStyles[color];

  return (
    <div
      className={`glass-card glass-card-hover rounded-2xl p-5 border ${style.border} bg-gradient-to-br ${style.bg} relative overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="text-2xl font-black text-white mt-1.5 tracking-tight font-mono">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-xl border ${style.iconBg} shadow-sm shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {badge && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-medium">Metric Insight</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};
