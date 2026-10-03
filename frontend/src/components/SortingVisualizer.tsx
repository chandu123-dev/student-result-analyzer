import React, { useState, useEffect } from "react";
import { SortingStep, Student } from "../types";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Split,
  GitMerge,
  ArrowRight,
  Layers,
  Sparkles
} from "lucide-react";

interface SortingVisualizerProps {
  steps: SortingStep[];
  comparisonsCount: number;
  mergesCount: number;
  executionTimeMs: number;
  students: Student[];
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  steps,
  comparisonsCount,
  mergesCount,
  executionTimeMs,
  students
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(800); // ms

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

  // Preview elements from students array
  const displayItems = students.slice(0, 16);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 shadow-2xl">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <GitMerge className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">Merge Sort Dynamic Visualizer</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Divide-and-conquer execution step telemetry · Highlighting comparison & merge decisions
          </p>
        </div>

        {/* Step telemetry badge */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-slate-400">Step: </span>
            <strong className="text-brand-cyan font-mono text-sm">
              {totalSteps > 0 ? currentStepIndex + 1 : 0}
            </strong>
            <span className="text-slate-500 font-mono"> / {totalSteps}</span>
          </div>

          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-slate-400">Comparisons: </span>
            <strong className="text-purple-300 font-mono text-sm">{comparisonsCount}</strong>
          </div>
        </div>
      </div>

      {/* DAA Divide & Conquer Architecture Pipeline Diagram */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-[11px] font-semibold text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center gap-1.5 text-blue-300">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>1. Original Array</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center gap-1.5 text-indigo-300">
          <Split className="w-3.5 h-3.5 text-indigo-400" />
          <span>2. Divide (Mid)</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center gap-1.5 text-purple-300">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>3. Left & Right</span>
        </div>
        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center gap-1.5 text-purple-200 shadow-glow-purple">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>4. Compare</span>
        </div>
        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center gap-1.5 text-emerald-200">
          <GitMerge className="w-3.5 h-3.5 text-emerald-300" />
          <span>5. Merged Array</span>
        </div>
      </div>

      {/* Comparison Spotlight Box */}
      {currentStep ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-purple-950/30 to-navy-900 border border-purple-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs text-purple-300 font-semibold uppercase tracking-wider">
            <span>Current Comparison Action</span>
            <span className="font-mono">Step #{currentStep.step}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center">
            {/* Left element */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/40">
              <span className="text-[11px] text-blue-400 font-semibold block uppercase">
                Left Pointer
              </span>
              <div className="text-xl font-black font-mono text-white mt-1">
                {currentStep.left}%
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate">{currentStep.left_student}</p>
            </div>

            {/* Operator & Comparison */}
            <div className="space-y-1">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-xs font-mono font-bold text-purple-300">
                {currentStep.comparison}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{currentStep.decision}</p>
            </div>

            {/* Right element */}
            <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/40">
              <span className="text-[11px] text-pink-400 font-semibold block uppercase">
                Right Pointer
              </span>
              <div className="text-xl font-black font-mono text-white mt-1">
                {currentStep.right}%
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate">{currentStep.right_student}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-slate-400 text-xs bg-slate-900/50 rounded-xl border border-slate-800">
          No comparison steps available.
        </div>
      )}

      {/* Array Bars Representation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Active Array Visualization (Percentages)</span>
          <span className="text-[11px] font-mono text-slate-500">
            Highlighted: Active Subarrays
          </span>
        </div>

        <div className="flex items-end justify-center gap-1 sm:gap-2 h-36 p-4 bg-navy-950/80 rounded-2xl border border-slate-800 overflow-x-auto">
          {displayItems.map((item, idx) => {
            const isLeftBeingCompared = currentStep && currentStep.left === item.percentage;
            const isRightBeingCompared = currentStep && currentStep.right === item.percentage;
            const heightPercent = Math.max(15, Math.min(100, item.percentage));

            return (
              <div
                key={item.id || idx}
                className="flex flex-col items-center gap-1 group relative transition-all duration-300"
                style={{ width: `${100 / displayItems.length}%`, minWidth: "32px" }}
              >
                {/* Score label tooltip */}
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-white transition">
                  {item.percentage}%
                </span>

                {/* Bar */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isLeftBeingCompared
                      ? "bg-gradient-to-t from-blue-600 to-cyan-400 ring-2 ring-cyan-400 shadow-glow-blue animate-pulse"
                      : isRightBeingCompared
                      ? "bg-gradient-to-t from-pink-600 to-purple-400 ring-2 ring-pink-400 shadow-glow-purple animate-pulse"
                      : "bg-slate-700/60 group-hover:bg-slate-600"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Name / Index */}
                <span className="text-[9px] text-slate-400 truncate max-w-[40px] block">
                  {item.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
        <div className="flex items-center space-x-2">
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
            min="200"
            max="1500"
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
