# InternPro – Task Checklist

> **Project path:** `/home/adithya-k-s/PROJECTS/internpro_in_ubuntu_without_emergent_with_google_api/kundanika version_5/kundanika version2 .1/kundanika version2/`

---

## 🔴 P0 – Critical (Do First)

### Task 1: Seed Database with Internship Data
- [x] Create `backend/seed_data.py`
- [x] Add 12 sample verified internships (CS, DS, Marketing, Design, Finance departments)
- [x] Add 2 sample placement staff users (role: placement_staff)
- [x] Add 2 sample employer users (role: employer)
- [x] Add 5 sample notifications for student `8d7668e5-3c33-4b1a-be75-94a3a31f308b`
- [x] Run the seed script: `cd backend && python seed_data.py`
- [x] Verify: curl GET /api/internships returns data

### Task 2: Fix Profile Update (Missing Fields)
- [x] In `backend/server.py`: Add `university, major, linkedin, bio, phone, name` to `StudentProfile` model
- [x] In `update_student_profile` endpoint: also update `users` collection with `name` and `phone`
- [x] In `get_student_profile` endpoint: merge user's `name` and `email` from `users` collection into profile response
- [x] In `frontend/src/pages/StudentDashboard.js`: 
  - [x] Initialize profile state with `user.name` and `user.email` from `localStorage`
  - [x] Verify all 8 fields in the form save and reload correctly

### Task 3: Fix Global Opportunities Fake URL
- [x] In `frontend/src/pages/StudentDashboard.js` line 381:
  - [x] Remove `window.open('https://internmatch.example.com', '_blank')`
  - [x] Create `GlobalOpportunitiesModal` component (or inline) showing real platform cards
  - [x] Platforms: Internshala, Unstop, LinkedIn Jobs, NPTEL, Letsintern

### Task 4: Fix Download CV Button
- [x] In `frontend/src/pages/StudentDashboard.js` line 605:
  - [x] Add onClick handler: `() => profile.resume_url ? window.open(profile.resume_url, '_blank') : toast.error('Please add a resume URL first')`
  - [x] Show button as disabled/grey when no resume_url

---

## 🟠 P1 – High Priority

### Task 5: Student Onboarding Wizard
- [x] Create `frontend/src/components/OnboardingWizard.jsx`
  - [x] Step 1: University, Major, Graduation Year, CGPA fields
  - [x] Step 2: Skills (type + add chips)
  - [x] Step 3: LinkedIn URL, Bio, Resume URL
  - [x] "Skip for now" option on each step
  - [x] On final submit: call PUT /api/students/profile with all data
- [x] In `frontend/src/pages/StudentDashboard.js`:
  - [x] Check if `profile_completed === false` in the API /auth/me response or profile response
  - [x] Render `<OnboardingWizard>` modal conditionally
- [x] In `backend/server.py`:
  - [x] `update_student_profile` should set `profile_completed = true` on `users` collection when all key fields are filled

