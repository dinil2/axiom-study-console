import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_SYLLABUS_UNITS } from '../../lib/mockData';
import { SyllabusUnit } from '../../types';
import { CheckCircle2, Circle, BookOpen, Sparkles, ChevronDown, ChevronUp, Trophy, Plus, Minus, Bell, Trash2 } from 'lucide-react';
import { AddUnitModal } from '../modals/AddUnitModal';
import { RemoveUnitModal } from '../modals/RemoveUnitModal';
import confetti from 'canvas-confetti';

export const SyllabusTrackerView: React.FC = () => {
  const { selectedSubjects, unitProgress, toggleUnitProgress, customUnits, deleteUnit } = useAuth();
  const [expandedSubjectId, setExpandedSubjectId] = useState<string>(selectedSubjects[0]?.id || '');
  const [activeModalSubject, setActiveModalSubject] = useState<{ id: string; name: string; nextUnitNum: number } | null>(null);
  const [activeRemoveSubject, setActiveRemoveSubject] = useState<{ id: string; name: string; units: SyllabusUnit[] } | null>(null);

  // Helper to get merged units for a subject
  const getSubjectUnits = (subjectId: string) => {
    const initial = INITIAL_SYLLABUS_UNITS[subjectId] || [];
    const custom = customUnits[subjectId] || [];
    return [...initial, ...custom].sort((a, b) => a.unit_number - b.unit_number);
  };

  // Calculate overall syllabus percentage
  let totalUnits = 0;
  let totalDone = 0;

  selectedSubjects.forEach(subj => {
    const units = getSubjectUnits(subj.id);
    totalUnits += units.length;
    units.forEach(u => {
      if (unitProgress[u.id]) totalDone += 1;
    });
  });

  const overallPercent = totalUnits > 0 ? Math.round((totalDone / totalUnits) * 100) : 0;

  const handleUnitClick = (unitId: string, isCurrentlyDone: boolean) => {
    toggleUnitProgress(unitId);
    if (!isCurrentlyDone) {
      // Fire celebration confetti
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.75 }
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Overall Progress Banner */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-xl z-10 relative">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              National Syllabus Coverage
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Announcements & Syllabus Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Monitor curriculum completion across your three core subjects. Check off units as you master theory and past papers, and tap "+ Add Unit" or "- Remove Unit" to customize your chapters anytime.
          </p>

          {/* Overall Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-600 dark:text-slate-300">Total Completion</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">{overallPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-dashed border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-center p-4">
          <Sparkles className="w-6 h-6 text-indigo-500 mb-1" />
          <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">{totalDone}/{totalUnits}</span>
          <span className="text-[10px] text-slate-400 font-semibold mt-1">Units Mastered</span>
        </div>
      </div>

      {/* 2. Announcements Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Personalized Syllabus Outline
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Customize your curriculum as you study. Use "+ Add Unit" to add your syllabus chapters, school topics, or tuition lessons, and "- Remove Unit" to delete unwanted units.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Subject Syllabus Cards */}
      <div className="space-y-4">
        {selectedSubjects.map((subj) => {
          const units = getSubjectUnits(subj.id);
          const completedCount = units.filter(u => unitProgress[u.id]).length;
          const subjPercent = units.length > 0 ? Math.round((completedCount / units.length) * 100) : 0;
          const isExpanded = expandedSubjectId === subj.id;

          return (
            <div
              key={subj.id}
              className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              {/* Subject Header */}
              <div
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition cursor-pointer"
                onClick={() => setExpandedSubjectId(isExpanded ? '' : subj.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm shrink-0"
                    style={{ backgroundColor: subj.color_token }}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {completedCount} of {units.length} units completed ({subjPercent}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center flex-wrap">
                  {/* + Add Unit Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalSubject({
                        id: subj.id,
                        name: subj.name,
                        nextUnitNum: units.length + 1
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/70 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title={`Add Unit to ${subj.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Unit</span>
                  </button>

                  {/* - Remove Unit Button */}
                  {units.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRemoveSubject({
                          id: subj.id,
                          name: subj.name,
                          units
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title={`Remove Units from ${subj.name}`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>Remove Unit</span>
                    </button>
                  )}

                  {/* Mini Progress Bar */}
                  <div className="hidden sm:block w-24 sm:w-28">
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${subjPercent}%`, backgroundColor: subj.color_token }}
                      />
                    </div>
                  </div>

                  <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Units Checklist List */}
              {isExpanded && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {units.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs flex flex-col items-center gap-2">
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No units added yet</p>
                      <p className="text-xs text-slate-400 max-w-sm">No syllabus units found. Click "+ Add Unit" above or below to start adding chapters for {subj.name}.</p>
                      <button
                        type="button"
                        onClick={() => setActiveModalSubject({
                          id: subj.id,
                          name: subj.name,
                          nextUnitNum: 1
                        })}
                        className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Unit</span>
                      </button>
                    </div>
                  ) : (
                    units.map((unit) => {
                      const isDone = Boolean(unitProgress[unit.id]);
                      return (
                        <div
                          key={unit.id}
                          onClick={() => handleUnitClick(unit.id, isDone)}
                          className={`py-3.5 flex items-center justify-between gap-3 cursor-pointer rounded-xl px-3 transition-colors ${
                            isDone
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                          }`}
                        >
                          <div className="flex items-start gap-3.5 min-w-0 flex-1">
                            <button
                              type="button"
                              className="mt-0.5 text-slate-400 hover:text-emerald-600 transition shrink-0 cursor-pointer"
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 shrink-0">
                                  Unit {unit.unit_number}
                                </span>
                                <h4 className={`text-sm font-bold truncate ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                                  {unit.title}
                                </h4>
                              </div>
                              {unit.description && (
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                  {unit.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {unit.hours && (
                              <span className="text-[11px] font-semibold text-slate-400 shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                ~{unit.hours} hrs
                              </span>
                            )}
                            {/* Individual unit trash icon */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUnit(unit.id, subj.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition shrink-0 cursor-pointer"
                              title={`Delete Unit ${unit.unit_number}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Inline Footer to Add Unit */}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Want to add tuition exercises or practical topics?
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveModalSubject({
                        id: subj.id,
                        name: subj.name,
                        nextUnitNum: units.length + 1
                      })}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add new unit to {subj.name}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Unit Modal */}
      {activeModalSubject && (
        <AddUnitModal
          isOpen={Boolean(activeModalSubject)}
          onClose={() => setActiveModalSubject(null)}
          subjectId={activeModalSubject.id}
          subjectName={activeModalSubject.name}
          suggestedUnitNumber={activeModalSubject.nextUnitNum}
        />
      )}

      {/* Remove Unit Modal */}
      {activeRemoveSubject && (
        <RemoveUnitModal
          isOpen={Boolean(activeRemoveSubject)}
          onClose={() => setActiveRemoveSubject(null)}
          subjectId={activeRemoveSubject.id}
          subjectName={activeRemoveSubject.name}
          units={activeRemoveSubject.units}
        />
      )}

    </div>
  );
};
