# Project Details: InternPro

## 1. What's this Project About?
**InternPro** is a full-stack internship management platform designed to streamline the entire internship lifecycle. It provides a centralized hub where:
- **Students** can find and apply for internships, track their progress, and showcase their portfolio (projects and certificates).
- **Employers** can post internship opportunities, manage applications, and shortlist candidates.
- **Faculty** can review student applications and provide feedback before they reach the employer.
- **Placement Staff** can access high-level analytics and manage the overall internship ecosystem.

## 2. How it is Useful?
- **Centralization**: Replaces fragmented communication (emails, WhatsApp, Google Forms) with a single platform.
- **Transparency**: Students can see the status of their application in real-time.
- **Efficiency**: Standardizes the application process and provides tools for interview scheduling and certificate generation.
- **AI-Driven**: Features an integrated AI career assistant (Gemini) to help students with their queries.
- **Portfolio Building**: Enables students to build a professional profile with skills, projects, and external certificates.

## 3. What are used in this Project?
### Frontend (React Ecosystem)
- **Framework**: React.js
- **Styling**: Tailwind CSS & Lucide Icons
- **Components**: Shadcn/UI (Radix UI based)
- **Charts**: Recharts (for student progress visualization)
- **API Client**: Axios (for backend communication)
- **Toasts**: Sonner (for real-time feedback)

### Backend (Python Ecosystem)
- **Server**: FastAPI
- **Database**: MongoDB (with Motor for async operations)
- **Authentication**: JWT (JSON Web Tokens) & Passlib (bcrypt)
- **Validation**: Pydantic
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)

## 4. Tech Stack & Why?
- **FastAPI**: Chosen for its high performance, automatic documentation (Swagger UI), and native asynchronous support, which is critical for handling I/O bound database operations.
- **React**: Enables a highly responsive and interactive user interface, allowing for complex dashboard state management.
- **MongoDB**: A NoSQL document-based database that provides the flexibility needed for evolving internship and user profile schemas without rigid migrations.
- **Pydantic**: Ensures that data entering the backend is type-safe and strictly validated against the models, preventing runtime errors.
- **Gemini AI**: Leverages state-of-the-art LLMs to provide intelligent career guidance and automated feedback.

## 5. Features of this Project
- **Role-Based Access Control**: Separate dashboards for Students, Employers, Faculty, and Placement Staff.
- **Internship Management**: Creation, verification, and discovery of internship opportunities.
- **Application Workflow**: Multi-stage application tracking (Pending → Faculty Review → Shortlisted → Approved/Rejected).
- **Portfolio System**: Manual project and certificate management for students.
- **Integrated AI Chatbot**: Career-focused AI help available in the student dashboard.
- **Interview Scheduling**: Employers can schedule interviews directly with students.
- **Notification System**: Real-time alerts for application status changes and new opportunities.
- **Analytics Dashboard**: Comprehensive charts for placement staff to monitor metrics.

## 6. Feature to File Mapping

### Core Backend Logic
- **`backend/server.py`**: Contains all API routes, Pydantic models, and database interaction logic.
- **`backend/.env`**: Configuration for MongoDB, JWT, and Google API keys.

### Primary Frontend Pages (`frontend/src/pages/`)
- **`StudentDashboard.js`**: Main interface for students to manage applications and profile.
- **`EmployerDashboard.js`**: Interface for employers to post and manage internships.
- **`PlacementStaffDashboard.js`**: High-level data visualization and management.
- **`FacultyDashboard.js`**: Review portal for faculty members.
- **`Login.js` / `Register.js`**: Authentication pages.

### Key Components (`frontend/src/components/`)
- **`OnboardingWizard.jsx`**: Multi-step profile completion for students.
- **`AddProjectModal.jsx`**: Logic for adding projects to the student profile.
- **`AddCertificateModal.jsx`**: Manual certificate upload functionality.
- **`QuizModal.jsx`**: Skill-testing/quiz feature.

## 7. External Resource Redirections
The platform integrates several external resources to support student professional development:
- **Professional Etiquette**: Links to [Grammarly Email Etiquette Tips](https://www.grammarly.com/blog/email-etiquette-tips/).
- **Interview Preparation**: Redirects to [YouTube Professional Body Language Tips](https://www.youtube.com/results?search_query=body+language+tips+professional).
- **Resume Building**: Provides samples from [Resume Genius](https://resumegenius.com/resume-samples).
- **Continuous Learning**: Quick access to [LinkedIn Learning](https://www.linkedin.com/learning/).
- **External Certificates**: Allows users to link to certificates hosted on platforms like Coursera, Udemy, or Google Drive via direct URLs.

## 8. Additional Information
- **Testing**: Includes a basic test suite in the `tests/` directory.
- **NGROK**: Pre-configured support for local tunneling to share development previews.
- **Environment Variables**: Use `.env` files in both `frontend` and `backend` directories to manage sensitive keys and URLs.