### Task 6: Project Showcase – Backend API
- [x] In `backend/server.py`:
  - [x] Add `ProjectBase` Pydantic model: `title, description, github_url, live_url, tech_stack[]`
  - [x] Add `POST /api/projects` endpoint (student role only)
  - [x] Add `GET /api/projects` endpoint (returns current student's projects)
  - [x] Add `DELETE /api/projects/{id}` endpoint
  - [x] Award "Project Pro" badge on first project submission

### Task 7: Project Showcase – Frontend
- [x] In `frontend/src/pages/StudentDashboard.js`:
  - [x] Add `projects` state variable
  - [x] In `useEffect`: fetch from `GET /api/projects`
  - [x] Remove hardcoded E-commerce and Weather App project cards (lines 694–728)
  - [x] Show "No projects yet" empty state when list is empty
  - [x] Fix "Add Project" button to open a modal
  - [x] Create `AddProjectModal` with: Title, Description, GitHub URL, Live URL, Tech Stack tags
  - [x] On modal submit: POST to `/api/projects`, refresh projects list
  - [x] Add delete button to each project card

### Task 8: Badges / Achievements – Backend
- [x] In `backend/server.py`:
  - [x] Add `award_badge(user_id, badge_key, badge_name, description, icon)` helper function
  - [x] Add `GET /api/badges` endpoint – returns student's earned badges list
  - [x] In `create_application`: call `award_badge()` for "first_application" badge
  - [x] In `create_project` (Task 6): call `award_badge()` for "project_pro" badge
  - [x] In `update_student_profile`: call `award_badge()` for "skill_builder" (if skills >= 5) and "profile_completionist"
  - [x] In `get_certificates`: call `award_badge()` for "certificate_earner"

### Task 9: Badges / Achievements – Frontend
- [x] In `frontend/src/pages/StudentDashboard.js`:
  - [x] Add `badges` state, fetch from `GET /api/badges` in useEffect
  - [x] Replace hardcoded `achievements` array (lines 34–41) with the fetched data
  - [x] Show locked/greyed-out state for unearned badges with tooltip explaining how to earn

### Task 10: Manual Certificate Add
- [x] In `backend/server.py`:
  - [x] Add `POST /api/certificates/manual` endpoint (student role only)
  - [x] Schema: `title, issuing_organization, issue_date, certificate_url`
  - [x] Update `GET /api/certificates` to return both internship and manual certificates with a `type` field
- [x] In `frontend/src/pages/StudentDashboard.js`:
  - [x] Fix "Add Certificate" button (line 648) to open a modal
  - [x] Modal fields: Title, Issuing Organization, Issue Date (date picker), Certificate URL
  - [x] On submit: POST to `/api/certificates/manual`, refresh certificates

---

## 🟡 P2 – Medium Priority

### Task 11: Fix Learning Resources Links
- [x] In `frontend/src/pages/StudentDashboard.js`:
  - [x] Add `url` field to each `learningResources` item with real Coursera/edX/NPTEL URLs
  - [x] Make "Enroll Now" do `window.open(resource.url, '_blank')`

### Task 12: Fix Soft-Skill Zone Buttons
- [x] In `frontend/src/pages/StudentDashboard.js`, add `onClick` handlers:
  - [x] Mock Interview Simulator → `window.open('https://www.pramp.com', '_blank')`
  - [x] Communication Skills → `window.open('https://www.youtube.com/results?search_query=communication+skills+training', '_blank')`
  - [x] Email Etiquette → `window.open('https://www.grammarly.com/blog/email-etiquette-tips/', '_blank')`
  - [x] Body Language Tips → `window.open('https://www.youtube.com/results?search_query=body+language+tips+professional', '_blank')`
  - [x] Resume Writing Guide → `window.open('https://resumegenius.com/resume-samples', '_blank')`
  - [x] LinkedIn Building → `window.open('https://www.linkedin.com/learning/', '_blank')`

### Task 13: Fix Aptitude Practice Buttons
- [x] In `frontend/src/pages/StudentDashboard.js`, add `onClick` handlers:
  - [x] Logical Reasoning → `window.open('https://www.indiabix.com/logical-reasoning/questions-and-answers/', '_blank')`
  - [x] Quantitative Aptitude → `window.open('https://www.indiabix.com/aptitude/questions-and-answers/', '_blank')`
  - [x] Verbal Ability → `window.open('https://www.indiabix.com/verbal-ability/questions-and-answers/', '_blank')`

### Task 14: Career Chatbot with Gemini AI
- [x] Install `google-generativeai` in backend: `pip install google-generativeai`
- [x] In `backend/server.py`:
  - [x] Add `POST /api/chat` endpoint
  - [x] Build system prompt with user's profile context (skills, applications count, certificates count)
  - [x] Call Gemini API with the user message + context
  - [x] Return `{ "response": "AI response text" }`
- [x] In `frontend/src/pages/StudentDashboard.js`:
  - [x] Replace `setTimeout` + `botResponses` array with `axios.post('/api/chat', {message: chatInput})`
  - [x] Add loading state (show "Thinking..." in chat)
  - [x] Show AI response on success

---

## 🟢 P3 – Low Priority (Future)

###[x] Task 15: Quizzes and Skill Assessment Engine
    - [x] Backend Quiz/Question schemas and endpoints
    - [x] Database seeding with sample assessments
    - [x] Frontend `QuizModal` component
    - [x] Dashboard UI integration for taking quizzes

### Task 16: Real Skill Analytics
- [x] Add `GET /api/user-progress` endpoint returning real scores from quiz submissions
- [x] Replace hardcoded `skillData` array (lines 44–49) with API data
- [x] Show "No data yet" message if user has not done any quizzes

### Task 17: Real Progress Tracker
- [x] Count enrolled courses, completed challenges, average aptitude score from DB
- [x] Replace hardcoded "3/8, 12/20, 85%" (lines 985–1007) with real API data

---

## Verification Checklist (Run After Each P0/P1 Task)

- [x] `GET /api/internships` returns 12+ items → Opportunities tab shows them
- [x] Profile form: change university, save, refresh → university persists
- [x] "Download CV" button opens resume URL
- [x] "View Global Opportunities" opens modal with real platform links
- [x] "Add Project" opens modal → project saved → appears in list
- [x] "Add Certificate" opens modal → certificate saved → appears in list
- [x] Dashboard Badges: appear as locked initially, unlock after qualifying action
- [x] Onboarding wizard appears for new students
- [x] All Learning buttons link to real external URLs
- [x] Career chatbot gives AI responses (not random strings)
