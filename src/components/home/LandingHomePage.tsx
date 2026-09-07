import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  BookOpen,
  TrendingUp,
  Sun,
  Moon,
  ShieldCheck,
  ChevronRight,
  Layers,
  GraduationCap,
  Clock,
  CheckSquare,
  ChevronDown,
  HelpCircle,
  BarChart3,
  Target,
  Menu,
  X
} from 'lucide-react';
import { ALStream } from '../../types';
import { ALL_SUBJECTS } from '../../lib/mockData';

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreDemo: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const LandingHomePage: React.FC<Props> = ({
  onGetStarted,
  onSignIn,
  onExploreDemo,
  theme,
  toggleTheme
}) => {
  const [activeStream, setActiveStream] = useState<ALStream>('Science');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const streamSubjects = ALL_SUBJECTS.filter(s => s.stream === activeStream);

  const faqs = [
    {
      q: "How does Axiom help me analyze Sri Lankan level papers?",
      a: "Axiom provides a specialized paper marks diagnostic engine. After completing any Sri Lankan GCE A/L past paper, model paper, or school term test (MCQ, Structured, or Essay), you log your scores and target unit. Axiom calculates your score trajectory, highlights your highest performing areas, and pinpoints weak units requiring urgent revision before the national exam."
    },
    {
      q: "Which Sri Lankan GCE A/L streams and subjects are supported?",
      a: "Axiom supports all four national streams: Physical & Bio Science (Combined Mathematics, Physics, Chemistry, Biology, Agriculture), Commerce (Economics, Business Studies, Accounting, Business Statistics, ICT), Arts & Humanities (Sinhala, English, History, Geography, Logic, Political Science, Media), and Technology (Engineering Technology, Bio-Systems Technology, Science for Technology, ICT)."
    },
    {
      q: "How does paper analysis improve my A/L exam Z-Score?",
      a: "The Sri Lankan Z-score system standardizes marks across subjects and districts. Maximizing your Z-score requires eliminating blind spots. By tracking past paper marks systematically, you discover precisely which questions or theoretical units drag your score down, allowing targeted practice on past paper questions."
    },
    {
      q: "Can I customize syllabus units according to my teacher or school pace?",
      a: "Yes! Axiom comes pre-loaded with comprehensive unit outlines aligned with the National Institute of Education (NIE) Sri Lanka. You can easily add custom units, sub-units, or special revision topics to match your school or tuition class progress."
    },
    {
      q: "Is Axiom free for all Sri Lankan Advanced Level students?",
      a: "Yes, Axiom is completely free to use. Create an account, pick your three subjects, and start organizing your A/L journey with cloud backup on any phone, tablet, or laptop."
    }
  ];

  const streams: { id: ALStream; label: string; desc: string; icon: string }[] = [
    { id: 'Science', label: 'Physical & Bio Science', desc: 'Combined Maths, Physics, Chemistry, Biology & Agriculture', icon: '🧬' },
    { id: 'Commerce', label: 'Commerce', desc: 'Economics, Business Studies, Accounting, Statistics & ICT', icon: '📊' },
    { id: 'Arts', label: 'Arts & Humanities', desc: 'Languages, History, Political Science, Logic, Geography & Media', icon: '🏛️' },
    { id: 'Technology', label: 'Technology', desc: 'Engineering Tech, Bio-Systems Tech, Science for Tech & ICT', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-[#0b0f19]/90 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
              <span className="font-extrabold text-base sm:text-lg tracking-wider">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">AXIOM</span>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  A/L Console
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block">
                Sri Lankan GCE Advanced Level
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links for SEO */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#paper-analyze" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Paper Analyze</a>
            <a href="#streams" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">A/L Streams</a>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Features</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">FAQs</a>
          </nav>

          {/* Navigation Items & CTA Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Theme Toggle Button */}
            <div className="p-0.5 sm:p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center">
              <button
                type="button"
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-1.5 rounded-lg transition min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Light Theme"
                aria-label="Light Theme"
              >
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
              </button>
              <button
                type="button"
                onClick={() => theme === 'light' && toggleTheme()}
                className={`p-1.5 rounded-lg transition min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#1e293b] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Switch to Dark Theme"
                aria-label="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
              </button>
            </div>

            {/* Sign In Button (Visible on desktop & tablet, hidden on very small phones where menu is used) */}
            <button
              onClick={onSignIn}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer min-h-[40px] items-center"
            >
              Sign In
            </button>

            {/* Launch Console CTA */}
            <button
              onClick={onGetStarted}
              className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 transition active:scale-95 flex items-center gap-1.5 sm:gap-2 cursor-pointer min-h-[40px]"
            >
              <span className="hidden sm:inline">Launch Console</span>
              <span className="sm:hidden">Launch</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl px-4 py-5 space-y-4"
            >
              <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <a
                  href="#paper-analyze"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  <span>Paper Analyze Engine</span>
                </a>
                <a
                  href="#streams"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>A/L Streams &amp; Subjects</span>
                </a>
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Features</span>
                </a>
                <a
                  href="#faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  <span>Frequently Asked Questions</span>
                </a>
              </nav>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSignIn();
                  }}
                  className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition text-center cursor-pointer min-h-[44px]"
                >
                  Sign In to Account
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGetStarted();
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition text-center cursor-pointer min-h-[44px]"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onExploreDemo();
                  }}
                  className="w-full py-2.5 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-semibold text-center cursor-pointer"
                >
                  ✨ Explore Live Demo Console
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-20 pb-12 sm:pb-24">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5 sm:space-y-8">
          
          {/* Stream Tag Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-300 text-[11px] sm:text-xs font-bold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Sri Lankan GCE A/L Study Console</span>
          </motion.div>

          {/* Main Headline for Search Ranking */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.2] sm:leading-tight"
          >
            Sri Lankan A/L Study Console &amp;{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Paper Analyze Engine.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-1"
          >
            The private study workspace designed for Sri Lankan GCE Advanced Level students. Analyze past papers, pinpoint weak syllabus units, organize weekly theory & tuition schedules, and boost your Z-score across all 4 streams.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 w-full max-w-sm sm:max-w-none mx-auto"
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Explore Live Demo</span>
            </button>
          </motion.div>

          {/* Trust badges */}
          <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-8 text-[11px] sm:text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-100/70 dark:bg-slate-800/40 sm:bg-transparent px-2.5 py-1 rounded-full sm:p-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Science · Commerce · Arts · Tech
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100/70 dark:bg-slate-800/40 sm:bg-transparent px-2.5 py-1 rounded-full sm:p-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Editable Syllabus Units
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100/70 dark:bg-slate-800/40 sm:bg-transparent px-2.5 py-1 rounded-full sm:p-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Supabase Cloud Sync
            </span>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE 4-STREAM DEMO PREVIEW */}
      <section id="streams" className="py-12 bg-white/50 dark:bg-[#0e1422]/50 border-y border-slate-200/80 dark:border-slate-800/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Select Your Sri Lankan A/L Stream &amp; Curriculum
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Axiom adapts instantly to your subject combination with custom color tokens and unit outlines.
            </p>
          </div>

          {/* Stream Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {streams.map((s) => {
              const isSelected = activeStream === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStream(s.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500 dark:border-indigo-400 shadow-md'
                      : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{s.icon}</div>
                  <h4 className={`text-sm font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                    {s.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {s.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Stream Subject Showcase Card */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {activeStream} Catalog
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Subjects Available for Tracking
                </h3>
              </div>
              <button
                onClick={onGetStarted}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Track This Stream</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Subject Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-6">
              {streamSubjects.map((subj) => (
                <div
                  key={subj.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#131d31] flex items-center gap-3 hover:shadow-md transition"
                >
                  <div
                    className="w-4 h-10 rounded-lg shrink-0"
                    style={{ backgroundColor: subj.color_token }}
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-500 uppercase">
                      {subj.code}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {subj.name}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. CORE FEATURES SHOWCASE */}
      <section id="features" className="py-16 sm:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineered Around the Real Sri Lankan GCE A/L Experience
            </h2>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300">
              Everything you need to eliminate distraction, analyze past paper performance, stay accountable, and systematically complete your syllabus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Feature 1: Timetable & Homework */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Weekly Timetable &amp; Tuition Planner
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Map theory classes, revision sessions, tuition slots, and paper discussions from Mon–Sun with countdowns on homework tasks.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#131d31] border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <span>Priority tags &amp; daily todos</span>
              </div>
            </div>

            {/* Feature 2: Marks & Analytics */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Past Paper Marks &amp; Diagnostics
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Log scores across MCQ, Structured, Essay, and Term tests. Identify strongest vs weakest units automatically to focus your revision.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#131d31] border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <span>Trend charts &amp; unit weak spots</span>
              </div>
            </div>

            {/* Feature 3: Syllabus Mastery */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Interactive Syllabus Tracker
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Track every unit across your subjects, celebrate completed milestones with confetti, and easily add custom units as you progress.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#131d31] border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>+ Add custom units on the fly</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4.5 DEEP DIVE: SRI LANKAN LEVEL PAPER ANALYZE */}
      <section id="paper-analyze" className="py-16 bg-slate-50/70 dark:bg-[#0c121e]/80 border-y border-slate-200/80 dark:border-slate-800/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 text-xs font-bold">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Sri Lankan Level Paper Analyze</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Analyze Past Papers, Model Papers &amp; School Term Tests
            </h2>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300">
              Stop guessing where you lose marks. Axiom correlates every paper score with specific syllabus units so you can pinpoint and eliminate your exam weaknesses before exam day.
            </p>
          </div>

          {/* Visual Showcase of Paper Analysis */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Key capabilities */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Paper 1 (MCQ) &amp; Paper 2/3 (Essay &amp; Structured)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Log marks by paper type to track whether your time management on MCQs or theoretical depth on Essays needs refinement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Unit-by-Unit Diagnostic Engine
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Tag each paper with its relevant curriculum unit. Axiom calculates your average percentage per topic to highlight strong vs weak units automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Z-Score Trajectory &amp; Score Progression
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Visual line and bar charts map your performance over time across provincial papers, past papers (2015–2024), and school trials.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Paper Score Preview Card */}
            <div className="lg:col-span-6 bg-white dark:bg-[#111827] rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Paper Analyze Live Preview</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  Sri Lankan GCE A/L
                </span>
              </div>

              {/* Sample Past Paper Entries */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141e30] border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] sm:text-[10px] font-bold text-indigo-500 uppercase">MCQ Paper</span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">2023 Official GCE A/L Past Paper</h5>
                    <p className="text-[10px] text-slate-400 truncate">Target: Physical Chemistry</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-emerald-500">84%</span>
                    <p className="text-[10px] text-slate-400">42 / 50</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141e30] border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] sm:text-[10px] font-bold text-purple-500 uppercase">Essay &amp; Structured</span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">2024 Provincial Trial Examination</h5>
                    <p className="text-[10px] text-slate-400 truncate">Target: Mechanics &amp; Vectors</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-indigo-500">76%</span>
                    <p className="text-[10px] text-slate-400">76 / 100</p>
                  </div>
                </div>
              </div>

              {/* Diagnostic pill */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                  <span>Weakest Unit Detected</span>
                  <span>58% Avg</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Organic Chemistry Mechanism questions need attention before your next model test.
                </p>
              </div>

              <button
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>Start Analyzing Your Own Papers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4.8 FREQUENTLY ASKED QUESTIONS (FAQ) FOR GOOGLE SEO & RICH SNIPPETS */}
      <section id="faq" className="py-12 sm:py-24 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          
          <div className="text-center space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-[11px] sm:text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Answers for Sri Lankan A/L Students</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Everything you need to know about tracking Sri Lankan level papers, curriculum units, and your daily study routine.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer min-h-[48px]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed bg-slate-50/50 dark:bg-[#0c121e]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="py-12 sm:py-16 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Control of Your A/L Exam Journey?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto">
            Whether you are targeting university entrance in Medicine, Engineering, Management, Law, or Technology, Axiom keeps your preparation structured.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm shadow-xl transition active:scale-95 cursor-pointer"
            >
              Create Free Student Account
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-800/60 hover:bg-indigo-800 border border-indigo-700 text-white font-bold text-sm shadow-sm transition active:scale-95 cursor-pointer"
            >
              Launch Live Demo Console
            </button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="mt-auto py-10 bg-white dark:bg-[#080d16] border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                A
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">AXIOM Study Console</span>
              <span>• Sri Lankan GCE A/L</span>
            </div>

            {/* Footer quick links for internal search engine linking */}
            <div className="flex flex-wrap justify-center gap-4 text-[11px] font-medium text-slate-500">
              <a href="#paper-analyze" className="hover:text-indigo-500">Paper Analyze</a>
              <a href="#streams" className="hover:text-indigo-500">A/L Streams</a>
              <a href="#features" className="hover:text-indigo-500">Features</a>
              <a href="#faq" className="hover:text-indigo-500">FAQs</a>
              <a href="/sitemap.xml" className="hover:text-indigo-500" target="_blank" rel="noopener noreferrer">Sitemap</a>
            </div>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Axiom Education Systems. Built with precision for Sri Lankan GCE Advanced Level students.</p>
            <p>Designed for Science, Commerce, Arts &amp; Technology Streams.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
