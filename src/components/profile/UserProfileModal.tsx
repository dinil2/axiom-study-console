import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  User,
  Camera,
  Upload,
  Trash2,
  Calendar,
  BookOpen,
  TrendingUp,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenStreamModal: () => void;
}

export const UserProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenStreamModal
}) => {
  const {
    user,
    profile,
    updateProfile,
    selectedSubjects,
    slots,
    marks,
    unitProgress,
    logout
  } = useAuth();

  const [name, setName] = useState(profile?.full_name || user?.email?.split('@')[0] || 'A/L Student');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [targetYear, setTargetYear] = useState(profile?.target_year || '2026');
  const [school, setSchool] = useState(profile?.school || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const completedUnitsCount = Object.values(unitProgress).filter(Boolean).length;
  const avgMarks = marks.length > 0
    ? Math.round(marks.reduce((sum, m) => sum + m.score, 0) / marks.length)
    : 0;

  // Handle custom student image file selection & upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      let uploadedUrl = '';

      // Try uploading to Supabase Storage bucket 'avatars'
      if (isSupabaseConfigured && supabase && user) {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, {
            upsert: true,
            contentType: file.type
          });

        if (!uploadErr) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
          if (data?.publicUrl) {
            uploadedUrl = data.publicUrl;
          }
        }
      }

      // If storage didn't return URL or is offline, use base64 data URL fallback
      if (!uploadedUrl) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setAvatarUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setAvatarUrl(uploadedUrl);
      }
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      // Fallback to local data URL on any error
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      // Reset input so re-selecting same file triggers onChange
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    setUploadError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: name.trim() || 'A/L Student',
      avatar_url: avatarUrl,
      target_year: targetYear,
      school: school.trim()
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const studentInitial = (name || user?.email || 'A').trim().charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Student Profile & Settings</h3>
              <p className="text-[11px] text-slate-400">Personalize your console, photo, and exam credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6 pt-5">
          
          {/* Custom Student Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Student Photo
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-[#131d31] border border-slate-200/80 dark:border-slate-800/80">
              {/* Photo Preview Circle */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarUrl('')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-2xl">
                      {studentInitial}
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
              </div>

              {/* Upload & Actions */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Upload Your Photo
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Choose an image from your device. Supported: JPG, PNG, WebP (max 5MB).
                  </p>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {uploadError && (
                  <p className="text-[11px] text-rose-500 font-medium pt-1">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>

            {/* Optional Custom Image URL Input */}
            <div className="pt-1">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Or paste direct image URL (optional)..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Name & Target Year Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Student Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Target Exam Year
              </label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="2025">2025 A/L</option>
                <option value="2026">2026 A/L</option>
                <option value="2027">2027 A/L</option>
                <option value="Repeat">2nd / 3rd Shy</option>
              </select>
            </div>
          </div>

          {/* School / District */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              School or Tuition Center
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g. Royal College, Colombo / Kandy"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Student Dashboard Quick Stats */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131d31] border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Live Study Metrics
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {profile?.stream || 'Science'} Stream
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                <span className="block text-xs font-semibold text-slate-400">Avg Mark</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {avgMarks > 0 ? `${avgMarks}%` : '—'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                <span className="block text-xs font-semibold text-slate-400">Units Done</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{completedUnitsCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                <span className="block text-xs font-semibold text-slate-400">Classes</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{slots.length}</span>
              </div>
            </div>

            {/* Stream Change CTA */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Current: {selectedSubjects.map(s => s.name).join(', ')}
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStreamModal();
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Switch</span>
              </button>
            </div>
          </div>

          {/* Cloud Database Sync Status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#131d31] border border-slate-200/80 dark:border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-4 h-4 ${isSupabaseConfigured ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {isSupabaseConfigured ? 'nhxbceaxhwbfjonyirkf' : 'Offline Mode'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                {isSaved ? 'Saved!' : 'Save Profile'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
