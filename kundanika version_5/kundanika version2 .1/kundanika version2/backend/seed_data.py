import asyncio
import os
import uuid
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

# Load environment variables
from pathlib import Path
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def seed_database():
    print("Starting database seed...")
    
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    
    if not mongo_url or not db_name:
        print("Error: MONGO_URL and DB_NAME must be set in .env")
        return

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    # --- Seed Users ---
    users_to_add = [
        {
            "id": str(uuid.uuid4()),
            "email": "placement1@kundanika.edu",
            "name": "Arun Kumar",
            "role": "placement_staff",
            "password_hash": hash_password("password123"),
            "department": "Placement Cell",
            "phone": "9876543210",
            "organization": "Kundanika",
            "profile_completed": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "placement2@kundanika.edu",
            "name": "Sarah Jenkins",
            "role": "placement_staff",
            "password_hash": hash_password("password123"),
            "department": "Placement Cell",
            "phone": "9876543211",
            "organization": "Kundanika",
            "profile_completed": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "employer1@google.com",
            "name": "Sundar Pichai",
            "role": "employer",
            "password_hash": hash_password("password123"),
            "department": None,
            "phone": "1234567890",
            "organization": "Google",
            "profile_completed": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "employer2@microsoft.com",
            "name": "Satya Nadella",
            "role": "employer",
            "password_hash": hash_password("password123"),
            "department": None,
            "phone": "0987654321",
            "organization": "Microsoft",
            "profile_completed": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "8d7668e5-3c33-4b1a-be75-94a3a31f308b",
            "email": "student@example.com",
            "name": "Test Student",
            "role": "student",
            "password_hash": hash_password("password123"),
            "university": "Kundanika University",
            "major": "Computer Science",
            "graduation_year": 2025,
            "cgpa": 9.5,
            "profile_completed": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "adithyaksharaprasad@gmail.com",
            "name": "Adithya K S",
            "role": "student",
            "password_hash": hash_password("password123"),
            "university": "Kundanika University",
            "major": "Computer Science",
            "graduation_year": 2024,
            "cgpa": 9.8,
            "profile_completed": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]

    for user in users_to_add:
        # Use update_one with upsert=True to ensure we overwrite existing users with fresh data
        await db.users.update_one(
            {"email": user["email"]},
            {"$set": user},
            upsert=True
        )
        print(f"Seeded user: {user['email']}")
            
    # Get an employer ID to use for internships
    emp1 = await db.users.find_one({"email": "employer1@google.com"})
    emp2 = await db.users.find_one({"email": "employer2@microsoft.com"})
    
    emp1_id = emp1["id"] if emp1 else str(uuid.uuid4())
    emp2_id = emp2["id"] if emp2 else str(uuid.uuid4())

    # --- Seed Internships ---
    internships_to_add = [
        {
            "title": "Software Engineering Intern",
            "description": "Join our core engineering team to build scalable systems. You will work on distributed databases and backend microservices.",
            "company": "Google",
            "skills_required": ["Python", "Go", "Distributed Systems", "SQL"],
            "department": "Computer Science",
            "stipend": 50000.0,
            "duration_months": 6,
            "location": "Bangalore / Remote",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
            "is_verified": True,
            "posted_by": emp1_id,
            "posted_by_role": "employer"
        },
        {
            "title": "Frontend Developer Intern",
            "description": "Help us build the next generation of web applications using React and Next.js.",
            "company": "Microsoft",
            "skills_required": ["React", "JavaScript", "TypeScript", "TailwindCSS"],
            "department": "Information Technology",
            "stipend": 45000.0,
            "duration_months": 3,
            "location": "Hyderabad",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=15)).isoformat(),
            "is_verified": True,
            "posted_by": emp2_id,
            "posted_by_role": "employer"
        },
        {
            "title": "Data Science Intern",
            "description": "Analyze large datasets to extract meaningful business insights.",
            "company": "Amazon",
            "skills_required": ["Python", "Machine Learning", "Pandas", "SQL"],
            "department": "Data Science",
            "stipend": 55000.0,
            "duration_months": 6,
            "location": "Remote",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=20)).isoformat(),
            "is_verified": True,
            "posted_by": emp1_id,
            "posted_by_role": "employer"
        },
        {
            "title": "UI/UX Design Intern",
            "description": "Design intuitive user interfaces for our upcoming mobile and web products.",
            "company": "Apple",
            "skills_required": ["Figma", "Sketch", "Prototyping", "User Research"],
            "department": "Design",
            "stipend": 40000.0,
            "duration_months": 4,
            "location": "Bangalore",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=25)).isoformat(),
            "is_verified": True,
            "posted_by": emp2_id,
            "posted_by_role": "employer"
        },
        {
            "title": "Marketing & Strategy Intern",
            "description": "Assist with digital marketing campaigns, SEO optimization, and social media strategy.",
            "company": "Netflix",
            "skills_required": ["SEO", "Content Marketing", "Social Media", "Analytics"],
            "department": "Marketing",
            "stipend": 30000.0,
            "duration_months": 3,
            "location": "Mumbai",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=10)).isoformat(),
            "is_verified": True,
            "posted_by": emp1_id,
            "posted_by_role": "employer"
        },
         {
            "title": "Cloud Computing Intern",
            "description": "Work on AWS infrastructure setup, CI/CD pipelines, and containerization using Docker.",
            "company": "Amazon Web Services",
            "skills_required": ["AWS", "Linux", "Docker", "DevOps"],
            "department": "Computer Science",
            "stipend": 48000.0,
            "duration_months": 6,
            "location": "Remote",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=45)).isoformat(),
            "is_verified": True,
            "posted_by": emp1_id,
            "posted_by_role": "employer"
        },
        {
            "title": "Financial Analyst Intern",
            "description": "Conduct financial modeling, market research, and support the investment team.",
            "company": "Goldman Sachs",
            "skills_required": ["Excel", "Financial Modeling", "Accounting", "Data Analysis"],
            "department": "Finance",
            "stipend": 60000.0,
            "duration_months": 3,
            "location": "Bangalore",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=35)).isoformat(),
            "is_verified": True,
            "posted_by": emp2_id,
            "posted_by_role": "employer"
        },
        {
            "title": "AI/ML Research Intern",
            "description": "Research and implement novel deep learning architectures for natural language processing.",
            "company": "OpenAI",
            "skills_required": ["Python", "PyTorch", "NLP", "Deep Learning"],
            "department": "Computer Science",
            "stipend": 75000.0,
            "duration_months": 6,
            "location": "Remote",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat(),
            "is_verified": True,
            "posted_by": emp1_id,
            "posted_by_role": "employer"
        },
        {
            "title": "Cybersecurity Intern",
            "description": "Perform vulnerability assessments and assist in monitoring security infrastructure.",
            "company": "Palo Alto Networks",
            "skills_required": ["Network Security", "Linux", "Ethical Hacking", "Python"],
            "department": "Information Technology",
            "stipend": 42000.0,
            "duration_months": 4,
            "location": "Pune",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=40)).isoformat(),
            "is_verified": True,
            "posted_by": emp2_id,
            "posted_by_role": "employer"
        },
        {
            "title": "Mechanical Engineering Intern",
            "description": "Assist in the design and testing of automotive parts using CAD software.",
            "company": "Tesla",
            "skills_required": ["AutoCAD", "SolidWorks", "Thermodynamics", "Design"],
            "department": "Mechanical Engineering",
            "stipend": 35000.0,
            "duration_months": 6,
            "location": "Chennai",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=60)).isoformat(),
            "is_verified": True,
            "posted_by": emp1_id,
            "posted_by_role": "employer"
        },
        {
            "title": "Product Management Intern",
            "description": "Collaborate with engineering and design to define product requirements and roadmaps.",
            "company": "Atlassian",
            "skills_required": ["Jira", "Agile", "Communication", "Data Analysis"],
            "department": "Management",
            "stipend": 50000.0,
            "duration_months": 3,
            "location": "Bangalore",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=12)).isoformat(),
            "is_verified": True,
            "posted_by": emp2_id,
            "posted_by_role": "employer"
        },
        {
            "title": "Robotics Process Automation Intern",
            "description": "Develop automation scripts for routine business processes using UiPath.",
            "company": "UiPath",
            "skills_required": ["Python", "RPA", "UiPath", "Process Optimization"],
            "department": "Computer Science",
            "stipend": 38000.0,
            "duration_months": 4,
            "location": "Remote",
            "application_deadline": (datetime.now(timezone.utc) + timedelta(days=28)).isoformat(),
            "is_verified": True,
            "posted_by": emp1_id,
            "posted_by_role": "employer"
        }
    ]

    for intern in internships_to_add:
        existing = await db.internships.find_one({"title": intern["title"], "company": intern["company"]})
        if not existing:
            intern_doc = {**intern, "id": str(uuid.uuid4()), "created_at": datetime.now(timezone.utc).isoformat(), "applicant_count": 0}
            await db.internships.insert_one(intern_doc)
            print(f"Added internship: {intern['title']} at {intern['company']}")
        else:
            print(f"Internship {intern['title']} at {intern['company']} already exists")

    # --- Seed Notifications for specific student ---
    student_id = "8d7668e5-3c33-4b1a-be75-94a3a31f308b"
    
    notifications_to_add = [
        {"message": "Welcome to Kundanika InternPro! Complete your profile to get started.", "type": "system"},
        {"message": "A new Software Engineering internship at Google matches your skills.", "type": "match"},
        {"message": "Microsoft has posted a frontend developer role that fits your profile.", "type": "match"},
        {"message": "Reminder: Complete the \"React Native\" skill challenge to earn a badge.", "type": "learning"},
        {"message": "New internship openings in Data Science are closing soon. Check them out!", "type": "system"}
    ]

    for notif in notifications_to_add:
        existing = await db.notifications.find_one({"user_id": student_id, "message": notif["message"]})
        if not existing:
            notif_doc = {
                "id": str(uuid.uuid4()),
                "user_id": student_id,
                "message": notif["message"],
                "type": notif["type"],
                "read": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.notifications.insert_one(notif_doc)
            print(f"Added notification: {notif['message']}")
        else:
            print(f"Notification already exists")

    # --- Seed Quizzes ---
    quizzes_to_add = [
        {
            "id": "quiz-python-001",
            "title": "Python Basics Assessment",
            "category": "technical",
            "difficulty": "beginner",
            "points": 50,
            "questions": [
                {
                    "id": "q1",
                    "text": "What is the output of print(type([]) )?",
                    "options": ["<class 'list'>", "<class 'dict'>", "<class 'tuple'>", "<class 'set'>"],
                    "correct_answer": 0
                },
                {
                    "id": "q2",
                    "text": "Which of the following is used to define a function in Python?",
                    "options": ["func", "define", "def", "function"],
                    "correct_answer": 2
                }
            ]
        },
        {
            "id": "quiz-react-001",
            "title": "React Fundamentals",
            "category": "technical",
            "difficulty": "intermediate",
            "points": 100,
            "questions": [
                {
                    "id": "q1",
                    "text": "Which hook is used to handle side effects in functional components?",
                    "options": ["useState", "useEffect", "useContext", "useReducer"],
                    "correct_answer": 1
                },
                {
                    "id": "q2",
                    "text": "What is the purpose of 'key' prop in React lists?",
                    "options": ["To styling elements", "To uniquely identify elements for performance", "To secure data", "To handle clicks"],
                    "correct_answer": 1
                }
            ]
        },
        {
            "id": "quiz-logical-001",
            "title": "Logical Reasoning Challenge",
            "category": "logical",
            "difficulty": "beginner",
            "points": 30,
            "questions": [
                {
                    "id": "q1",
                    "text": "Complete the series: 2, 6, 12, 20, ?",
                    "options": ["24", "28", "30", "32"],
                    "correct_answer": 2
                }
            ]
        }
    ]

    for quiz in quizzes_to_add:
        existing = await db.quizzes.find_one({"id": quiz["id"]})
        if not existing:
            await db.quizzes.insert_one(quiz)
            print(f"Added quiz: {quiz['title']}")
        else:
            print(f"Quiz {quiz['title']} already exists")

    print("Database seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed_database())
