import React, { useState, useEffect } from "react";
import { Student, StudentInput } from "../types";
import { X, Save, AlertCircle } from "lucide-react";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentInput, studentId?: number) => Promise<void>;
  studentToEdit?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit
}) => {
  const [formData, setFormData] = useState<StudentInput>({
    roll_no: "",
    name: "",
    department: "Computer Science",
    mathematics: 75,
    physics: 75,
    programming: 80,
    data_structures: 78,
    algorithms: 76
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        roll_no: studentToEdit.roll_no,
        name: studentToEdit.name,
        department: studentToEdit.department,
        mathematics: studentToEdit.mathematics,
        physics: studentToEdit.physics,
        programming: studentToEdit.programming,
        data_structures: studentToEdit.data_structures,
        algorithms: studentToEdit.algorithms
      });
    } else {
      setFormData({
        roll_no: "",
        name: "",
        department: "Computer Science",
        mathematics: 75,
        physics: 75,
        programming: 80,
        data_structures: 78,
        algorithms: 76
      });
    }
    setError(null);
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.roll_no.trim() || !formData.name.trim()) {
      setError("Roll Number and Student Name are required.");
      return;
    }

    const marks = [
      formData.mathematics,
      formData.physics,
      formData.programming,
      formData.data_structures,
      formData.algorithms
    ];

    for (const m of marks) {
      if (isNaN(m) || m < 0 || m > 100) {
        setError("All subject marks must be numbers between 0 and 100.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSave(formData, studentToEdit?.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = [
    "Computer Science",
    "Information Technology",
    "Artificial Intelligence",
    "Data Science",
    "Software Engineering"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-2xl w-full max-w-lg border border-slate-700/80 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-navy-900/60">
          <h3 className="font-bold text-lg text-white">
            {studentToEdit ? "Edit Student Record" : "Add New Student"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Roll No *</label>
              <input
                type="text"
                required
                value={formData.roll_no}
                onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                placeholder="e.g. CS2024-099"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-blue"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Subject Marks (0 - 100) */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Subject Marks (0 – 100)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Mathematics</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  value={formData.mathematics}
                  onChange={(e) =>
                    setFormData({ ...formData, mathematics: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Physics</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  value={formData.physics}
                  onChange={(e) =>
                    setFormData({ ...formData, physics: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Programming</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  value={formData.programming}
                  onChange={(e) =>
                    setFormData({ ...formData, programming: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Data Structures</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  value={formData.data_structures}
                  onChange={(e) =>
                    setFormData({ ...formData, data_structures: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Algorithms</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  value={formData.algorithms}
                  onChange={(e) =>
                    setFormData({ ...formData, algorithms: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Saving..." : "Save Student"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
