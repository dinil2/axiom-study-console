import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, CheckSquare } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddHomeworkModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedSubjects, addTodo } = useAuth();
  const [subjectId, setSubjectId] = useState<string>(selectedSubjects[0]?.id || '');
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [daysLeft, setDaysLeft] = useState<number>(7);
  const [hasAttachment, setHasAttachment] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const target = new Date();
    target.setDate(target.getDate() + Number(daysLeft));
    const dueDateStr = target.toISOString().split('T')[0];

    const subj = selectedSubjects.find(s => s.id === subjectId);
    addTodo({
      subject_id: subjectId,
      subject: subj,
      title,
      priority,
      due_date: dueDateStr,
      completed: false,
      is_homework: true,
      attachment_label: hasAttachment ? 'Attachment' : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-lg">Add Homework / Task</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
            >
              {selectedSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Task / Homework Description</label>
            <textarea
              required
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete chapter 4 revision & exercises"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Days Remaining</label>
              <input
                type="number"
                min="1"
                max="180"
                value={daysLeft}
                onChange={(e) => setDaysLeft(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="hasAttachment"
              checked={hasAttachment}
              onChange={(e) => setHasAttachment(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
            />
            <label htmlFor="hasAttachment" className="text-xs text-slate-600 dark:text-slate-300 select-none">
              Include "Attachment" tag (worksheets / PDF notes)
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800"
            >
              Save Homework
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
