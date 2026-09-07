import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';

export const WeeklyPlannerView: React.FC = () => {
  const { selectedSubjects, slots, todos, addSlot, deleteSlot, addTodo, toggleTodo, deleteTodo } = useAuth();

  // Form states for adding a time slot (Screenshot 5 left card)
  const [slotTitle, setSlotTitle] = useState('');
  const [slotSubjectId, setSlotSubjectId] = useState(selectedSubjects[0]?.id || '');
  const [slotCategory, setSlotCategory] = useState<'Class' | 'Tuition' | 'Self Study' | 'Revision'>('Class');
  const [slotDay, setSlotDay] = useState<number>(4); // Friday
  const [slotStart, setSlotStart] = useState('04:00 PM');
  const [slotEnd, setSlotEnd] = useState('06:00 PM');

  // Form states for adding a task (Screenshot 5 right card)
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [taskDay, setTaskDay] = useState<string>('Fri');

  const days = [
    { label: 'Mon', full: 'MONDAY', index: 0 },
    { label: 'Tue', full: 'TUESDAY', index: 1 },
    { label: 'Wed', full: 'WEDNESDAY', index: 2 },
    { label: 'Thu', full: 'THURSDAY', index: 3 },
    { label: 'Fri', full: 'FRIDAY', index: 4, isToday: true },
    { label: 'Sat', full: 'SATURDAY', index: 5 },
    { label: 'Sun', full: 'SUNDAY', index: 6 }
  ];

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTitle.trim()) return;
    const subj = selectedSubjects.find(s => s.id === slotSubjectId) || selectedSubjects[0];
    addSlot({
      subject_id: subj.id,
      subject: subj,
      day_of_week: slotDay,
      start_time: slotStart,
      end_time: slotEnd,
      title: slotTitle,
      category: slotCategory
    });
    setSlotTitle('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    const target = new Date();
    const dayMap: Record<string, number> = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0 };
    const currentDay = target.getDay();
    const targetDay = dayMap[taskDay] ?? currentDay;
    let diff = targetDay - currentDay;
    if (diff < 0) diff += 7;
    target.setDate(target.getDate() + diff);
    const dueDateStr = target.toISOString().split('T')[0];

    addTodo({
      subject_id: selectedSubjects[0]?.id,
      title: taskText,
      priority: taskPriority,
      due_date: dueDateStr,
      completed: false,
      is_homework: true,
      attachment_label: `${taskDay} Task`
    });
    setTaskText('');
  };

  // Group tasks by weekday label
  const groupedTasks: Record<string, typeof todos> = {};
  days.forEach(d => {
    groupedTasks[d.label] = [];
  });

  todos.forEach(t => {
    // Determine which day this falls into
    let matchedDay = 'Mon';
    if (t.attachment_label && t.attachment_label.includes('Task')) {
      const label = t.attachment_label.split(' ')[0];
      if (groupedTasks[label]) matchedDay = label;
    } else {
      const d = new Date(t.due_date);
      const dayIdx = (d.getDay() + 6) % 7; // Mon=0 .. Sun=6
      const label = days[dayIdx]?.label || 'Mon';
      if (groupedTasks[label]) matchedDay = label;
    }
    groupedTasks[matchedDay].push(t);
  });

  return (
    <div className="space-y-6">
      
      {/* 1. TOP CARD: WEEKLY TIMETABLE (Matching Screenshot 5) */}
      <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0f172a]/70 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Weekly timetable</h3>
            <p className="text-xs text-slate-400">Monday to Sunday • tap a slot to edit</p>
          </div>

          {/* Legend Badges (matching Screenshot 5) */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Theory Class
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              Revision Class
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              Paper Class
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
              Self-study
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              Past Paper Practice
            </span>
          </div>
        </div>

        {/* 7 Columns for Days of the Week (Mon - Sun) */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 pt-2">
          {days.map((day) => {
            const daySlots = slots.filter(s => s.day_of_week === day.index);

            return (
              <div
                key={day.index}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#131d31] border border-slate-200/80 dark:border-slate-800/80 min-h-[220px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                      {day.label}
                    </span>
                    {day.isToday && (
                      <span className="px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-[9px] font-bold text-slate-500 uppercase">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Day slots */}
                  <div className="space-y-2">
                    {daySlots.map(s => {
                      const subj = selectedSubjects.find(sub => sub.id === s.subject_id) || selectedSubjects[0];
                      return (
                        <div
                          key={s.id}
                          className="p-2.5 rounded-xl bg-white dark:bg-[#0b1220] border border-slate-200/70 dark:border-slate-800/80 shadow-xs space-y-1 group relative"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: subj?.color_token || '#3b82f6' }} />
                            <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                              {s.title.split(' ')[0]}..
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {s.start_time} - {s.end_time}
                          </p>
                          <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-semibold text-slate-500">
                            {s.category}
                          </span>
                          <button
                            onClick={() => deleteSlot(s.id)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      );
                    })}

                    {daySlots.length === 0 && (
                      <div className="h-28 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl text-[10px] text-slate-400 text-center p-2">
                        No classes
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-center text-[10px] text-slate-400 font-semibold">
                  {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 2. BOTTOM ROW: ADD A TIME SLOT & DAILY CHECKLIST (Matching Screenshot 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Card: Add a time slot */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white/90 dark:bg-[#0f172a]/70 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Add a time slot</h3>

          <form onSubmit={handleAddSlot} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Title</label>
              <input
                type="text"
                required
                value={slotTitle}
                onChange={(e) => setSlotTitle(e.target.value)}
                placeholder="Physics paper class"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131d31] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Subject</label>
                <select
                  value={slotSubjectId}
                  onChange={(e) => setSlotSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131d31] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {selectedSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Category</label>
                <select
                  value={slotCategory}
                  onChange={(e) => setSlotCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131d31] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Class">Theory Class</option>
                  <option value="Revision">Revision Class</option>
                  <option value="Tuition">Paper Class</option>
                  <option value="Self Study">Self-study</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Day</label>
                <select
                  value={slotDay}
                  onChange={(e) => setSlotDay(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131d31] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {days.map(d => (
                    <option key={d.index} value={d.index}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Start</label>
                <input
                  type="text"
                  value={slotStart}
                  onChange={(e) => setSlotStart(e.target.value)}
                  placeholder="04:00 PM"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131d31] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">End</label>
                <input
                  type="text"
                  value={slotEnd}
                  onChange={(e) => setSlotEnd(e.target.value)}
                  placeholder="06:00 PM"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131d31] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-md hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add slot</span>
            </button>
          </form>
        </div>

        {/* Right Card: Daily checklist (Priority-tagged tasks per day) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white/90 dark:bg-[#0f172a]/70 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Daily checklist</h3>
            <p className="text-xs text-slate-400">Priority-tagged tasks per day</p>
          </div>

          {/* Inline Add Task (matching Screenshot 5) */}
          <form onSubmit={handleAddTask} className="space-y-3">
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                required
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Task description"
                className="col-span-6 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131d31] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />

              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="col-span-3 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131d31] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={taskDay}
                onChange={(e) => setTaskDay(e.target.value)}
                className="col-span-3 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131d31] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                {days.map(d => (
                  <option key={d.label} value={d.label}>{d.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-md hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add task</span>
            </button>
          </form>

          {/* Grouped Tasks List (matching Screenshot 5) */}
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 max-h-80 overflow-y-auto">
            {days.map((day) => {
              const dayTasks = groupedTasks[day.label] || [];
              if (dayTasks.length === 0 && !day.isToday) return null;

              return (
                <div key={day.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold tracking-wider uppercase ${
                      day.isToday ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400'
                    }`}>
                      {day.full} {day.isToday && '• TODAY'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {dayTasks.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic py-1">No tasks scheduled for {day.full.toLowerCase()}</p>
                    ) : (
                      dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className={`p-3 rounded-2xl bg-slate-50 dark:bg-[#131d31] border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 transition ${
                            t.completed ? 'opacity-60 bg-slate-100/50 dark:bg-slate-900/40' : ''
                          }`}
                        >
                          <div
                            onClick={() => toggleTodo(t.id)}
                            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              t.completed
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {t.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <span className={`text-xs font-semibold text-slate-900 dark:text-white truncate ${
                              t.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                            }`}>
                              {t.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              t.priority === 'High'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                : t.priority === 'Medium'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {t.priority}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteTodo(t.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
