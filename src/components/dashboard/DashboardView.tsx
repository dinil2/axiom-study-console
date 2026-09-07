import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  ChevronDown,
  Paperclip,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  BookOpen
} from 'lucide-react';
import { AddClassModal } from '../modals/AddClassModal';
import { AddHomeworkModal } from '../modals/AddHomeworkModal';

interface Props {
  onSeeAllHomework: () => void;
}

export const DashboardView: React.FC<Props> = ({ onSeeAllHomework }) => {
  const {
    selectedSubjects,
    slots,
    todos,
    marks,
    unitProgress,
    toggleTodo
  } = useAuth();

  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddHomeworkOpen, setIsAddHomeworkOpen] = useState(false);
  const [showManageDropdown, setShowManageDropdown] = useState(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate stats
  const totalCompletedUnits = Object.values(unitProgress).filter(Boolean).length;
  const avgScore = marks.length > 0
    ? `${Math.round(marks.reduce((acc, m) => acc + m.score, 0) / marks.length)}%`
    : '—';

  // Filter homework tasks
  const homeworkList = todos.filter(t => t.is_homework);

  return (
    <div className="space-y-6">
      
      {/* Top Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      >
        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Marks</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{avgScore}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed Units</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{totalCompletedUnits} Units</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Subjects</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{selectedSubjects.length} Tracked</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Tasks</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{homeworkList.filter(t => !t.completed).length} Due</h4>
          </div>
        </div>
      </motion.div>

      {/* Main Two-Column Layout (Matching Image 1: Classes on Left, Homework on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Middle: Classes Schedule (matching Image 1) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Header with Title and Action Buttons */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Classes
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddClassOpen(true)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <span>ADD CLASS</span>
                <Plus className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowManageDropdown(!showManageDropdown)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                >
                  <span>MANAGE</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {showManageDropdown && (
                  <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1 z-30 text-xs">
                    <button
                      onClick={() => { setIsAddClassOpen(true); setShowManageDropdown(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                    >
                      Schedule Class
                    </button>
                    <button
                      onClick={() => { onSeeAllHomework(); setShowManageDropdown(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                    >
                      View All Timetables
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Classes Cards List (matching Image 1: Bangla, Physics, Science, Geography) */}
          <div className="space-y-4">
            {selectedSubjects.map((subj, index) => {
              // Get slots for this subject
              const subjectSlots = slots.filter(s => s.subject_id === subj.id);

              return (
                <motion.div
                  key={subj.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm"
                >
                  {/* Subject Header with Notebook Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Stylized Notebook & Pencil Icon (matching Image 1) */}
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center p-2 shadow-sm border border-amber-100 dark:border-amber-900/30">
                      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                        {/* Book pages */}
                        <path d="M8 26C12 24 16 26 20 28C24 26 28 24 32 26V12C28 10 24 12 20 14C16 12 12 10 8 12V26Z" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5"/>
                        {/* Spine */}
                        <path d="M20 14V28" stroke="#ea580c" strokeWidth="1.5"/>
                        {/* Pencil */}
                        <path d="M28 8L31 11L18 24L15 21L28 8Z" fill="#f43f5e"/>
                        <path d="M15 21L13 26L18 24L15 21Z" fill="#fde047"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {subj.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {subj.stream} Stream • {subjectSlots.length} weekly sessions
                      </span>
                    </div>
                  </div>

                  {/* 7-Day Timeline Bar (Mon - Sun) matching Image 1 */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    
                    {/* Time Slot Indicators Banner */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5 relative mb-2">
                      {daysOfWeek.map((day, dIdx) => {
                        const daySlots = subjectSlots.filter(s => s.day_of_week === dIdx);
                        const hasSlot = daySlots.length > 0;
                        const firstSlot = daySlots[0];

                        return (
                          <div key={dIdx} className="flex flex-col items-center">
                            {hasSlot ? (
                              <div
                                className="w-full py-1.5 px-1 rounded-md text-[10px] sm:text-[11px] font-semibold text-center text-white truncate shadow-xs cursor-pointer hover:brightness-110 transition"
                                style={{ backgroundColor: subj.color_token }}
                                title={`${firstSlot.title} (${firstSlot.start_time} - ${firstSlot.end_time})`}
                              >
                                <span className="hidden sm:inline">{firstSlot.start_time} - {firstSlot.end_time}</span>
                                <span className="sm:hidden">{firstSlot.start_time.split(' ')[0]}</span>
                              </div>
                            ) : (
                              <div className="w-full py-1.5 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200/60 dark:border-slate-800 text-[10px] text-center text-transparent">
                                -
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Day labels Mon ... Sun */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {daysOfWeek.map(day => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Right: Homework Section & Go Premium Card (matching Image 1) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Header with Title and SEE ALL Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Homework
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAddHomeworkOpen(true)}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-600 hover:text-indigo-600 text-xs shadow-sm"
                title="Add Homework"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onSeeAllHomework}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                SEE ALL &gt;
              </button>
            </div>
          </div>

          {/* Homework Cards List */}
          <div className="space-y-3">
            {homeworkList.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No tasks due today</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Add tuition exercises, past papers, or chapter questions to track your deadlines.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddHomeworkOpen(true)}
                  className="mt-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Task</span>
                </button>
              </div>
            ) : (
              homeworkList.slice(0, 5).map((item, idx) => {
                const subj = selectedSubjects.find(s => s.id === item.subject_id) || selectedSubjects[0];

                // Calculate days left display
                const dueDate = new Date(item.due_date);
                const today = new Date();
                const diffTime = dueDate.getTime() - today.getTime();
                const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                const daysLeftStr = diffDays < 10 ? `0${diffDays} Days left` : `${diffDays} Days left`;

                const formattedDate = dueDate.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-3 ${
                      item.completed ? 'opacity-60 bg-slate-50/70 dark:bg-slate-900/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTodo(item.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 cursor-pointer ${
                          item.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                        }`}
                      >
                        {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="space-y-2 min-w-0 flex-1">
                        <h4 className={`text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                          {item.title}
                        </h4>

                        {/* Attachment & Subject Tags */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.attachment_label && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                              <Paperclip className="w-2.5 h-2.5" />
                              {item.attachment_label}
                            </span>
                          )}
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white truncate max-w-[120px]"
                            style={{ backgroundColor: subj?.color_token || '#6366f1' }}
                          >
                            {subj?.name || 'Subject'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Days left & Formatted Date */}
                    <div className="text-right shrink-0">
                      <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {daysLeftStr}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">
                        {formattedDate}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* "Go Premium!" Pastel Banner Card (Matching Image 1) */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden relative flex items-center justify-between min-h-[160px]">
            <div className="space-y-2 max-w-[60%] z-10">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Go Premium !
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Get more themes & no ads
              </p>
              <button
                type="button"
                onClick={() => alert("Axiom Pro: Complete past paper archives, island-wide ranking benchmarks, and unlimited cloud synchronization unlocked!")}
                className="mt-3 px-5 py-2 rounded-xl bg-[#8b8cf7] hover:bg-[#7a7be8] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition hover:scale-105 active:scale-95"
              >
                SEE PRICING
              </button>
            </div>

            {/* Pastel Notebook & Pen Illustration (matching Image 1) */}
            <div className="absolute -right-2 -bottom-2 w-36 sm:w-44 h-full pointer-events-none flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
                {/* Yellow List Notes Notebook */}
                <rect x="20" y="20" width="70" height="90" rx="6" fill="#facc15" transform="rotate(-10 20 20)"/>
                <text x="35" y="45" fill="#ffffff" fontSize="9" fontWeight="bold" transform="rotate(-10 20 20)">LISTS</text>
                <text x="35" y="56" fill="#ffffff" fontSize="9" fontWeight="bold" transform="rotate(-10 20 20)">NOTES</text>

                {/* Mint Polka Dot Notebook */}
                <rect x="45" y="40" width="75" height="95" rx="8" fill="#6ee7b7" transform="rotate(8 45 40)" stroke="#34d399" strokeWidth="2"/>
                {/* Polka Dots */}
                <circle cx="65" cy="65" r="4" fill="#ffffff" opacity="0.8" />
                <circle cx="85" cy="65" r="4" fill="#ffffff" opacity="0.8" />
                <circle cx="105" cy="65" r="4" fill="#ffffff" opacity="0.8" />
                <circle cx="75" cy="85" r="4" fill="#ffffff" opacity="0.8" />
                <circle cx="95" cy="85" r="4" fill="#ffffff" opacity="0.8" />
                <circle cx="65" cy="105" r="4" fill="#ffffff" opacity="0.8" />
                <circle cx="85" cy="105" r="4" fill="#ffffff" opacity="0.8" />
                <circle cx="105" cy="105" r="4" fill="#ffffff" opacity="0.8" />

                {/* Teal Pen */}
                <rect x="120" y="30" width="6" height="85" rx="3" fill="#2dd4bf" transform="rotate(15 120 30)"/>
                <path d="M120 115 L123 125 L126 115 Z" fill="#0f766e" transform="rotate(15 120 30)"/>
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <AddClassModal isOpen={isAddClassOpen} onClose={() => setIsAddClassOpen(false)} />
      <AddHomeworkModal isOpen={isAddHomeworkOpen} onClose={() => setIsAddHomeworkOpen(false)} />

    </div>
  );
};
