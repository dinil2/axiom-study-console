# **Role:**

You are a world-class senior full-stack engineer and creative frontend developer who builds polished, animated, production-grade React applications backed by real databases. You have MCP access to a connected Supabase project — use those MCP tools directly to create tables, Row Level Security policies, and auth configuration yourself. Do not just print SQL for the user to run manually; execute it through the Supabase MCP connection.

# **Objective:**

Rebuild **Axiom**, a private study console for Sri Lankan GCE Advanced Level students, as a fully working, animated, mobile-friendly, database-backed web app with real user accounts. Unlike the previous version, subjects are no longer hardcoded to Biology/Physics/Chemistry — support all four A/L streams (Science, Commerce, Arts, Technology) so a student in any stream can track their own three subjects.

# **Context:**

The previous version of this app tracked syllabus completion, past-paper marks, a weekly timetable, and a priority-tagged daily todo list for three fixed Science subjects, styled as a "Prismatic glass studio": translucent glass cards over a soft prismatic background, OKLCH color tokens, fixed subject accent colors, full light/dark theme. It ran on TanStack Start v1 (React 19, Vite 7), Tailwind CSS v4, shadcn/ui-style components, Recharts, Lucide icons, and Sonner toasts — all local-only, no backend.

I'm attaching screenshots of that previous UI (dashboard, marks/analytics, weekly planner, syllabus tracker) as the visual reference — match and extend that aesthetic, don't redesign it from scratch.

# **Instructions:**

## **Instruction 1: Generalize the data model and build it in Supabase via MCP**
Stop hardcoding subjects. Create a `subjects` reference table (`id`, `name`, `stream` — Science/Commerce/Arts/Technology, `color_token`, `sort_order`) seeded with the standard A/L catalog: Science (Combined Mathematics, Physics, Chemistry, Biology, Agriculture); Commerce (Economics, Business Studies, Accounting, Business Statistics, ICT); Arts (Sinhala, English, History, Geography, Political Science, Logic & Scientific Method, Home Economics, Art, Dancing, Media Studies, and the civilization subjects); Technology (Engineering Technology, Bio-Systems Technology, Science for Technology, ICT). Treat these unit lists as a sensible starting curriculum outline, not an exact official transcript — the user can edit them later. Then create: `user_subjects` (which 1–3 subjects a user is tracking), `syllabus_units` (per-subject unit list, editable), `unit_progress` (per-user completion per unit), `marks` (subject_id, title, paper_type, score 0–100, date, unit, notes), `slots` (day 0–6, start/end time, subject_id or "General", category), `todos` (text, priority, done, day). Every user-data table gets `user_id` and Row Level Security limiting all access to `user_id = auth.uid()`. Assign each subject a distinct accent color token so the UI isn't limited to three colors.

## **Instruction 2: Full authentication**
Build email/password sign-up (name, email, password) and login, plus "Continue with Google" on both. Include forgot/reset password and a sign-out control inside the app (account menu off the sidebar/nav). Protect every app route — signed-out users land on `/login`; signed-in users get redirected away from `/login`/`/signup`. After sign-up, run a short onboarding step where the user picks their stream and their 1–3 subjects before landing on the dashboard, and auto-seed a small starter dataset (a few sample marks, slots, todos, and some completed units) for whichever subjects they picked, so it isn't empty on day one.

## **Instruction 3: Rebuild the four core pages, now subject-agnostic**
- **Dashboard** — stats strip (syllabus completion %, average marks, today's schedule), one card per subject the user actually selected (not a fixed three), score-trend line chart, today/next schedule panel.
- **Marks & Analytics** — add-paper form (subject dropdown now pulls from the user's chosen subjects), trend chart, per-subject bar chart, strongest/weakest units, filterable table.
- **Weekly Planner** — Mon–Sun grid of class/study slots plus a priority-tagged daily todo list, both scoped to the user's subjects.
- **Syllabus Tracker** — one progress card per selected subject with its unit checklist, plus an overall completion bar.
All four stay wrapped in the existing shell pattern: sidebar on desktop, and on mobile switch to a bottom tab bar (Dashboard / Marks / Planner / Syllabus) instead of the old horizontal scroll nav, since this needs to work properly one-handed on a phone.

## **Instruction 4: Mobile-first, responsive throughout**
Every page must be fully usable at a 375px viewport before you consider it done — no fixed-width tables or charts that overflow. Cards stack vertically on mobile, the weekly grid becomes a swipeable/scrollable single-day view or a horizontally scrollable week strip, dialogs become bottom sheets, and touch targets stay at least 44px. Verify tablet and desktop breakpoints too.

## **Instruction 5: Animation pass with Framer Motion**
Add tasteful motion throughout, respecting `prefers-reduced-motion`: staggered fade/slide-in for dashboard cards and lists on load; animated number count-up for stats (completion %, average marks); Recharts line/bar entrance animations; smooth page-transition crossfades between routes; a spring-based toggle animation on the light/dark switch (not just an instant swap); subtle scale/opacity feedback on button press and card hover; an animated progress-bar fill rather than a static jump to value. Keep it subtle and fast (150–400ms ranges) — this is a study tool, not a landing page, so motion should feel responsive, not showy.

## **Instruction 6: Light/dark mode**
Keep an explicit, always-visible Light/Dark toggle button (segmented control, as before) in the header/sidebar, persisted per user (store the preference in their `profiles` row, not just `localStorage`, so it follows them across devices), driving the same `dark` class + OKLCH variable approach as before.

# **Notes:**
- Use the connected Supabase MCP tools to actually create the tables, RLS policies, and any auth triggers — don't just describe the schema in prose.
- I'll attach reference screenshots of the old UI in the same message as this prompt — treat them as the design source of truth to extend, not replace.
- Google sign-in needs a Google Cloud OAuth Client ID/secret added under Supabase → Authentication → Providers → Google — I'll do that manually, so build the frontend flow regardless and flag if that's the only piece blocking it.
- Syllabus unit lists for non-Science subjects are a reasonable starting point, not verified against the current official NIE syllabus — make them easy for me to edit later rather than treating them as fixed.
- No backend push notifications, multi-user/parent accounts, or payments in this pass — single-user accounts only.
