from database import init_db, compute_student_metrics, get_db_connection
from models import StudentModel

SAMPLE_STUDENTS = [
    {
        "roll_no": "CS2024-001",
        "name": "Aarav Sharma",
        "department": "Computer Science",
        "mathematics": 96.0,
        "physics": 92.0,
        "programming": 98.0,
        "data_structures": 95.0,
        "algorithms": 97.0
    },
    {
        "roll_no": "CS2024-002",
        "name": "Diya Patel",
        "department": "Computer Science",
        "mathematics": 94.0,
        "physics": 90.0,
        "programming": 96.0,
        "data_structures": 93.0,
        "algorithms": 94.0
    },
    {
        "roll_no": "AI2024-010",
        "name": "Rohan Verma",
        "department": "Artificial Intelligence",
        "mathematics": 92.0,
        "physics": 88.0,
        "programming": 95.0,
        "data_structures": 91.0,
        "algorithms": 93.0
    },
    {
        "roll_no": "IT2024-025",
        "name": "Ananya Iyer",
        "department": "Information Technology",
        "mathematics": 89.0,
        "physics": 86.0,
        "programming": 92.0,
        "data_structures": 90.0,
        "algorithms": 91.0
    },
    {
        "roll_no": "CS2024-015",
        "name": "Vikram Malhotra",
        "department": "Computer Science",
        "mathematics": 88.0,
        "physics": 85.0,
        "programming": 89.0,
        "data_structures": 88.0,
        "algorithms": 87.0
    },
    {
        "roll_no": "DS2024-004",
        "name": "Sneha Kulkarni",
        "department": "Data Science",
        "mathematics": 90.0,
        "physics": 82.0,
        "programming": 88.0,
        "data_structures": 86.0,
        "algorithms": 88.0
    },
    {
        "roll_no": "AI2024-018",
        "name": "Kabir Mehta",
        "department": "Artificial Intelligence",
        "mathematics": 85.0,
        "physics": 80.0,
        "programming": 86.0,
        "data_structures": 84.0,
        "algorithms": 85.0
    },
    {
        "roll_no": "IT2024-012",
        "name": "Pooja Hegde",
        "department": "Information Technology",
        "mathematics": 82.0,
        "physics": 79.0,
        "programming": 85.0,
        "data_structures": 82.0,
        "algorithms": 83.0
    },
    {
        "roll_no": "CS2024-032",
        "name": "Aditya Rao",
        "department": "Computer Science",
        "mathematics": 80.0,
        "physics": 78.0,
        "programming": 82.0,
        "data_structures": 81.0,
        "algorithms": 80.0
    },
    {
        "roll_no": "DS2024-019",
        "name": "Meera Nambiar",
        "department": "Data Science",
        "mathematics": 84.0,
        "physics": 76.0,
        "programming": 80.0,
        "data_structures": 78.0,
        "algorithms": 79.0
    },
    {
        "roll_no": "CS2024-045",
        "name": "Arjun Sen",
        "department": "Computer Science",
        "mathematics": 78.0,
        "physics": 75.0,
        "programming": 79.0,
        "data_structures": 77.0,
        "algorithms": 76.0
    },
    {
        "roll_no": "AI2024-022",
        "name": "Kavya Menon",
        "department": "Artificial Intelligence",
        "mathematics": 75.0,
        "physics": 74.0,
        "programming": 78.0,
        "data_structures": 76.0,
        "algorithms": 75.0
    },
    {
        "roll_no": "IT2024-038",
        "name": "Siddharth Joshi",
        "department": "Information Technology",
        "mathematics": 76.0,
        "physics": 72.0,
        "programming": 75.0,
        "data_structures": 74.0,
        "algorithms": 73.0
    },
    {
        "roll_no": "CS2024-055",
        "name": "Riya Singhania",
        "department": "Computer Science",
        "mathematics": 72.0,
        "physics": 70.0,
        "programming": 76.0,
        "data_structures": 72.0,
        "algorithms": 71.0
    },
    {
        "roll_no": "DS2024-031",
        "name": "Karan Kapoor",
        "department": "Data Science",
        "mathematics": 70.0,
        "physics": 68.0,
        "programming": 72.0,
        "data_structures": 70.0,
        "algorithms": 69.0
    },
    {
        "roll_no": "IT2024-049",
        "name": "Tanvi Deshmukh",
        "department": "Information Technology",
        "mathematics": 68.0,
        "physics": 65.0,
        "programming": 70.0,
        "data_structures": 67.0,
        "algorithms": 66.0
    },
    {
        "roll_no": "CS2024-061",
        "name": "Nikhil Chopra",
        "department": "Computer Science",
        "mathematics": 65.0,
        "physics": 63.0,
        "programming": 68.0,
        "data_structures": 64.0,
        "algorithms": 62.0
    },
    {
        "roll_no": "AI2024-035",
        "name": "Ishaan Roy",
        "department": "Artificial Intelligence",
        "mathematics": 62.0,
        "physics": 60.0,
        "programming": 64.0,
        "data_structures": 61.0,
        "algorithms": 60.0
    },
    {
        "roll_no": "IT2024-058",
        "name": "Tara Pillai",
        "department": "Information Technology",
        "mathematics": 58.0,
        "physics": 56.0,
        "programming": 60.0,
        "data_structures": 58.0,
        "algorithms": 57.0
    },
    {
        "roll_no": "CS2024-072",
        "name": "Harshvardhan Varma",
        "department": "Computer Science",
        "mathematics": 55.0,
        "physics": 52.0,
        "programming": 57.0,
        "data_structures": 54.0,
        "algorithms": 53.0
    },
    {
        "roll_no": "DS2024-044",
        "name": "Zoya Akhtar",
        "department": "Data Science",
        "mathematics": 52.0,
        "physics": 50.0,
        "programming": 54.0,
        "data_structures": 51.0,
        "algorithms": 50.0
    },
    {
        "roll_no": "AI2024-049",
        "name": "Pranav Bansal",
        "department": "Artificial Intelligence",
        "mathematics": 48.0,
        "physics": 46.0,
        "programming": 49.0,
        "data_structures": 45.0,
        "algorithms": 47.0
    },
    {
        "roll_no": "IT2024-067",
        "name": "Sanya Mirza",
        "department": "Information Technology",
        "mathematics": 45.0,
        "physics": 42.0,
        "programming": 48.0,
        "data_structures": 44.0,
        "algorithms": 43.0
    },
    {
        "roll_no": "CS2024-080",
        "name": "Rahul Dravid",
        "department": "Computer Science",
        "mathematics": 42.0,
        "physics": 40.0,
        "programming": 45.0,
        "data_structures": 41.0,
        "algorithms": 40.0
    }
]

def seed_database(force: bool = False) -> int:
    """Seeds the database with sample students if empty or forced."""
    init_db()
    existing_count = StudentModel.count()
    if existing_count > 0 and not force:
        print(f"Database already contains {existing_count} students. Skipping seed.")
        return existing_count

    if force and existing_count > 0:
        conn = get_db_connection()
        conn.execute("DELETE FROM students")
        conn.commit()
        conn.close()

    inserted = 0
    for student in SAMPLE_STUDENTS:
        try:
            StudentModel.create(student)
            inserted += 1
        except Exception as e:
            print(f"Error inserting {student['name']}: {e}")

    print(f"Seeded {inserted} sample students into database.")
    return inserted

if __name__ == "__main__":
    seed_database(force=True)
