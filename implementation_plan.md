# InternPro – PRD & Implementation Plan

> **Project:** Kundanika InternPro | **Version:** 2.0 | **Date:** March 2026

---

## Executive Summary

The InternPro platform has the correct infrastructure (React + FastAPI + MongoDB Atlas) but **most student-facing features are hardcoded mock data** and many buttons do nothing. This document defines all 14 fixes needed to make every feature real and per-user.

---

## Priority Matrix

| Priority | Feature | Effort |
|---|---|---|
| 🔴 P0 | Seed DB with internship data | Small |
| 🔴 P0 | Fix Profile Update (missing fields: university, major, bio) | Small |
| 🔴 P0 | Fix Global Opportunities fake URL | Tiny |
| 🔴 P0 | Fix "Download CV" button | Tiny |
| 🟠 P1 | Student Onboarding Wizard | Medium |
| 🟠 P1 | Project Showcase (backend API + Add modal) | Medium |
| 🟠 P1 | Badges / Achievements System | Medium |
| 🟠 P1 | Manual Certificate Add by student | Medium |
| 🟡 P2 | Real Learning Resources with working links | Small |
| 🟡 P2 | Fix all Soft-Skill + Aptitude buttons | Small |
| 🟡 P2 | Career Chatbot → Real Gemini AI | Medium |
| 🟢 P3 | Quizzes / Challenges engine | Large |
| 🟢 P3 | Skill Analytics from real quiz data | Large |
| 🟢 P3 | Progress Tracker from real user data | Medium |

---

## Proposed Changes

---

### P0: Seed Database

#### [NEW] backend/seed_data.py

- Create Python script using `motor` async MongoDB client
- Insert 12 sample verified internships (CS, Data Science, Marketing, Design, Finance)
- Insert 2 placement staff users + 2 employer users with hashed passwords
- Insert a few sample notifications for testing
- Idempotent: check before insert to avoid duplicates

---

### P0: Fix Profile Update

#### [MODIFY] backend/server.py

- Expand `StudentProfile` model to add: `university, major, linkedin, bio, phone, name`
- In `update_student_profile` endpoint: also update `users` collection with `name` and `phone`
- The GET endpoint should merge user data (name, email) with profile data so frontend gets all fields

#### [MODIFY] frontend/src/pages/StudentDashboard.js

- In `updateProfile()` function: include `name` and `phone` in what's sent to PUT endpoint
- On load: merge `profile` state with user data from `localStorage` for name/email

---

### P0: Fix Global Opportunities URL

#### [MODIFY] frontend/src/pages/StudentDashboard.js

- Replace `window.open('https://internmatch.example.com', '_blank')` 
- With a modal showing cards for real platforms: Internshala, Unstop, LinkedIn Jobs, NPTEL

---

### P0: Fix Download CV Button

#### [MODIFY] frontend/src/pages/StudentDashboard.js

- Add `onClick={() => profile.resume_url && window.open(profile.resume_url, '_blank')}` to the Download CV button
- Show disabled state if no resume URL is set

---

### P1: Student Onboarding Wizard

#### [NEW] frontend/src/components/OnboardingWizard.js

- Modal shown when `user.profile_completed === false`
- 3-step form: (1) University/Major/CGPA/GradYear, (2) Skills, (3) LinkedIn/Bio/Resume URL
- On complete: call `PUT /api/students/profile` then set `profile_completed = true`
- Dismiss permanently once completed

#### [MODIFY] frontend/src/pages/StudentDashboard.js

- Import and render `<OnboardingWizard>` when `profile_completed === false`

---

### P1: Project Showcase

#### [MODIFY] backend/server.py

Add these new endpoints:
```
POST   /api/projects          → create project (student only)
GET    /api/projects          → get logged-in student's projects
DELETE /api/projects/{id}     → delete own project
```
New `projects` MongoDB collection with schema: `id, user_id, title, description, github_url, live_url, tech_stack[], created_at`

#### [MODIFY] frontend/src/pages/StudentDashboard.js

- Add `projects` state, fetch from `GET /api/projects` on mount
- Remove hardcoded "E-commerce Website" and "Mobile Weather App"
- Fix "Add Project" button to open a modal
- Add `AddProjectModal` component (inline or separate file) with fields: title, description, GitHub URL, live URL, tech stack tags
- Show "No projects yet. Add your first project!" when empty
- Add delete button per project

