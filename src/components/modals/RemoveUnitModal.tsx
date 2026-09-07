import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { SyllabusUnit } from '../../types';
import { X, Trash2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  subjectName: string;
  units: SyllabusUnit[];
}

export const RemoveUnitModal: React.FC<Props> = ({
  isOpen,
  onClose,
  subjectId,
  subjectName,
  units
}) => {
  const { deleteUnit } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Remove Units</h3>
              <p className="text-[11px] text-slate-400 font-medium">{subjectName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Units List */}
        <div className="py-4 space-y-2 max-h-[350px] overflow-y-auto">
          {units.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <AlertCircle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              <span>No units to remove for this subject.</span>
            </div>
          ) : (
            units.map((u) => (
              <div
                key={u.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      Unit {u.unit_number}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {u.title}
                    </h5>
                  </div>
                  {u.hours && (
                    <p className="text-[10px] text-slate-400 mt-0.5">~{u.hours} hrs</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    deleteUnit(u.id, subjectId);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  title={`Delete Unit ${u.unit_number}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          {units.length > 0 && (
            <button
              type="button"
              onClick={() => {
                units.forEach(u => deleteUnit(u.id, subjectId));
                onClose();
              }}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              Remove All Units
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
