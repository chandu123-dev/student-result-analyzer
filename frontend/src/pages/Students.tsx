import React, { useState, useEffect } from "react";
import { Student, StudentInput, StudentDetailResponse } from "../types";
import { api } from "../api/api";
import { StudentTable } from "../components/StudentTable";
import { StudentModal } from "../components/StudentModal";
import { StudentDetailModal } from "../components/StudentDetailModal";
import { Users, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] =
    useState<StudentDetailResponse | null>(null);

  // Delete confirmation
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getStudents();
      setStudents(res.students);
    } catch (err: any) {
      setError(err.message || "Failed to load students.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStudent = async (data: StudentInput, studentId?: number) => {
    if (studentId) {
      const res = await api.updateStudent(studentId, data);
      showToast(`Student '${res.student.name}' updated successfully.`);
    } else {
      const res = await api.createStudent(data);
      showToast(`Student '${res.student.name}' created successfully.`);
    }
    await loadStudents();
  };

  const handleViewStudent = async (student: Student) => {
    try {
      const detail = await api.getStudentById(student.id);
      setSelectedStudentDetail(detail);
      setIsDetailOpen(true);
    } catch (err: any) {
      showToast(err.message || "Failed to load student details", "error");
    }
  };

  const handleEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (student: Student) => {
    setStudentToDelete(student);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await api.deleteStudent(studentToDelete.id);
      showToast(`Student '${studentToDelete.name}' deleted successfully.`);
      setStudentToDelete(null);
      await loadStudents();
    } catch (err: any) {
      showToast(err.message || "Failed to delete student", "error");
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md animate-slide-up ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/90 border-rose-500/40 text-rose-300"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-brand-cyan">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Student Directory</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete database records with subject scores and calculated grades
          </p>
        </div>

        <button
          onClick={() => {
            setStudentToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="glass-card rounded-2xl p-8 space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <StudentTable
          students={students}
          onViewStudent={handleViewStudent}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeletePrompt}
        />
      )}

      {/* Create / Edit Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      {/* Performance Detail Modal */}
      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        data={selectedStudentDetail}
      />

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl w-full max-w-sm border border-slate-700 p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Confirm Student Deletion</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete{" "}
              <strong className="text-white">{studentToDelete.name}</strong> (
              {studentToDelete.roll_no})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
