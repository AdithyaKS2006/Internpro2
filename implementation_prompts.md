# InternPro – AI Implementation Prompts

> Use these prompts one at a time with your AI coding assistant.
> **Project path:** `/home/adithya-k-s/PROJECTS/internpro_in_ubuntu_without_emergent_with_google_api/kundanika version_5/kundanika version2 .1/kundanika version2/`

---

## PROMPT 1 – Seed Database with Sample Data

```
I have a FastAPI + MongoDB backend for an internship platform called InternPro. 
The backend file is at: backend/server.py
The backend .env file has: MONGO_URL (MongoDB Atlas), DB_NAME=internpro, JWT_SECRET_KEY, GOOGLE_API_KEY

Create a new file backend/seed_data.py that:
1. Uses motor (AsyncIOMotorClient) to connect to MongoDB using the same env vars as server.py
2. Creates 12 realistic internship documents in the 'internships' collection with these fields: id (uuid), title, description, company, skills_required (list), department (vary between CS, Data Science, Marketing, Design, Finance), stipend (number), duration_months, location, application_deadline, is_verified=True, posted_by="seed", posted_by_role="placement_staff", created_at (ISO8601), applicant_count=0
3. Creates 5 sample notifications for student user_id "8d7668e5-3c33-4b1a-be75-94a3a31f308b" with messages about internship matches
4. Checks before inserting (skip if already exists)
5. Runs with: python seed_data.py

Make the script async and run it with asyncio.run(main())
```

---

## PROMPT 2 – Fix Profile Update (Missing Fields)

```
I have a FastAPI backend (backend/server.py) and a React frontend (frontend/src/pages/StudentDashboard.js) for an internship platform.

PROBLEM: The profile form in StudentDashboard.js shows fields for: name, email, phone, university, major, graduation_year, cgpa, linkedin, bio, resume_url, cover_letter, skills.
But the StudentProfile Pydantic model in server.py only has: user_id, skills, resume_url, cover_letter, cgpa, graduation_year, interests.
So when the student saves their profile, name/phone/university/major/linkedin/bio are silently ignored.

FIX NEEDED:
1. In backend/server.py: 
   - Add university, major, linkedin, bio to the StudentProfile model
   - In update_student_profile endpoint: also update the 'users' collection with name and phone
   - In get_student_profile endpoint: fetch the user from 'users' collection and merge name + email into the profile response

2. In frontend/src/pages/StudentDashboard.js:
   - When loading profile (useEffect), also initialize profile.name and profile.email from localStorage user object
   - Make sure all 8+ profile fields are included in the PUT request body when "Save Profile" is clicked

Show me the exact code changes needed.
```

---

## PROMPT 3 – Fix Global Opportunities & Download CV

```
In the file frontend/src/pages/StudentDashboard.js, fix these two broken buttons:

1. GLOBAL OPPORTUNITIES (line ~381):
Current: window.open('https://internmatch.example.com', '_blank')
Fix: When clicked, show a modal with cards for real platforms:
- Internshala: https://internshala.com (India's top internship site)
- Unstop: https://unstop.com (Competitions & internships)
- LinkedIn Jobs: https://linkedin.com/jobs
- NPTEL: https://nptel.ac.in (Free courses)
- Letsintern: https://letsintern.com
Use the existing Card, Button, Badge components. Style nicely with icons.

2. DOWNLOAD CV BUTTON (line ~605):
Current: <Button><Download />Download CV</Button> — no onClick
Fix: Add onClick handler that opens profile.resume_url in new tab if it exists, or shows a toast.error("Please add your Resume URL in the profile first") if not set.

Use the existing toast from 'sonner' for the error message.
```

---

## PROMPT 4 – Student Onboarding Wizard

```
For the React frontend at frontend/src/pages/StudentDashboard.js:

Create a new component: frontend/src/components/OnboardingWizard.jsx

The wizard is a full-screen modal overlay shown to new students (when profile has no university/major/skills filled in). It has 3 steps:

Step 1 - Academic Info:
- University name (text input)
- Major/Department (text input)
- Graduation Year (number input, 2024-2030)
- CGPA (number input, 0-10 with 0.01 step)

Step 2 - Your Skills:
- Type a skill and press Enter or click Add button
- Show added skills as removable chips/badges
- At least some skills recommended

Step 3 - Professional Info:
- LinkedIn Profile URL (text input, optional)
- Bio/About (textarea, optional)
- Resume URL (text input, Google Drive or similar link, optional)

Navigation:
- "Next" / "Back" buttons
- "Skip for now" link on each step
- Final step has "Complete Setup" button
- On complete: call PUT /api/students/profile with all collected data

Styling: Use existing Card, Button, Input, Label, Badge UI components. Make it welcoming and friendly with a progress bar showing step 1/3, 2/3, 3/3.

Then in StudentDashboard.js, import and render <OnboardingWizard> when the profile has empty university field (first login detection).
```

