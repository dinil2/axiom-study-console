-- ==============================================================================
-- Axiom: Sri Lankan GCE Advanced Level (A/L) Study Console Database Schema
-- Multi-Stream Support: Science, Commerce, Arts, Technology
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (User account metadata & preferences)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'A/L Student',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    stream TEXT CHECK (stream IN ('Science', 'Commerce', 'Arts', 'Technology')) DEFAULT 'Science',
    theme_preference TEXT CHECK (theme_preference IN ('light', 'dark', 'system')) DEFAULT 'dark',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBJECTS REFERENCE CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Commerce', 'Arts', 'Technology')),
    color_token TEXT NOT NULL, -- e.g., 'indigo', 'pink', 'emerald', 'amber', 'cyan', 'purple'
    sort_order INT DEFAULT 0
);

-- 3. USER SUBJECTS (1 to 3 subjects tracked per user)
CREATE TABLE IF NOT EXISTS public.user_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, subject_id)
);

-- 4. SYLLABUS UNITS REFERENCE TABLE
CREATE TABLE IF NOT EXISTS public.syllabus_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    hours INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. UNIT PROGRESS (Per-user checklist status)
CREATE TABLE IF NOT EXISTS public.unit_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.syllabus_units(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, unit_id)
);

-- 6. MARKS (Exam & paper scores 0-100)
CREATE TABLE IF NOT EXISTS public.marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    paper_type TEXT NOT NULL CHECK (paper_type IN ('MCQ', 'Essay', 'Structured', 'Term Test', 'Full Paper')),
    score NUMERIC(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
    exam_date DATE NOT NULL DEFAULT CURRENT_DATE,
    unit TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TIMETABLE SLOTS (Weekly class & study slots 0=Mon ... 6=Sun)
CREATE TABLE IF NOT EXISTS public.slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
    start_time TEXT NOT NULL, -- e.g. "08:00" or "08:00 pm"
    end_time TEXT NOT NULL,   -- e.g. "10:00" or "10:00 pm"
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Class', -- Class, Tuition, Self Study, Revision
    room_or_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TODOS / HOMEWORK (Daily tasks & homework with countdown)
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    is_homework BOOLEAN DEFAULT TRUE,
    attachment_label TEXT DEFAULT 'Attachment',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Subjects & Syllabus units are readable by all authenticated users
CREATE POLICY "Subjects are viewable by all users" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Syllabus units are viewable by all users" ON public.syllabus_units FOR SELECT USING (true);

-- User Profiles: users can select, update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Subjects
CREATE POLICY "Users can view own subjects" ON public.user_subjects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subjects" ON public.user_subjects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own subjects" ON public.user_subjects FOR DELETE USING (auth.uid() = user_id);

-- Unit Progress
CREATE POLICY "Users can view own unit progress" ON public.unit_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own unit progress" ON public.unit_progress FOR ALL USING (auth.uid() = user_id);

-- Marks
CREATE POLICY "Users can view own marks" ON public.marks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own marks" ON public.marks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own marks" ON public.marks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own marks" ON public.marks FOR DELETE USING (auth.uid() = user_id);

-- Slots (Timetable)
CREATE POLICY "Users can view own slots" ON public.slots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own slots" ON public.slots FOR ALL USING (auth.uid() = user_id);

-- Todos (Homework)
CREATE POLICY "Users can view own todos" ON public.todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own todos" ON public.todos FOR ALL USING (auth.uid() = user_id);

-- Trigger to create profile when auth.users signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, stream, theme_preference)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'A/L Student'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    COALESCE(new.raw_user_meta_data->>'stream', 'Science'),
    'dark'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- SEED DATA: Standard Sri Lankan GCE A/L Subjects & Units
-- ==============================================================================

-- Science Stream Subjects
INSERT INTO public.subjects (code, name, stream, color_token, sort_order) VALUES
('CMATH', 'Combined Mathematics', 'Science', '#6366f1', 1),
('PHYS', 'Physics', 'Science', '#ec4899', 2),
('CHEM', 'Chemistry', 'Science', '#06b6d4', 3),
('BIO', 'Biology', 'Science', '#10b981', 4),
('AGRI', 'Agriculture', 'Science', '#84cc16', 5)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, color_token = EXCLUDED.color_token;

-- Commerce Stream Subjects
INSERT INTO public.subjects (code, name, stream, color_token, sort_order) VALUES
('ECON', 'Economics', 'Commerce', '#3b82f6', 6),
('BST', 'Business Studies', 'Commerce', '#f59e0b', 7),
('ACC', 'Accounting', 'Commerce', '#8b5cf6', 8),
('BSTAT', 'Business Statistics', 'Commerce', '#14b8a6', 9),
('ICT_C', 'Information Technology (Commerce)', 'Commerce', '#6366f1', 10)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, color_token = EXCLUDED.color_token;

