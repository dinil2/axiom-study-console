import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Calendar,
  CheckSquare,
  BarChart2,
  BookOpen,
  Settings,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  RefreshCw,
  Bell,
  Users,
  UserCheck
} from 'lucide-react';
import { UserProfileModal } from '../profile/UserProfileModal';

interface Props {
  children: React.ReactNode;
  activeTab: 'home' | 'planner' | 'homework' | 'analytics' | 'syllabus';
  setActiveTab: (tab: 'home' | 'planner' | 'homework' | 'analytics' | 'syllabus') => void;
  onOpenStreamModal: () => void;
}

export const AppShell: React.FC<Props> = ({
  children,
  activeTab,
  setActiveTab,
  onOpenStreamModal
}) => {
  const { user, profile, logout, theme, toggleTheme } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'planner', label: 'Calendar', icon: Calendar },
    { id: 'homework', label: 'Homework', icon: CheckSquare },
    { id: 'analytics', label: 'Teachers & Marks', icon: Users },
    { id: 'syllabus', label: 'Announcements & Syllabus', icon: Bell },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      
      {/* Desktop Sidebar (matching Image 1 layout) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#111827] border-r border-slate-200/80 dark:border-slate-800/80 p-6 justify-between shrink-0 shadow-sm">
        <div>
          {/* User Profile Info (Clickable avatar opens UserProfileModal) */}
          <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100 dark:border-slate-800">
            <div
              className="relative group cursor-pointer"
              onClick={() => setIsProfileModalOpen(true)}
              title="Click to edit profile, avatar & view student dashboard"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/80 shadow-md group-hover:ring-2 group-hover:ring-indigo-500 transition flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Student'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-xl">
                    {(profile?.full_name || user?.email || 'A').trim().charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <h3
              onClick={() => setIsProfileModalOpen(true)}
              className="font-bold text-base mt-3 text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition"
            >
              {profile?.full_name || user?.email?.split('@')[0] || 'A/L Student'}
            </h3>
            
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                {profile?.stream || 'Science'} Stream
              </span>
              <button
                type="button"
                onClick={onOpenStreamModal}
                title="Change Stream or Subjects"
                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/30'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: Theme Toggle & Logout */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Segmented Light/Dark Toggle Switch */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center text-xs font-semibold">
            <button
              type="button"
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => theme === 'light' && toggleTheme()}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#1e293b] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsProfileModalOpen(true)}
          title="Click to view student profile"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-500/80 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
                {(profile?.full_name || user?.email || 'A').trim().charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-none">
              {profile?.full_name || user?.email?.split('@')[0] || 'A/L Student'}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              {profile?.stream || 'Science'} Stream • View Profile
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Dashboard Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenStreamModal={onOpenStreamModal}
      />

    </div>
  );
};
