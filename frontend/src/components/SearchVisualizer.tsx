import React, { useState, useEffect } from "react";
import { BinarySearchStep, SortedArrayItem, Student } from "../types";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  CheckCircle,
  XCircle,
  ArrowDown,
  Search,
  Sparkles
} from "lucide-react";

interface SearchVisualizerProps {
  sortedArray: SortedArrayItem[];
  target: number | string;
  found: boolean;
  foundIndex: number;
  foundStudent: Student | null;
  steps: BinarySearchStep[];
  comparisons: number;
  executionTimeMs: number;
  onSelectTarget?: (val: number | string) => void;
}

export const SearchVisualizer: React.FC<SearchVisualizerProps> = ({
  sortedArray,
  target,
  found,
  foundIndex,
  foundStudent,
  steps,
  comparisons,
  executionTimeMs,
  onSelectTarget
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      if (currentStepIndex < totalSteps - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, playbackSpeed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed]);

  // Reset step index if target changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [target, steps]);

  const handleStart = () => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const low = currentStep ? currentStep.low : 0;
  const mid = currentStep ? currentStep.mid : -1;
  const high = currentStep ? currentStep.high : sortedArray.length - 1;

  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFoundOnThisStep = isLastStep && found;
  const isExhausted = isLastStep && !found;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 shadow-2xl">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-brand-cyan border border-blue-500/30">
              <Search className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">Binary Search Visualizer</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Array boxes representation · Active elimination of half the search space at each step
          </p>
        </div>

        {/* Step telemetry */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-slate-400">Step: </span>
            <strong className="text-brand-cyan font-mono text-sm">
              {totalSteps > 0 ? currentStepIndex + 1 : 0}
            </strong>
            <span className="text-slate-500 font-mono"> / {totalSteps}</span>
          </div>

          <div className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-slate-400">Comparisons: </span>
            <strong className="text-purple-300 font-mono text-sm">
              {currentStepIndex + 1 <= comparisons ? currentStepIndex + 1 : comparisons}
            </strong>
          </div>
        </div>
      </div>

      {/* Target & Decision Highlight Banner */}
      <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-700/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Target Search Value
          </span>
          <div className="text-2xl font-black font-mono text-brand-cyan mt-0.5">
            {target}
            {typeof target === "number" && "%"}
          </div>
        </div>

        {/* Comparison & Decision */}
        <div className="md:col-span-2 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Algorithm Decision:
            </span>
            {currentStep?.comparison && (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs border border-purple-500/30">
                {currentStep.comparison}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {currentStep?.decision || "Initializing search space..."}
          </p>
        </div>
      </div>

      {/* Pointer Indicators (Low, Mid, High) */}
      <div className="flex items-center justify-center gap-6 text-xs font-mono font-bold py-1 bg-slate-900/40 rounded-xl border border-slate-800/80">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-emerald animate-pulse"></span>
          LOW = {low}
        </span>
        <span className="flex items-center gap-1.5 text-brand-purple">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-purple shadow-glow-purple animate-pulse"></span>
          MID = {mid >= 0 ? mid : "N/A"}
        </span>
        <span className="flex items-center gap-1.5 text-pink-400">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-glow-pink animate-pulse"></span>
          HIGH = {high}
        </span>
      </div>

      {/* Interactive Sorted Array Box Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Sorted Array Elements (Click any box to set as target)</span>
          <span className="text-[11px] font-mono text-slate-500">
            Array Length = {sortedArray.length}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto p-4 bg-navy-950 rounded-2xl border border-slate-800 shadow-inner">
          {sortedArray.map((item, idx) => {
            const isMid = idx === mid;
            const isLow = idx === low;
            const isHigh = idx === high;
            const isEliminated = idx < low || idx > high;
            const isFinalFound = isFoundOnThisStep && idx === foundIndex;

            return (
              <div
                key={item.id || idx}
                onClick={() => onSelectTarget && onSelectTarget(item.value)}
                className={`relative flex flex-col items-center justify-center min-w-[58px] h-20 rounded-xl cursor-pointer border transition-all duration-300 select-none ${
                  isFinalFound
                    ? "bg-gradient-to-b from-emerald-600 to-emerald-900 border-emerald-400 text-white shadow-lg ring-4 ring-emerald-400/40 scale-105"
                    : isMid
                    ? "bg-gradient-to-b from-purple-600 to-purple-900 border-purple-400 text-white shadow-glow-purple ring-2 ring-purple-400 scale-105"
                    : isEliminated
                    ? "bg-slate-900/40 border-slate-800 text-slate-600 opacity-30 hover:opacity-75"
                    : "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-700"
                }`}
              >
                {/* Pointer Badges on top */}
                <div className="absolute -top-3.5 flex items-center gap-0.5">
                  {isLow && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500 text-navy-950">
                      L
                    </span>
                  )}
                  {isMid && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-400 text-navy-950 animate-bounce">
                      M
                    </span>
                  )}
                  {isHigh && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-pink-500 text-navy-950">
                      H
                    </span>
                  )}
                </div>

                {/* Score value */}
                <span className="text-sm font-black font-mono tracking-tight">{item.value}</span>

                {/* Index badge at bottom */}
                <span className="text-[10px] font-mono opacity-70 mt-1">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Status Box */}
      {isLastStep && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            found
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="flex items-center space-x-3">
            {found ? (
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                {found
                  ? `RESULT: FOUND at Index ${foundIndex}`
                  : "RESULT: NOT FOUND in Dataset"}
              </div>
              {found && foundStudent && (
                <div className="text-xs text-slate-300 mt-0.5">
                  Student: <strong>{foundStudent.name}</strong> ({foundStudent.roll_no}) ·
                  Percentage: <strong>{foundStudent.percentage}%</strong> · Grade:{" "}
                  <strong>{foundStudent.grade}</strong>
                </div>
              )}
              {!found && (
                <div className="text-xs text-slate-400 mt-0.5">
                  Search window collapsed (Low &gt; High). Element does not exist in sorted array.
                </div>
              )}
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <div>Comparisons: {comparisons}</div>
            <div>Time: {executionTimeMs} ms</div>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition"
            title="Previous Step"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {!isPlaying ? (
            <button
              onClick={handleStart}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{currentStepIndex >= totalSteps - 1 ? "Replay" : "Auto Play"}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 disabled:opacity-40 transition"
          >
            <span>Next Step</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span>Speed:</span>
          <input
            type="range"
            min="300"
            max="2000"
            step="100"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="w-24 accent-brand-blue cursor-pointer"
          />
          <span className="font-mono text-slate-300 text-[11px] w-14">
            {(1000 / playbackSpeed).toFixed(1)}x
          </span>
        </div>
      </div>
    </div>
  );
};
