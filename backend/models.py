from typing import List, Dict, Any, Optional
import sqlite3
from database import get_db_connection, compute_student_metrics, row_to_dict

class StudentModel:
    @staticmethod
    def get_all() -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students ORDER BY id ASC")
        rows = cursor.fetchall()
        conn.close()
        return [row_to_dict(row) for row in rows]

    @staticmethod
    def get_by_id(student_id: int) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        row = cursor.fetchone()
        conn.close()
        return row_to_dict(row) if row else None

    @staticmethod
    def get_by_roll_no(roll_no: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students WHERE roll_no = ?", (roll_no.strip(),))
        row = cursor.fetchone()
        conn.close()
        return row_to_dict(row) if row else None

    @staticmethod
    def create(data: Dict[str, Any]) -> Dict[str, Any]:
        math = float(data.get("mathematics", 0))
        physics = float(data.get("physics", 0))
        prog = float(data.get("programming", 0))
        ds = float(data.get("data_structures", 0))
        algo = float(data.get("algorithms", 0))
        
        total, percentage, grade = compute_student_metrics(math, physics, prog, ds, algo)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO students (
                roll_no, name, department, mathematics, physics,
                programming, data_structures, algorithms, total, percentage, grade
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(data["roll_no"]).strip(),
            str(data["name"]).strip(),
            str(data["department"]).strip(),
            math, physics, prog, ds, algo,
            total, percentage, grade
        ))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        
        student = StudentModel.get_by_id(new_id)
        if student is None:
            raise RuntimeError("Failed to retrieve created student")
        return student

    @staticmethod
    def update(student_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        existing = StudentModel.get_by_id(student_id)
        if not existing:
            return None
            
        roll_no = str(data.get("roll_no", existing["roll_no"])).strip()
        name = str(data.get("name", existing["name"])).strip()
        dept = str(data.get("department", existing["department"])).strip()
        math = float(data.get("mathematics", existing["mathematics"]))
        physics = float(data.get("physics", existing["physics"]))
        prog = float(data.get("programming", existing["programming"]))
        ds = float(data.get("data_structures", existing["data_structures"]))
        algo = float(data.get("algorithms", existing["algorithms"]))
        
        total, percentage, grade = compute_student_metrics(math, physics, prog, ds, algo)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE students SET
                roll_no = ?, name = ?, department = ?, mathematics = ?,
                physics = ?, programming = ?, data_structures = ?, algorithms = ?,
                total = ?, percentage = ?, grade = ?
            WHERE id = ?
        """, (
            roll_no, name, dept, math, physics,
            prog, ds, algo, total, percentage, grade, student_id
        ))
        conn.commit()
        conn.close()
        return StudentModel.get_by_id(student_id)

    @staticmethod
    def delete(student_id: int) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
        rows_affected = cursor.rowcount
        conn.commit()
        conn.close()
        return rows_affected > 0

    @staticmethod
    def count() -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM students")
        count = cursor.fetchone()[0]
        conn.close()
        return count
