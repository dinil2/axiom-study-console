import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingHomePage } from './components/home/LandingHomePage';
import { AuthPage } from './components/auth/AuthPage';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { WeeklyPlannerView } from './components/planner/WeeklyPlannerView';
import { HomeworkView } from './components/homework/HomeworkView';
import { MarksAnalyticsView } from './components/marks/MarksAnalyticsView';
import { SyllabusTrackerView } from './components/syllabus/SyllabusTrackerView';
import { StreamOnboardingModal } from './components/onboarding/StreamOnboardingModal';

const AppContent: React.FC = () => {
  const { user, isOnboardingRequired, theme, toggleTheme, loginDemo } = useAuth();
  const [publicView, setPublicView] = useState<'landing' | 'auth'>('landing');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<'home' | 'planner' | 'homework' | 'analytics' | 'syllabus'>('home');
  const [isStreamModalOpen, setIsStreamModalOpen] = useState<boolean>(false);

  // If user is not logged in:
  // Step 1: Show the Homepage first
  // Step 2: Show the Login / Sign up page only when user clicks an action
  if (!user) {
    if (publicView === 'landing') {
      return (
        <LandingHomePage
          onGetStarted={() => {
            setAuthInitialMode('signup');
            setPublicView('auth');
          }}
          onSignIn={() => {
            setAuthInitialMode('login');
            setPublicView('auth');
          }}
          onExploreDemo={() => {
            loginDemo();
          }}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      );
    }

    return (
      <AuthPage
        initialMode={authInitialMode}
        onBackToHome={() => setPublicView('landing')}
      />
    );
  }

  return (
    <>
      <AppShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenStreamModal={() => setIsStreamModalOpen(true)}
      >
        {activeTab === 'home' && (
          <DashboardView onSeeAllHomework={() => setActiveTab('homework')} />
        )}
        {activeTab === 'planner' && (
          <WeeklyPlannerView />
        )}
        {activeTab === 'homework' && (
          <HomeworkView />
        )}
        {activeTab === 'analytics' && (
          <MarksAnalyticsView />
        )}
        {activeTab === 'syllabus' && (
          <SyllabusTrackerView />
        )}
      </AppShell>

      {/* Stream & Subject Selector Modal */}
      <StreamOnboardingModal
        isOpen={isOnboardingRequired || isStreamModalOpen}
        onClose={() => setIsStreamModalOpen(false)}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
