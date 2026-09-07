import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Plus, Award, TrendingUp, Filter, Trash2, Calendar, Target } from 'lucide-react';
import { AddMarkModal } from '../modals/AddMarkModal';

export const MarksAnalyticsView: React.FC = () => {
  const { selectedSubjects, marks, deleteMark, theme } = useAuth();
  const [isAddMarkOpen, setIsAddMarkOpen] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Filter marks
  const filteredMarks = filterSubject === 'all'
    ? marks
    : marks.filter(m => m.subject_id === filterSubject);

  // Prepare trend data
  const trendData = [...marks]
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
    .map(m => ({
      date: m.exam_date.slice(5),
      score: m.score,
      title: m.title
    }));

  // Prepare subject average data
  const subjectAverages = selectedSubjects.map(subj => {
    const subjMarks = marks.filter(m => m.subject_id === subj.id);
    const avg = subjMarks.length > 0
      ? Math.round(subjMarks.reduce((a, b) => a + b.score, 0) / subjMarks.length)
      : 0;
    return {
      name: subj.name.split(' ')[0],
      fullName: subj.name,
      avg,
      color: subj.color_token
    };
  });

  const chartStroke = theme === 'dark' ? '#334155' : '#e2e8f0';
  const textFill = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Marks & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your GCE A/L past paper scores, benchmark targets, and unit mastery.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddMarkOpen(true)}
          className="px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Past Paper</span>
        </button>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Trend Line Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Performance Trajectory</h3>
            </div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
              Target: 75%+ (Island Rank)
            </span>
          </div>

          <div className="h-64 w-full">
            {trendData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-2">
                <TrendingUp className="w-8 h-8 text-slate-400 opacity-60" />
                <p className="font-bold text-xs text-slate-700 dark:text-slate-300">No score trajectory yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Log your MCQ, Structured, or Essay scores to plot your progress over time.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                  <XAxis dataKey="date" stroke={textFill} fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke={textFill} fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                      borderColor: chartStroke,
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#6366f1' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Per-Subject Average Bar Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Subject Mastery Averages</h3>
          </div>

          <div className="h-64 w-full">
            {marks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-2">
                <Award className="w-8 h-8 text-slate-400 opacity-60" />
                <p className="font-bold text-xs text-slate-700 dark:text-slate-300">No subject averages yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Your average marks across your 3 tracked subjects will appear here automatically.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectAverages}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                  <XAxis dataKey="name" stroke={textFill} fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke={textFill} fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                      borderColor: chartStroke,
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                    {subjectAverages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Marks History Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recorded Evaluations</h3>
            <p className="text-xs text-slate-400">Total papers logged: {filteredMarks.length}</p>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {selectedSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Subject</th>
                <th className="pb-3 px-3">Paper / Exam Title</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Score</th>
                <th className="pb-3 px-3">Unit / Notes</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredMarks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="space-y-2 max-w-sm mx-auto">
                      <Award className="w-8 h-8 text-slate-400 mx-auto opacity-70" />
                      <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                        No past paper evaluations recorded yet
                      </p>
                      <p className="text-xs text-slate-400">
                        Tap "Log Past Paper" above to start tracking your exam scores and syllabus mastery.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMarks.map(mark => {
                  const subj = selectedSubjects.find(s => s.id === mark.subject_id) || selectedSubjects[0];
                  return (
                    <tr key={mark.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-3 font-semibold">
                        <span
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold text-white inline-block"
                          style={{ backgroundColor: subj?.color_token || '#6366f1' }}
                        >
                          {subj?.name || 'Subject'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                        {mark.title}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium">
                          {mark.paper_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                        {mark.exam_date}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`font-extrabold text-sm ${
                          mark.score >= 75
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : mark.score >= 50
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-amber-600'
                        }`}>
                          {mark.score}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 max-w-xs truncate">
                        {mark.unit || mark.notes || '-'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => deleteMark(mark.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Mark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddMarkModal isOpen={isAddMarkOpen} onClose={() => setIsAddMarkOpen(false)} />

    </div>
  );
};
