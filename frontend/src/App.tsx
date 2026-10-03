import React, { useState, useEffect } from "react";
import { Sidebar, PageId } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { Students } from "./pages/Students";
import { Rankings } from "./pages/Rankings";
import { BinarySearchPage } from "./pages/BinarySearch";
import { RangeQueryPage } from "./pages/RangeQuery";
import { SubjectGraphPage } from "./pages/SubjectGraph";
import { AlgorithmLabPage } from "./pages/AlgorithmLab";
import { AboutPage } from "./pages/About";
import { StudentModal } from "./components/StudentModal";
import { api } from "./api/api";
import { StudentInput } from "./types";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  const [studentCount, setStudentCount] = useState<number>(24);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchCount();
  }, [refreshKey]);

  const fetchCount = async () => {
    try {
      const res = await api.getStudents();
      setStudentCount(res.count);
    } catch (err) {
      console.error("Count fetch failed:", err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCount();
    setRefreshKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCreateStudent = async (data: StudentInput) => {
    await api.createStudent(data);
    await fetchCount();
    setRefreshKey((k) => k + 1);
  };

  const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Academic Intelligence Dashboard",
      subtitle: "Comprehensive cohort telemetry, grade distributions, and performance averages"
    },
    students: {
      title: "Student Records & CRUD Operations",
      subtitle: "Manage enrolled students, update mark profiles, and inspect detailed analysis"
    },
    rankings: {
      title: "Merge Sort Academic Rankings",
      subtitle: "O(n log n) divide-and-conquer ranking with step comparison logs and tie resolution"
    },
    binary_search: {
      title: "Binary Search Visualizer",
      subtitle: "Interactive O(log n) search space reduction with Low, Mid, High pointers"
    },
    range_query: {
      title: "Range Query Analyzer",
      subtitle: "O(log n + k) percentage band filtering using binary search lower and upper bounds"
    },
    subject_graph: {
      title: "Subject Relationship Graph & Traversals",
      subtitle: "Adjacency-list graph weighted by Pearson correlation, featuring live BFS & DFS"
    },
    algorithm_lab: {
      title: "Algorithm Lab & Benchmark Suite",
      subtitle: "Live runtime empirical benchmarking and theoretical complexity matrix"
    },
    about: {
      title: "System Architecture & DAA Principles",
      subtitle: "Design overview, manual implementation guarantees, and technology stack"
    }
  };

  const meta = pageMeta[currentPage];

  return (
    <div className="flex min-h-screen bg-navy-950 text-slate-100 font-sans selection:bg-brand-blue selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        studentCount={studentCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          studentCount={studentCount}
          onRefresh={handleRefresh}
          onAddStudent={() => setIsAddModalOpen(true)}
          isRefreshing={isRefreshing}
        />

        {/* Page Container */}
        <main className="flex-1 pb-12">
          {currentPage === "dashboard" && <Dashboard key={refreshKey} onNavigate={setCurrentPage} />}
          {currentPage === "students" && <Students key={refreshKey} />}
          {currentPage === "rankings" && <Rankings key={refreshKey} />}
          {currentPage === "binary_search" && <BinarySearchPage key={refreshKey} />}
          {currentPage === "range_query" && <RangeQueryPage key={refreshKey} />}
          {currentPage === "subject_graph" && <SubjectGraphPage key={refreshKey} />}
          {currentPage === "algorithm_lab" && <AlgorithmLabPage key={refreshKey} />}
          {currentPage === "about" && <AboutPage />}
        </main>
      </div>

      {/* Global Add Student Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateStudent}
      />
    </div>
  );
}
