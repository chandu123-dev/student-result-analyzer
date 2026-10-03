import React, { useState, useEffect, useRef } from "react";
import {
  GraphNode,
  GraphEdge,
  GraphTraversalResponse,
  GraphTraversalStep
} from "../types";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  ListOrdered,
  Layers,
  Sparkles
} from "lucide-react";

interface NodePosition {
  x: number;
  y: number;
}

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  traversalResult?: GraphTraversalResponse | null;
  onRunTraversal: (type: "BFS" | "DFS", startNode: string) => void;
  isLoading?: boolean;
}

// Initial coordinates positioned in an aesthetic circular / pentagonal constellation
const DEFAULT_COORDS: Record<string, NodePosition> = {
  Mathematics: { x: 300, y: 80 },
  Physics: { x: 120, y: 190 },
  Algorithms: { x: 480, y: 190 },
  Programming: { x: 180, y: 360 },
  "Data Structures": { x: 420, y: 360 }
};

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  nodes,
  edges,
  traversalResult,
  onRunTraversal,
  isLoading = false
}) => {
  const [positions, setPositions] = useState<Record<string, NodePosition>>(DEFAULT_COORDS);
  const [selectedNode, setSelectedNode] = useState<string>("Programming");
  const [startSubject, setStartSubject] = useState<string>("Programming");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);

  // Zoom & Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Traversal Step Player
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1200); // ms

  const svgRef = useRef<SVGSVGElement | null>(null);

  const steps = traversalResult?.steps || [];
  const currentStep: GraphTraversalStep | undefined = steps[currentStepIndex];

  // Auto-play traversal
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && steps.length > 0) {
      if (currentStepIndex < steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, playbackSpeed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  // Reset step counter on new traversal
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [traversalResult]);

  // Dragging logic
  const handlePointerDown = (nodeId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingNode(nodeId);
    const pos = positions[nodeId] || { x: 250, y: 250 };
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingNode) {
      setPositions((prev) => ({
        ...prev,
        [draggingNode]: {
          x: Math.max(50, Math.min(550, e.clientX - dragOffset.x)),
          y: Math.max(50, Math.min(450, e.clientY - dragOffset.y))
        }
      }));
    }
  };

  const handlePointerUp = () => {
    setDraggingNode(null);
  };

  const resetGraphView = () => {
    setPositions(DEFAULT_COORDS);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Visited nodes up to current step
  const visitedSoFar = new Set<string>();
  const traversedEdgesSoFar = new Set<string>();

  if (traversalResult && steps.length > 0) {
    for (let i = 0; i <= currentStepIndex; i++) {
      const step = steps[i];
      if (step.visited) {
        step.visited.forEach((n) => visitedSoFar.add(n));
      }
      if (step.traversed_edge) {
        const key1 = `${step.traversed_edge.from}->${step.traversed_edge.to}`;
        const key2 = `${step.traversed_edge.to}->${step.traversed_edge.from}`;
        traversedEdgesSoFar.add(key1);
        traversedEdgesSoFar.add(key2);
      }
    }
  }

  const activeNode = currentStep ? currentStep.current_node : selectedNode;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Share2 className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">Subject Relationship Graph</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Edge weights computed dynamically via Pearson correlation · Interactive BFS & DFS
            traversals
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-slate-400 whitespace-nowrap">Start Node:</span>
            <select
              value={startSubject}
              onChange={(e) => setStartSubject(e.target.value)}
              className="bg-transparent text-brand-cyan font-semibold focus:outline-none"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id} className="bg-navy-900 text-white">
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onRunTraversal("BFS", startSubject)}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-blue transition active:scale-95 disabled:opacity-50"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Run BFS</span>
          </button>

          <button
            onClick={() => onRunTraversal("DFS", startSubject)}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-purple transition active:scale-95 disabled:opacity-50"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Run DFS</span>
          </button>

          <button
            onClick={resetGraphView}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Graph Canvas & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Graph Canvas (3 cols) */}
        <div
          className="lg:col-span-3 relative h-[480px] bg-navy-950/90 rounded-2xl border border-slate-800 overflow-hidden shadow-inner select-none cursor-grab active:cursor-grabbing"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col space-y-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/80 backdrop-blur-md">
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetGraphView}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Fit View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Diagram */}
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox="0 0 600 480"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: "center"
            }}
          >
            {/* Edges */}
            {edges.map((edge, idx) => {
              const p1 = positions[edge.source] || { x: 100, y: 100 };
              const p2 = positions[edge.target] || { x: 300, y: 300 };
              const edgeKey = `${edge.source}->${edge.target}`;
              const isTraversed = traversedEdgesSoFar.has(edgeKey);
              const isEdgeHovered =
                hoveredEdge &&
                ((hoveredEdge.source === edge.source && hoveredEdge.target === edge.target) ||
                  (hoveredEdge.source === edge.target && hoveredEdge.target === edge.source));

              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              return (
                <g key={idx}>
                  {/* Line */}
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={
                      isTraversed
                        ? "#10B981"
                        : isEdgeHovered
                        ? "#38BDF8"
                        : "rgba(100, 116, 139, 0.4)"
                    }
                    strokeWidth={isTraversed ? 3.5 : isEdgeHovered ? 2.5 : 1.5}
                    strokeDasharray={isTraversed ? "none" : undefined}
                    className="transition-colors duration-300"
                  />

                  {/* Edge Weight Pill */}
                  <g
                    transform={`translate(${midX}, ${midY})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredEdge(edge)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  >
                    <rect
                      x="-18"
                      y="-10"
                      width="36"
                      height="20"
                      rx="10"
                      fill={isTraversed ? "#064E3B" : "#0F172A"}
                      stroke={
                        isTraversed
                          ? "#10B981"
                          : isEdgeHovered
                          ? "#38BDF8"
                          : "rgba(100, 116, 139, 0.5)"
                      }
                      strokeWidth="1.2"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill={isTraversed ? "#34D399" : "#94A3B8"}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {edge.weight}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = positions[node.id] || { x: 250, y: 250 };
              const isVisited = visitedSoFar.has(node.id);
              const isActive = activeNode === node.id;
              const isStart = traversalResult?.start_node === node.id;
              const isSelected = selectedNode === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-move"
                  onPointerDown={(e) => handlePointerDown(node.id, e)}
                  onClick={() => setSelectedNode(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer pulse ring for active/visited */}
                  {isActive && (
                    <circle
                      r="40"
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-spin"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r="32"
                    fill={
                      isActive
                        ? "url(#activeGrad)"
                        : isVisited
                        ? "#065F46"
                        : isSelected
                        ? "#1E3A8A"
                        : "#1E293B"
                    }
                    stroke={
                      isActive
                        ? "#38BDF8"
                        : isVisited
                        ? "#34D399"
                        : isSelected
                        ? "#60A5FA"
                        : node.color
                    }
                    strokeWidth={isActive ? 3 : 2}
                    className="transition-all duration-300 filter drop-shadow-md"
                  />

                  {/* Node label */}
                  <text
                    textAnchor="middle"
                    dy="-3"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {node.name.length > 11 ? node.name.slice(0, 10) + "…" : node.name}
                  </text>

                  {/* Category badge */}
                  <text
                    textAnchor="middle"
                    dy="12"
                    fill={isVisited ? "#A7F3D0" : "#94A3B8"}
                    fontSize="7"
                    pointerEvents="none"
                    fontFamily="monospace"
                  >
                    {isStart ? "★ START" : isVisited ? "✓ VISITED" : node.category}
                  </text>
                </g>
              );
            })}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Canvas helper caption */}
          <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 font-mono flex items-center gap-3">
            <span>● Drag any node to reposition</span>
            <span>● Click edge pills to view correlation</span>
          </div>
        </div>

        {/* Traversal State Sidebar (1 col) */}
        <div className="space-y-4">
          {/* Active Traversal Status */}
          {traversalResult ? (
            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                  {traversalResult.algorithm} Traversal Active
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                  {traversalResult.complexity}
                </span>
              </div>

              {/* Step counter */}
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Current Step:</span>
                <span className="font-mono text-white font-bold">
                  {currentStepIndex + 1} / {steps.length}
                </span>
              </div>

              {/* Current Decision Box */}
              {currentStep && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                    Step Action:
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{currentStep.decision}</p>
                </div>
              )}

              {/* Data Structure Live State: Queue or Stack */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {traversalResult.algorithm === "BFS" ? "FIFO Queue State" : "LIFO Stack State"}:
                </span>
                <div className="p-2.5 rounded-xl bg-navy-950 border border-slate-800 min-h-[44px] flex items-center gap-1.5 overflow-x-auto">
                  {(traversalResult.algorithm === "BFS"
                    ? currentStep?.queue || []
                    : currentStep?.stack || []
                  ).length === 0 ? (
                    <span className="text-[11px] text-slate-500 italic">Empty</span>
                  ) : (
                    (traversalResult.algorithm === "BFS"
                      ? currentStep?.queue || []
                      : currentStep?.stack || []
                    ).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold whitespace-nowrap"
                      >
                        {item}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Visit Order Sequence */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Visited Order ({visitedSoFar.size}/{nodes.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(visitedSoFar).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold"
                    >
                      {idx + 1}. {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Playback Controls */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>{currentStepIndex >= steps.length - 1 ? "Replay" : "Play"}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    currentStepIndex < steps.length - 1 && setCurrentStepIndex((p) => p + 1)
                  }
                  disabled={currentStepIndex >= steps.length - 1}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs disabled:opacity-40"
                >
                  <span>Next</span>
                  <SkipForward className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            /* Node Inspector when no traversal is running */
            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Selected Subject
              </span>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80">
                <div className="text-base font-bold text-brand-cyan">{selectedNode}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Category:{" "}
                  <span className="text-slate-200">
                    {nodes.find((n) => n.id === selectedNode)?.category || "Subject"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Connected Subjects &amp; Correlation:
              </div>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {edges
                  .filter((e) => e.source === selectedNode || e.target === selectedNode)
                  .map((e, idx) => {
                    const other = e.source === selectedNode ? e.target : e.source;
                    return (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-navy-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-200">{other}</span>
                        <span className="font-mono font-bold text-emerald-400">{e.weight}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Pearson Formula Card */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block">Correlation Formula:</span>
            <p className="font-mono text-[10px] text-indigo-300 break-all">
              r = Cov(X,Y) / (σX · σY)
            </p>
            <p className="text-[10px] text-slate-500">
              Edge weights measure the academic score correlation across subjects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