---

### P1: Badges / Achievements

#### [MODIFY] backend/server.py

- Add `awards_badge()` helper function
- Add `GET /api/badges` endpoint returning user's earned + all available badges
- Trigger badge award in these places:
  - `create_application` → award "First Application" badge (if first)
  - `create_project` → award "Project Pro" badge (if first)
  - `update_student_profile` → award "Skill Builder" if 5+ skills; award "Profile Completionist" if all fields filled
  - `get_certificates` → award "Certificate Earner" when a certificate is received

New `badges` MongoDB collection: `id, user_id, badge_name, badge_key, earned_at, description, icon`

#### [MODIFY] frontend/src/pages/StudentDashboard.js

- Add `badges` state, fetch from `GET /api/badges` on mount
- Replace hardcoded `achievements` array with the DB data
- For unearned badges: show greyed out with lock icon and tooltip showing requirement

---

### P1: Manual Certificate Add

#### [MODIFY] backend/server.py

- Add `POST /api/certificates/manual` endpoint (student role only)
- Add `type` field to certificate schema (`"internship"` | `"manual"`)
- Update `GET /api/certificates` to return both types

#### [MODIFY] frontend/src/pages/StudentDashboard.js

- Fix "Add Certificate" button to open a modal
- Modal fields: Title, Issuing Organization, Issue Date, Certificate URL
- On submit: POST to `/api/certificates/manual`
- Reload certificates after adding

---

### P2: Real Learning Resources & Working Buttons

#### [MODIFY] frontend/src/pages/StudentDashboard.js

- Replace hardcoded `learningResources` array with real URLs
- Make "Enroll Now" do `window.open(resource.url, '_blank')`
- Fix all Soft-Skill Zone buttons with real external links:
  - Mock Interview → `https://www.pramp.com`
  - Communication Skills → `https://www.youtube.com/results?search_query=communication+skills+for+professionals`
  - Resume Writing Guide → `https://resumegenius.com/resume-samples`
  - LinkedIn Building → `https://www.linkedin.com/learning`
- Fix Aptitude Practice buttons:
  - Logical Reasoning → `https://www.indiabix.com/logical-reasoning/questions-and-answers/`
  - Quantitative Aptitude → `https://www.indiabix.com/aptitude/questions-and-answers/`
  - Verbal Ability → `https://www.indiabix.com/verbal-ability/questions-and-answers/`

---

### P2: Career Chatbot with Gemini AI

#### [MODIFY] backend/server.py

- Add `POST /api/chat` endpoint
- Use `google-generativeai` Python library with `GOOGLE_API_KEY`
- Build a system prompt with student's profile context (skills, applications, certificates)
- Return AI response as `{ "response": "..." }`

#### [MODIFY] frontend/src/pages/StudentDashboard.js

- Remove hardcoded `botResponses` array
- Replace `setTimeout` mock with a real `axios.post('/api/chat', {message: chatInput})`
- Show loading indicator while waiting for AI response

---

## Verification Plan

### Automated Tests
- Run existing backend tests: `cd backend && python -m pytest ../tests/ -v`
- API smoke tests: `python /tmp/test_api.py` (already verified login + profile)

### Manual Testing Steps

**After each fix, verify:**

1. **Profile Update:** Login → Profile tab → Change university/major/bio → Save → Refresh page → Verify fields persist
2. **Internships:** After seeding DB, go to Opportunities tab → Verify listings appear, search works, Apply button works
3. **Global Opportunities:** Click button → Verify it opens Internshala/Unstop instead of fake URL
4. **Download CV:** Add a resume URL in profile → Click Download CV → Verify it opens the URL
5. **Project Showcase:** Click "Add Project" → Fill form → Submit → Verify project appears, then delete it
6. **Badges:** Apply to an internship → Go to Dashboard → Verify "First Application" badge appears
7. **Manual Certificate:** Profile tab → Add Certificate → Fill form → Submit → Verify it appears
8. **Learning Buttons:** Click "Enroll Now" → Verify it opens correct external site
9. **Chatbot:** Open chat → Type a question → Verify AI-powered response (not random string)
10. **Onboarding:** Register a new student account → Verify onboarding wizard appears