-- Arts Stream Subjects
INSERT INTO public.subjects (code, name, stream, color_token, sort_order) VALUES
('SINH', 'Sinhala', 'Arts', '#d97706', 11),
('ENG', 'English', 'Arts', '#2563eb', 12),
('HIST', 'History', 'Arts', '#b45309', 13),
('GEOG', 'Geography', 'Arts', '#059669', 14),
('POL', 'Political Science', 'Arts', '#dc2626', 15),
('LOGIC', 'Logic & Scientific Method', 'Arts', '#7c3aed', 16),
('MEDIA', 'Media Studies', 'Arts', '#db2777', 17)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, color_token = EXCLUDED.color_token;

-- Technology Stream Subjects
INSERT INTO public.subjects (code, name, stream, color_token, sort_order) VALUES
('ETEC', 'Engineering Technology (ET)', 'Technology', '#ea580c', 18),
('BSTEC', 'Bio-Systems Technology (BST)', 'Technology', '#16a34a', 19),
('SFT', 'Science for Technology (SFT)', 'Technology', '#0284c7', 20),
('ICT_T', 'Information Technology (Tech)', 'Technology', '#6366f1', 21)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, color_token = EXCLUDED.color_token;

-- Sample Syllabus Units for Physics
INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 1, 'Measurement & Units', 'Physical quantities, dimensions, error analysis and measurement instruments', 16
FROM public.subjects WHERE code = 'PHYS'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 2, 'Mechanics', 'Kinematics, Newton laws, circular motion, gravitation, hydrostatics, surface tension', 55
FROM public.subjects WHERE code = 'PHYS'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 3, 'Oscillations & Waves', 'Simple harmonic motion, sound waves, Doppler effect, resonance, acoustics', 40
FROM public.subjects WHERE code = 'PHYS'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 4, 'Thermal Physics', 'Thermometry, thermal expansion, gas laws, thermodynamics, heat transfer', 35
FROM public.subjects WHERE code = 'PHYS'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 5, 'Gravitational & Electrostatic Fields', 'Coulomb law, field strength, electric potential, capacitors', 30
FROM public.subjects WHERE code = 'PHYS'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 6, 'Current Electricity', 'Kirchhoff laws, potentiometer, Wheatstone bridge, electrical measurements', 45
FROM public.subjects WHERE code = 'PHYS'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 7, 'Electronics', 'Semiconductors, diodes, transistors, operational amplifiers, digital logic', 30
FROM public.subjects WHERE code = 'PHYS'
ON CONFLICT DO NOTHING;

-- Sample Syllabus Units for Combined Mathematics
INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 1, 'Real Numbers & Functions', 'Number sets, algebraic manipulations, polynomials, inequalities', 25
FROM public.subjects WHERE code = 'CMATH'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 2, 'Quadratic Equations & Roots', 'Theory of quadratic equations, roots analysis, maximum & minimum', 20
FROM public.subjects WHERE code = 'CMATH'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 3, 'Trigonometry', 'Trigonometric identities, compound angles, equations, solution of triangles', 45
FROM public.subjects WHERE code = 'CMATH'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 4, 'Differentiation & Calculus', 'Limits, derivatives, tangents, rates of change, curve sketching, optimization', 50
FROM public.subjects WHERE code = 'CMATH'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 5, 'Integration', 'Indefinite & definite integrals, substitution, integration by parts, area', 45
FROM public.subjects WHERE code = 'CMATH'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 6, 'Statics & Coplanar Forces', 'Equilibrium of rigid bodies, friction, center of gravity, frameworks', 50
FROM public.subjects WHERE code = 'CMATH'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 7, 'Dynamics & Projectiles', 'Rectilinear motion, projectiles, Newton laws, momentum, energy & power', 55
FROM public.subjects WHERE code = 'CMATH'
ON CONFLICT DO NOTHING;

-- Sample Syllabus Units for Chemistry
INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 1, 'Atomic Structure', 'Subatomic particles, electromagnetic radiation, Bohr theory, quantum numbers', 20
FROM public.subjects WHERE code = 'CHEM'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 2, 'Chemical Bonding & Structure', 'Ionic, covalent, metallic bonding, VSEPR theory, intermolecular forces', 30
FROM public.subjects WHERE code = 'CHEM'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 3, 'Chemical Calculations & Energetics', 'Mole concept, stoichiometry, enthalpy changes, Hess law, Born-Haber cycle', 35
FROM public.subjects WHERE code = 'CHEM'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 4, 'Inorganic Chemistry (s, p, d block)', 'Periodic trends, reactions of groups 1, 2, 13-17, transition metals', 60
FROM public.subjects WHERE code = 'CHEM'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 5, 'Organic Chemistry', 'Hydrocarbons, alkyl halides, alcohols, carbonyls, carboxylic acids, amines', 75
FROM public.subjects WHERE code = 'CHEM'
ON CONFLICT DO NOTHING;

INSERT INTO public.syllabus_units (subject_id, unit_number, title, description, hours)
SELECT id, 6, 'Equilibria & Kinetics', 'Chemical & ionic equilibria, pH, buffers, reaction rates, catalysts', 45
FROM public.subjects WHERE code = 'CHEM'
ON CONFLICT DO NOTHING;