---

## PROMPT 5 – Project Showcase (Backend + Frontend)

```
Add a real Project Showcase feature to the InternPro platform.

BACKEND (backend/server.py):
Add these endpoints:

1. POST /api/projects (student role only)
   Body: { title, description, github_url, live_url, tech_stack: [] }
   - Generate id (uuid), set user_id from JWT, set created_at
   - Insert into 'projects' collection
   - Return the created project

2. GET /api/projects (student role)
   - Return all projects for the current user from 'projects' collection
   - Sort by created_at descending

3. DELETE /api/projects/{project_id} (student role)
   - Verify the project belongs to the current user
   - Delete it

Add Pydantic models: ProjectCreate, Project (with id, user_id, title, description, github_url, live_url, tech_stack, created_at)

FRONTEND (frontend/src/pages/StudentDashboard.js):
1. Add `const [projects, setProjects] = useState([])` state
2. In useEffect: fetch from GET /api/projects
3. Remove the 2 hardcoded project cards (the E-commerce and Weather App ones)
4. Replace with a map over the real projects array
5. Show "No projects yet. Click 'Add Project' to showcase your work!" when empty
6. Fix the "Add Project" button to open a modal dialog with fields:
   - Project Title (required)
   - Description (required, textarea)
   - GitHub URL (optional)  
   - Live Demo URL (optional)
   - Tech Stack (type and add chips, just like the skills section)
7. On modal submit: POST to /api/projects, refresh the projects list
8. Add a delete (trash) icon button on each project card

Use the existing Dialog component from @/components/ui/dialog if available, or use a simple state-controlled Card overlay.
```

---

## PROMPT 6 – Badges / Achievements System

```
Add a real badge/achievement system to the InternPro platform.

BACKEND (backend/server.py):
1. Add a helper function: award_badge(user_id, badge_key, badge_name, description, icon_name)
   - Check if badge already awarded (avoid duplicates)
   - Insert into 'user_badges' collection: { id, user_id, badge_key, badge_name, description, icon_name, earned_at }

2. Add GET /api/badges endpoint:
   - Return list of ALL possible badges with whether the current user has earned each
   - Possible badges: first_application, project_pro, skill_builder, profile_completionist, certificate_earner, fast_learner
   - For each: { badge_key, badge_name, description, icon_name, earned: true/false, earned_at: null or timestamp }

3. Trigger badge awards at the right places:
   - In create_application: if this is student's first application → award_badge(student_id, "first_application", "First Application", "Applied to your first internship!", "Trophy")
   - In create_project: if this is student's first project → award_badge("project_pro")
   - In update_student_profile: if skills count >= 5 → award_badge("skill_builder"); if all key fields filled → award_badge("profile_completionist")
   - In get_certificates (or wherever certificate is received) → award_badge("certificate_earner")

FRONTEND (frontend/src/pages/StudentDashboard.js):
1. Add `const [badges, setBadges] = useState([])` state
2. In useEffect: fetch from GET /api/badges
3. Remove the hardcoded `achievements` array (lines ~34-41)
4. Use badges from API in the Achievements section
5. Show earned badges with their icon + name (colored)
6. Show unearned badges greyed out with 🔒 icon and tooltip showing how to earn them
```

---

## PROMPT 7 – Manual Certificate Add

```
Add the ability for students to manually add their own certificates (Coursera, Udemy, NPTEL, etc.) to their profile.

BACKEND (backend/server.py):
1. Add POST /api/certificates/manual endpoint (student role only):
   Body: { title, issuing_organization, issue_date (YYYY-MM-DD string), certificate_url }
   - Generate id, set student_id from JWT, set type="manual", created_at=now
   - Insert into 'certificates' collection
   - Return the created certificate

2. Update GET /api/certificates:
   - Add a 'type' field to distinguish: "internship" (from faculty) vs "manual" (self-added)
   - Return both types for the current student

FRONTEND (frontend/src/pages/StudentDashboard.js):
1. Fix the "Add Certificate" button (currently has no onClick) to open a modal:
   Fields:
   - Certificate Title (e.g. "Python for Everybody")
   - Issuing Organization (e.g. "Coursera")
   - Issue Date (date input)
   - Certificate URL (link to verify, optional)
2. On submit: POST to /api/certificates/manual
3. Refresh the certificates list
4. Show certificates with a visual distinction between internship certificates and manual ones (e.g. different badge color or label)
```

---

## PROMPT 8 – Fix All Learning Buttons

