import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  CheckCircle2,
  Circle,
  Paperclip,
  Calendar,
  Trash2,
  Filter,
  CheckSquare,
  Clock,
  AlertCircle
} from 'lucide-react';
import { AddHomeworkModal } from '../modals/AddHomeworkModal';

export const HomeworkView: React.FC = () => {
  const { selectedSubjects, todos, toggleTodo, deleteTodo } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Filter tasks (consider all items or items tagged homework)
  const homeworkItems = todos.filter(t => t.is_homework !== false);

  const filteredList = homeworkItems.filter(item => {
    if (filterSubject !== 'all' && item.subject_id !== filterSubject) return false;
    if (filterStatus === 'pending' && item.completed) return false;
    if (filterStatus === 'completed' && !item.completed) return false;
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
    return true;
  });

  const pendingCount = homeworkItems.filter(t => !t.completed).length;
  const completedCount = homeworkItems.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER & ACTION BAR */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Assignment & Task Studio
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Homework & Tasks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your daily problem sets, tuition question packs, and theory revisions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Homework</span>
        </button>
      </div>

      {/* 2. STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{homeworkItems.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending Due</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{pendingCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{completedCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
            <Paperclip className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">With Attachments</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {homeworkItems.filter(t => t.attachment_label).length}
            </h4>
          </div>
        </div>
      </div>

      {/* 3. FILTERS BAR */}
      <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {selectedSubjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Only</option>
            <option value="completed">Completed Only</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          Showing {filteredList.length} of {homeworkItems.length} items
        </span>
      </div>

      {/* 4. HOMEWORK LIST */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">No homework tasks found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No tasks matched your current filter criteria or none have been assigned yet.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition cursor-pointer"
            >
              + Create New Task
            </button>
          </div>
        ) : (
          filteredList.map((item, idx) => {
            const subj = selectedSubjects.find(s => s.id === item.subject_id) || selectedSubjects[0];

            // Calculate days left
            const dueDate = new Date(item.due_date);
            const today = new Date();
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            const daysLeftStr = diffDays === 1 ? '1 Day left' : `${diffDays} Days left`;

            const formattedDate = dueDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-4 ${
                  item.completed ? 'opacity-65 bg-slate-50/60 dark:bg-slate-900/40' : ''
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleTodo(item.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 cursor-pointer ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="space-y-2 min-w-0 flex-1">
                    <h4 className={`text-sm font-bold text-slate-900 dark:text-white leading-snug ${
                      item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}>
                      {item.title}
                    </h4>

                    {/* Metadata badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs"
                        style={{ backgroundColor: subj?.color_token || '#6366f1' }}
                      >
                        {subj?.name || 'Subject'}
                      </span>

                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : item.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {item.priority} Priority
                      </span>

                      {item.attachment_label && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                          <Paperclip className="w-2.5 h-2.5" />
                          {item.attachment_label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Days left countdown & Delete */}
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <span className={`block text-xs font-bold ${
                      diffDays <= 2
                        ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                        : diffDays <= 7
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}>
                      {daysLeftStr}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {formattedDate}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTodo(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                    title="Delete homework task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <AddHomeworkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

    </div>
  );
};
