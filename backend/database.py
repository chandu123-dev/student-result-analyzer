import sqlite3
import os
from typing import Dict, Any, Tuple

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "student_results.db")

def get_db_connection() -> sqlite3.Connection:
    """Creates a database connection with dict-like row access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def compute_student_metrics(
    math: float, 
    physics: float, 
    prog: float, 
    ds: float, 
    algo: float
) -> Tuple[float, float, str]:
    """
    Computes total marks, percentage and grade according to specification:
    Total = math + physics + programming + data_structures + algorithms (out of 500)
    Percentage = (total / 500) * 100
    Grade:
      90-100  -> A+
      80-89.99 -> A
      70-79.99 -> B
      60-69.99 -> C
      50-59.99 -> D
      0-49.99  -> F
    """
    total = round(float(math + physics + prog + ds + algo), 2)
    percentage = round((total / 500.0) * 100.0, 2)
    
    if percentage >= 90.0:
        grade = "A+"
    elif percentage >= 80.0:
        grade = "A"
    elif percentage >= 70.0:
        grade = "B"
    elif percentage >= 60.0:
        grade = "C"
    elif percentage >= 50.0:
        grade = "D"
    else:
        grade = "F"
        
    return total, percentage, grade

def init_db() -> None:
    """Initializes the database schema if tables do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_no TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        mathematics REAL NOT NULL CHECK(mathematics >= 0 AND mathematics <= 100),
        physics REAL NOT NULL CHECK(physics >= 0 AND physics <= 100),
        programming REAL NOT NULL CHECK(programming >= 0 AND programming <= 100),
        data_structures REAL NOT NULL CHECK(data_structures >= 0 AND data_structures <= 100),
        algorithms REAL NOT NULL CHECK(algorithms >= 0 AND algorithms <= 100),
        total REAL NOT NULL,
        percentage REAL NOT NULL,
        grade TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    conn.commit()
    conn.close()

def row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    """Converts a sqlite3.Row to a standard Python dictionary."""
    return dict(row)
