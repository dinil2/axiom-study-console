import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  onBackToHome?: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBackToHome, initialMode = 'login' }) => {
  const { login, signup, loginWithGoogle, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === 'signup');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Sync mode if initialMode prop changes
  React.useEffect(() => {
    if (initialMode) {
      setIsSignUp(initialMode === 'signup');
    }
  }, [initialMode]);

  const slides = [
    {
      title: "Make your work easier and organized with Axiom",
      subtitle: "The all-in-one private study console for Sri Lankan GCE A/L students across all 4 streams."
    },
    {
      title: "Track syllabus completion and past paper marks",
      subtitle: "Visualize your progress from day one to the national examination."
    },
    {
      title: "Balance tuition, self-study and homework seamlessly",
      subtitle: "Keep your daily schedule and countdown timers under complete control."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isSignUp) {
      const res = await signup(email, name, password);
      if (res.error) setErrorMessage(res.error);
    } else {
      const res = await login(email, password);
      if (res.error) setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-5xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0 sm:min-h-[640px]">
        
        {/* Left Panel: Auth Form (Mobile optimized) */}
        <div className="lg:col-span-6 p-5 sm:p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Top Bar: Back Link & Brand */}
            <div className="flex items-center justify-between mb-5">
              {onBackToHome ? (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1.5 py-1.5 px-2 -ml-2 rounded-lg text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition cursor-pointer min-h-[38px]"
                >
                  <span>← Back to Homepage</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-sm">
                  A
                </div>
                <span className="font-extrabold text-sm tracking-tight">AXIOM</span>
              </div>
            </div>

            {/* Segmented Switcher for Phone/Tablet */}
            <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-6 border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[38px] ${
                  !isSignUp
                    ? 'bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[38px] ${
                  isSignUp
                    ? 'bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Title & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              key={isSignUp ? 'signup-header' : 'login-header'}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 text-slate-950 dark:text-white">
                {isSignUp ? 'Create your account' : 'Welcome back!'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                {isSignUp
                  ? 'Get started with your free Sri Lankan GCE A/L study console.'
                  : 'Log in to your study console and resume tracking your papers.'}
              </p>
            </motion.div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-300 text-base sm:text-sm transition-all min-h-[48px]"
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username or email"
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-300 text-base sm:text-sm transition-all min-h-[48px]"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 pr-12 rounded-2xl sm:rounded-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-300 text-base sm:text-sm transition-all min-h-[48px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none p-2 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {!isSignUp && (
                <div className="flex justify-end pt-0.5">
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link will be sent to your registered email."); }} className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl sm:rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60 min-h-[48px]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Register now' : 'Login'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-[#111827] text-slate-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={loginWithGoogle}
                title="Continue with Google"
                className="w-12 h-12 rounded-full bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm min-w-[48px] min-h-[48px] cursor-pointer"
              >
                <span className="font-bold text-base font-serif">G</span>
              </button>
              <button
                type="button"
                onClick={loginWithGoogle}
                title="Continue with Apple"
                className="w-12 h-12 rounded-full bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm min-w-[48px] min-h-[48px] cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.05-.03.07-.42 1.44-1.38 2.82M15.97 6.45c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.03.62-2.67 1.37-.56.64-1.06 1.7-0.93 2.72 1.04.08 2.08-.53 2.68-1.24z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={loginWithGoogle}
                title="Continue with Facebook"
                className="w-12 h-12 rounded-full bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm min-w-[48px] min-h-[48px] cursor-pointer"
              >
                <span className="font-bold text-base font-serif">f</span>
              </button>
            </div>
          </div>

          {/* Switch between Sign In / Sign Up */}
          <div className="text-center pt-6 text-xs text-slate-500 dark:text-slate-400">
            {isSignUp ? (
              <span>
                Already a member?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-1 cursor-pointer"
                >
                  Log in
                </button>
              </span>
            ) : (
              <span>
                Not a member?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-1 cursor-pointer"
                >
                  Register now
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Right Panel: Animated Illustration (Hidden on mobile screens < lg for focused, clean mobile ergonomics) */}
        <div className="hidden lg:flex lg:col-span-6 bg-[#f0f9f3] dark:bg-[#0c1f17] p-8 sm:p-12 flex-col justify-between relative overflow-hidden border-l border-emerald-100/60 dark:border-emerald-950/40">
          
          {/* Subtle Ambient Background circles */}
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-emerald-200/40 dark:bg-emerald-800/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-teal-200/40 dark:bg-teal-800/10 blur-3xl pointer-events-none" />

          {/* Central Animated Illustration Area */}
          <div className="my-auto relative flex flex-col items-center justify-center py-6">
            
            {/* Orbiting Avatar Badges */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 left-8 sm:left-12 z-20"
            >
              <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-emerald-100 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-24 right-4 sm:right-8 z-20"
            >
              <div className="w-11 h-11 rounded-full border-2 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-pink-100 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Floating Task Card (Matching Image 2: "Canva Design / 10 Task / 84% ring / Design tag") */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 0.5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-2 -left-2 sm:left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-emerald-100 dark:border-emerald-900/50 w-48 sm:w-52"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">Combined Maths</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">10 Revision Tasks</p>
                </div>
                {/* 84% Circular Progress Ring (matching Image 2) */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="w-10 h-10 -rotate-90">
                    <circle cx="20" cy="20" r="15" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="3" fill="none" />
                    <circle
                      cx="20"
                      cy="20"
                      r="15"
                      className="stroke-emerald-500"
                      strokeWidth="3"
                      strokeDasharray="94.2"
                      strokeDashoffset="15"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-bold text-emerald-600 dark:text-emerald-400">84%</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                  Calculus
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> On Track
                </span>
              </div>
            </motion.div>

            {/* Meditating Student Illustration (Stylized SVG matching Image 2 character & cloud loop) */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              
              {/* Looping Cloud Thought thread */}
              <motion.svg
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 260 260"
                fill="none"
              >
                <path
                  d="M40 100 C 30 50, 80 20, 130 25 C 180 15, 230 50, 220 100 C 235 150, 190 190, 150 190 C 130 230, 80 220, 50 180 C 20 150, 30 110, 40 100 Z"
                  stroke="#a7f3d0"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  className="dark:stroke-emerald-900/60"
                />
              </motion.svg>

              {/* Meditating Character with heart on sweater */}
              <motion.div
                animate={{ y: [0, -5, 0], scale: [1, 1.015, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 flex flex-col items-center"
              >
                <svg width="170" height="190" viewBox="0 0 170 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Hair */}
                  <path d="M60 42C60 25 72 15 85 15C98 15 110 25 110 42C118 42 124 50 120 62C116 74 112 80 108 85L62 85C58 80 54 74 50 62C46 50 52 42 60 42Z" fill="#1e293b"/>
                  
                  {/* Face */}
                  <circle cx="85" cy="46" r="19" fill="#fde68a" />
                  
                  {/* Closed peaceful eyes & smile */}
                  <path d="M78 46C79 48 81 48 82 46" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M88 46C89 48 91 48 92 46" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M82 53C84 55 86 55 88 53" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M75 50C76 50 78 51 78 52" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                  <path d="M92 50C93 50 95 51 95 52" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

                  {/* Mint Green Sweater Body */}
                  <path d="M55 78C62 70 108 70 115 78C125 90 128 115 125 125L45 125C42 115 45 90 55 78Z" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5"/>
                  
                  {/* Heart on chest (matching Image 2) */}
                  <path d="M85 96C85 96 76 89 76 83C76 79 79 77 82 77C84 77 85 79 85 79C85 79 86 77 88 77C91 77 94 79 94 83C94 89 85 96 85 96Z" fill="#ffffff" stroke="#059669" strokeWidth="1"/>

                  {/* Meditating Arms with Gyan Mudra hands */}
                  <path d="M52 82C38 95 30 108 40 120C46 128 55 120 58 115" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <path d="M118 82C132 95 140 108 130 120C124 128 115 120 112 115" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <circle cx="36" cy="112" r="6" fill="#fde68a" stroke="#059669" strokeWidth="1.2"/>
                  <circle cx="134" cy="112" r="6" fill="#fde68a" stroke="#059669" strokeWidth="1.2"/>

                  {/* Crossed Legs (Lotus/Sukhasana pose) */}
                  <path d="M30 135C30 125 45 125 60 125L110 125C125 125 140 125 140 135C140 148 120 155 85 155C50 155 30 148 30 135Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2"/>
                  {/* Feet */}
                  <ellipse cx="48" cy="144" rx="8" ry="5" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5"/>
                  <ellipse cx="122" cy="144" rx="8" ry="5" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5"/>
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Carousel Dots & Text (matching Image 2) */}
          <div className="pt-6 text-center">
            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`transition-all duration-300 rounded-full h-2 ${
                    activeSlide === idx
                      ? 'w-6 bg-slate-900 dark:bg-white'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Slide Title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="max-w-sm mx-auto"
              >
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                  {slides[activeSlide].title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  {slides[activeSlide].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};
