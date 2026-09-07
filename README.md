# Axiom — Advanced Level Study Console

> **Live Deployment:** [https://axiom-al-console.netlify.app](https://axiom-al-console.netlify.app)

---

## 🌟 The Main Idea

**Axiom** is a private, production-grade study console crafted specifically for **Sri Lankan GCE Advanced Level (A/L)** students. 

Preparing for the Sri Lankan A/L examination is an intensive 2–3 year endeavor where students juggle high-volume syllabi, multiple tuition classes, paper classes, and past paper scoring across three distinct subjects. Most general-purpose productivity apps fail to capture this unique workflow. 

**Axiom bridges this gap** by providing a tailored study workstation supporting **all four official A/L streams** — **Science, Commerce, Arts, and Technology**. Students can select their stream, choose their specific 1–3 subjects (or custom combination), and manage their entire academic journey in one place.

---

## 🚀 Live Demo & Access

Experience the live application deployed on Netlify:
🔗 **[https://axiom-al-console.netlify.app](https://axiom-al-console.netlify.app)**

---

## ✨ Core Features

### 1. 🎓 All-Stream Onboarding & Subject Customization
- Supports all 4 official Sri Lankan A/L streams:
  - **Science**: Combined Mathematics, Physics, Chemistry, Biology, Agriculture
  - **Commerce**: Accounting, Business Studies, Economics, Business Statistics, ICT
  - **Arts**: Sinhala, English, History, Geography, Political Science, Logic, Media Studies, etc.
  - **Technology**: Engineering Technology, Bio-Systems Technology, Science for Technology, ICT
- Quick onboarding flow allows students to select their stream and pick their active 3 subjects.
- Dynamic color assignment per subject with distinct accent palettes.

### 2. 📊 Syllabus Unit Progress Tracker
- Interactive unit-by-unit curriculum checklist for each tracked subject.
- Real-time syllabus completion percentages and overall progress indicators.
- Flexibility to dynamically **add custom units** or **remove units** to tailor the curriculum to personal study plans.

### 3. 📈 Marks & Performance Analytics
- Log past paper marks, term tests, and model exam scores (0–100) with dates, paper types, and notes.
- Visual **Score Trend Line Chart** powered by Recharts showing historical performance over time.
- **Subject-wise Average Score Comparison Bar Chart**.
- Dynamic computation of **Strongest** and **Weakest** units to guide revision priorities.
- Filterable and sortable marks ledger table.

### 4. 🗓️ Weekly Timetable & Class Scheduler
- Mon–Sun interactive weekly calendar tailored for tuition classes, school, and self-study blocks.
- Categorized slots: **Theory**, **Revision**, **Paper Class**, **Self-Study**, and **General**.
- Direct modal to add new scheduled classes with day, time range, subject, and category.
- Inline class deletion and instant timetable updates.

### 5. 📝 Homework & Task Management
- Subject-tagged homework tracker with priority levels (**High**, **Medium**, **Low**).
- Due date indicators with urgency tags (Today, Tomorrow, Overdue).
- Animated completion check with interactive **canvas-confetti** celebration when finishing tasks.
- Quick modal to assign new homework items to any tracked subject.

### 6. 🌓 Prismatic Glass Studio UI & Responsive Design
- Modern translucent glassmorphism cards over soft prismatic gradient backgrounds.
- Perceptually uniform **OKLCH** color tokens and dark/light mode toggle.
- Mobile-first architecture: Desktop sidebar transforms into a bottom navigation bar for single-handed mobile use (<375px responsive).

### 7. 🔐 Supabase Authentication & Row Level Security (RLS)
- Secure user accounts via **Supabase Auth** (Email/Password and Google OAuth ready).
- Strict **Row Level Security (RLS)** ensuring users only read and write their own academic records.
- Graceful offline/demo mode with mock starter data if backend connection is unconfigured.

---

## 🛠️ Full Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Latest React features and fast component rendering |
| **Language** | **TypeScript** | Strict end-to-end typing for data models and state |
| **Build Tool** | **Vite 7** | Lightning-fast HMR and optimized production bundling |
| **Styling & Design** | **Tailwind CSS v4** | Modern utility styling with OKLCH theme variables |
| **Icons** | **Lucide React** | Consistent, lightweight iconography |
| **Charts & Analytics** | **Recharts** | Responsive SVG charts for mark trends and performance |
| **Micro-Interactions** | **Canvas-Confetti** | Rewarding visual feedback for completing homework |
| **Database & Auth** | **Supabase (PostgreSQL)** | Cloud PostgreSQL with RLS, triggers, and Supabase Auth |
| **Hosting & CI/CD** | **Netlify** | Continuous deployment with SPA rewrite rules (`_redirects`) |

---

## 🗄️ Database Architecture

The application is backed by a relational PostgreSQL schema in Supabase:

- **`profiles`**: User details and theme preferences (`light` / `dark`).
- **`subjects`**: Standard A/L reference catalog across Science, Commerce, Arts, and Technology.
- **`user_subjects`**: Links authenticated users to their chosen 1–3 subjects.
- **`syllabus_units`**: Subject syllabus units (expandable with custom units).
- **`unit_progress`**: Per-user unit completion records.
- **`marks`**: Exam marks, scores (0–100), paper types, dates, and syllabus units.
- **`slots`**: Weekly timetable schedule entries with day, time, and class category.
- **`homework`**: Subject homework assignments, priorities, due dates, and status.

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dinil2/axiom-study-console.git
   cd axiom-study-console
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   *(Note: The app will run seamlessly in Demo Mode with mock data even without Supabase keys).*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
