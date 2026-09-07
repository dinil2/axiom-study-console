import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ALStream, Subject } from '../../types';
import { ALL_SUBJECTS } from '../../lib/mockData';
import { useAuth } from '../../context/AuthContext';
import { Check, BookOpen, Compass, Briefcase, Cpu, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

export const StreamOnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { saveOnboarding, profile, selectedSubjects } = useAuth();
  const [selectedStream, setSelectedStream] = useState<ALStream>(profile?.stream || 'Science');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(() => {
    if (selectedSubjects && selectedSubjects.length > 0) {
      return selectedSubjects.map(s => s.id);
    }
    return ['7dc97b49-bd76-46b2-b705-f61f41794e08', '4dcbac1c-33b9-42b0-95a9-7234ba73a56a', '0ad8860f-fa54-46ff-886b-56aee03fe79d'];
  });
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const streamInfo: { stream: ALStream; title: string; desc: string; icon: any; color: string }[] = [
    {
      stream: 'Science',
      title: 'Science (Physical / Bio)',
      desc: 'Combined Mathematics, Physics, Chemistry, Biology, Agriculture',
      icon: Compass,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
    },
    {
      stream: 'Commerce',
      title: 'Commerce',
      desc: 'Economics, Business Studies, Accounting, Business Statistics, ICT',
      icon: Briefcase,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    },
    {
      stream: 'Arts',
      title: 'Arts & Humanities',
      desc: 'Sinhala, English, History, Geography, Political Science, Logic, Media',
      icon: BookOpen,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    },
    {
      stream: 'Technology',
      title: 'Technology',
      desc: 'Engineering Technology (ET), Bio-Systems (BST), Science for Tech (SFT), ICT',
      icon: Cpu,
      color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800'
    }
  ];

  const availableSubjects = ALL_SUBJECTS.filter(s => s.stream === selectedStream);

  const toggleSubject = (id: string) => {
    if (selectedSubjectIds.includes(id)) {
      if (selectedSubjectIds.length > 1) {
        setSelectedSubjectIds(selectedSubjectIds.filter(sId => sId !== id));
      }
    } else {
      if (selectedSubjectIds.length < 3) {
        setSelectedSubjectIds([...selectedSubjectIds, id]);
      }
    }
  };

  const handleStreamSelect = (stream: ALStream) => {
    setSelectedStream(stream);
    const streamSubs = ALL_SUBJECTS.filter(s => s.stream === stream);
    setSelectedSubjectIds(streamSubs.slice(0, 3).map(s => s.id));
  };

  const handleComplete = async () => {
    await saveOnboarding(selectedStream, selectedSubjectIds);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Personalize Your Console
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
              {step === 1 ? 'Select Your GCE A/L Stream' : 'Pick Your 3 A/L Subjects'}
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Step {step} of 2
          </span>
        </div>

        <div className="py-6">
          {step === 1 ? (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">
                Axiom supports all four official Sri Lankan Advanced Level study streams:
              </p>
              {streamInfo.map(item => {
                const Icon = item.icon;
                const isSelected = selectedStream === item.stream;
                return (
                  <div
                    key={item.stream}
                    onClick={() => handleStreamSelect(item.stream)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${item.color} border`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">{item.title}</h4>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
                Choose 1 to 3 subjects to track in your console. (Selected: {selectedSubjectIds.length}/3)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                {availableSubjects.map(subj => {
                  const isChecked = selectedSubjectIds.includes(subj.id);
                  return (
                    <div
                      key={subj.id}
                      onClick={() => toggleSubject(subj.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: subj.color_token }}
                        />
                        <span className="font-semibold text-xs sm:text-sm">{subj.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isChecked
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Back to Streams
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-md"
            >
              Next: Pick Subjects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              Launch Console <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