```
In frontend/src/pages/StudentDashboard.js, fix every non-functional button in the Learning tab:

1. Replace the hardcoded learningResources array with this:
const learningResources = [
  { id: 1, title: 'Python for Everybody', platform: 'Coursera', type: 'Course', url: 'https://www.coursera.org/specializations/python' },
  { id: 2, title: 'Data Science MicroMasters', platform: 'edX', type: 'Course', url: 'https://www.edx.org/micromasters/mitx-statistics-and-data-science' },
  { id: 3, title: 'Complete Python Bootcamp', platform: 'NPTEL', type: 'Course', url: 'https://nptel.ac.in/courses/106106213' },
  { id: 4, title: 'Web Development Bootcamp', platform: 'Udemy', type: 'Course', url: 'https://www.udemy.com/course/the-web-developer-bootcamp/' },
]
Make "Enroll Now" button do: window.open(resource.url, '_blank')

2. Soft-Skill Zone - add onClick to each button:
- Mock Interview Simulator → window.open('https://www.pramp.com', '_blank')
- Communication Skills → window.open('https://www.youtube.com/results?search_query=communication+skills+for+professionals', '_blank')
- Email Etiquette → window.open('https://www.grammarly.com/blog/email-etiquette-tips/', '_blank')
- Body Language Tips → window.open('https://www.youtube.com/watch?v=cFLjudWTuGQ', '_blank')
- Resume Writing Guide → window.open('https://resumegenius.com/resume-samples', '_blank')
- LinkedIn Building → window.open('https://www.linkedin.com/learning/', '_blank')

3. Aptitude Practice - add onClick to each button:
- Logical Reasoning → window.open('https://www.indiabix.com/logical-reasoning/questions-and-answers/', '_blank')
- Quantitative Aptitude → window.open('https://www.indiabix.com/aptitude/questions-and-answers/', '_blank')
- Verbal Ability → window.open('https://www.indiabix.com/verbal-ability/questions-and-answers/', '_blank')

4. Make the Progress Tracker fetch from API (call GET /api/user-progress if it exists, else show 0 for all bars with a "Complete activities to track progress" message) instead of hardcoding 3/8, 12/20, 85%.
```

---

## PROMPT 9 – Career Chatbot with Gemini AI

```
Replace the fake chatbot with a real Gemini AI-powered chatbot.

BACKEND (backend/server.py):
1. Install: pip install google-generativeai
2. At the top of server.py, import: import google.generativeai as genai
3. Configure genai with the existing GOOGLE_API_KEY from env
4. Add POST /api/chat endpoint:
   Body: { message: str }
   - Fetch the student's profile from DB (skills, applications count, certificates count)  
   - Build a system prompt like: "You are a career assistant for InternPro, an internship platform. The student you are helping has these skills: {skills}. They have submitted {app_count} applications and earned {cert_count} certificates. Help them with internship search, career advice, skill development, and resume tips. Be friendly, concise, and practical."
   - Call Gemini API: model = genai.GenerativeModel('gemini-pro'), response = model.generate_content(system_prompt + "\n\nStudent: " + message)
   - Return { "response": response.text }

FRONTEND (frontend/src/pages/StudentDashboard.js):
1. Remove the hardcoded botResponses array (lines ~190-196)
2. Replace the setTimeout mock bot response with:
   - Set a loading state showing "Thinking..." message in chat
   - const res = await axios.post(`${API}/chat`, { message: chatInput }, getAuthHeaders())
   - Set the bot response as res.data.response
3. Handle errors gracefully (show "Sorry, I couldn't respond right now" if API fails)
```

---

## PROMPT 10 – Fix Skill Analytics (Remove Hardcoded Data)

```
In frontend/src/pages/StudentDashboard.js, fix the Skill Analytics radar chart.

CURRENT PROBLEM: The skillData array (lines ~44-49) is hardcoded with made-up values:
{ subject: 'Logical Reasoning', A: 90 },
{ subject: 'Technical Coding', A: 75 },
etc.
This shows the same chart for EVERY student.

FIX: 
1. Remove the hardcoded skillData array
2. Add `const [skillData, setSkillData] = useState([])` state
3. In useEffect, try to fetch GET /api/user-progress (if endpoint exists)
4. If API succeeds: build skillData from real scores
5. If API fails or returns no data: set skillData to empty [] and show a friendly message instead of the chart:
   "Complete quizzes and challenges to see your personalized skill analytics!"
   
Also add a `const [progressData, setProgressData] = useState(null)` state and use it for the Progress Tracker section instead of hardcoded "3/8, 12/20, 85%" values.

If /api/user-progress doesn't exist yet, that's fine — just show the placeholder message.
```
