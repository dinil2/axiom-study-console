import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, Subject, TimetableSlot, TodoItem, Mark, ALStream, SyllabusUnit } from '../types';
import { ALL_SUBJECTS, INITIAL_SYLLABUS_UNITS } from '../lib/mockData';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  selectedSubjects: Subject[];
  slots: TimetableSlot[];
  todos: TodoItem[];
  marks: Mark[];
  unitProgress: Record<string, boolean>;
  customUnits: Record<string, SyllabusUnit[]>;
  theme: 'light' | 'dark';
  isLoading: boolean;
  isOnboardingRequired: boolean;
  login: (email: string, password?: string) => Promise<{ error?: string }>;
  signup: (email: string, name: string, password?: string) => Promise<{ error?: string }>;
  loginDemo: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  toggleTheme: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  saveOnboarding: (stream: ALStream, subjectIds: string[]) => Promise<void>;
  addSlot: (slot: Omit<TimetableSlot, 'id' | 'user_id'>) => void;
  deleteSlot: (id: string) => void;
  addTodo: (todo: Omit<TodoItem, 'id' | 'user_id'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addMark: (mark: Omit<Mark, 'id' | 'user_id'>) => void;
  deleteMark: (id: string) => void;
  toggleUnitProgress: (unitId: string) => void;
  addCustomUnit: (unit: Omit<SyllabusUnit, 'id'>) => void;
  deleteUnit: (unitId: string, subjectId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'axiom_user',
  PROFILE: 'axiom_profile',
  SUBJECTS: 'axiom_subjects',
  SLOTS: 'axiom_slots',
  TODOS: 'axiom_todos',
  MARKS: 'axiom_marks',
  PROGRESS: 'axiom_progress',
  CUSTOM_UNITS: 'axiom_custom_units',
  THEME: 'axiom_theme'
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : null;
  });

  // Default theme is DARK as requested
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light') return 'light';
    return 'dark';
  });

  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Default to Science stream subjects
    return ALL_SUBJECTS.filter(s => ['CMATH', 'PHYS', 'CHEM'].includes(s.code));
  });

  const [slots, setSlots] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TODOS);
    return saved ? JSON.parse(saved) : [];
  });

  const [marks, setMarks] = useState<Mark[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MARKS);
    return saved ? JSON.parse(saved) : [];
  });

  const [unitProgress, setUnitProgress] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return saved ? JSON.parse(saved) : {};
  });

  const [customUnits, setCustomUnits] = useState<Record<string, SyllabusUnit[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_UNITS);
    return saved ? JSON.parse(saved) : {};
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnboardingRequired, setIsOnboardingRequired] = useState<boolean>(false);

  // Sync theme with document class and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist state to localStorage for offline and refresh access
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  }, [user]);

  useEffect(() => {
    if (profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    else localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(selectedSubjects));
  }, [selectedSubjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(unitProgress));
  }, [unitProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_UNITS, JSON.stringify(customUnits));
  }, [customUnits]);

  // Load user data from Supabase
  const loadUserDataFromSupabase = async (userId: string) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setProfile(profileData);
        if (profileData.theme_preference === 'light') {
          setTheme('light');
        } else {
          setTheme('dark');
        }
      }

      // 2. Fetch User Subjects
      const { data: userSubjs } = await supabase
        .from('user_subjects')
        .select('subject_id')
        .eq('user_id', userId);

      if (userSubjs && userSubjs.length > 0) {
        const subIds = userSubjs.map(us => us.subject_id);
        const matched = ALL_SUBJECTS.filter(s => subIds.includes(s.id));
        if (matched.length > 0) {
          setSelectedSubjects(matched);
          setIsOnboardingRequired(false);
        }
      } else if (profileData?.stream) {
        // If profile has stream, take default subjects for stream and save them
        const streamSubs = ALL_SUBJECTS.filter(s => s.stream === profileData.stream).slice(0, 3);
        if (streamSubs.length > 0) {
          setSelectedSubjects(streamSubs);
          setIsOnboardingRequired(false);
          // Sync to user_subjects
          supabase.from('user_subjects').insert(
            streamSubs.map(s => ({ user_id: userId, subject_id: s.id }))
          ).then();
        }
      } else {
        // Only brand-new unconfigured users need onboarding
        setIsOnboardingRequired(true);
      }

      // 3. Fetch Slots
      const { data: slotsData } = await supabase
        .from('slots')
        .select('*')
        .eq('user_id', userId);
      if (slotsData) {
        const hydratedSlots: TimetableSlot[] = slotsData.map(slot => ({
          ...slot,
          subject: ALL_SUBJECTS.find(s => s.id === slot.subject_id)
        }));
        setSlots(hydratedSlots);
      }

      // 4. Fetch Todos
      const { data: todosData } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (todosData) {
        const hydratedTodos: TodoItem[] = todosData.map(t => ({
          ...t,
          subject: ALL_SUBJECTS.find(s => s.id === t.subject_id)
        }));
        setTodos(hydratedTodos);
      }

      // 5. Fetch Marks
      const { data: marksData } = await supabase
        .from('marks')
        .select('*')
        .eq('user_id', userId)
        .order('exam_date', { ascending: false });
      if (marksData) {
        const hydratedMarks: Mark[] = marksData.map(m => ({
          ...m,
          subject: ALL_SUBJECTS.find(s => s.id === m.subject_id)
        }));
        setMarks(hydratedMarks);
      }

      // 6. Fetch Unit Progress
      const { data: progressData } = await supabase
        .from('unit_progress')
        .select('*')
        .eq('user_id', userId);
      if (progressData) {
        const progressMap: Record<string, boolean> = {};
        progressData.forEach(p => {
          if (p.completed) progressMap[p.unit_id] = true;
        });
        setUnitProgress(progressMap);
      }

      // 7. Fetch Custom Syllabus Units
      const { data: unitsData } = await supabase
        .from('syllabus_units')
        .select('*')
        .order('unit_number', { ascending: true });
      if (unitsData && unitsData.length > 0) {
        const unitsBySubject: Record<string, SyllabusUnit[]> = {};
        unitsData.forEach(u => {
          if (!unitsBySubject[u.subject_id]) unitsBySubject[u.subject_id] = [];
          unitsBySubject[u.subject_id].push({
            id: u.id,
            subject_id: u.subject_id,
            unit_number: u.unit_number,
            title: u.title,
            hours: u.hours
          });
        });
        setCustomUnits(unitsBySubject);
      }
    } catch (err) {
      console.warn('Error loading user data from Supabase:', err);
    }
  };

  // Listen to Supabase auth state and restore session
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        loadUserDataFromSupabase(session.user.id);
      }
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          loadUserDataFromSupabase(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setSlots([]);
        setTodos([]);
        setMarks([]);
        setUnitProgress({});
        setCustomUnits({});
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.SLOTS);
        localStorage.removeItem(STORAGE_KEYS.TODOS);
        localStorage.removeItem(STORAGE_KEYS.MARKS);
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_UNITS);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (profile) {
      setProfile({ ...profile, theme_preference: nextTheme });
      if (isSupabaseConfigured && supabase && user) {
        supabase.from('profiles').update({ theme_preference: nextTheme }).eq('id', user.id).then();
      }
    }
  };

  const loginDemo = () => {
    const demoUser = { id: 'demo-student-01', email: 'student@axiomstudy.lk' };
    const demoProfile: Profile = {
      id: demoUser.id,
      full_name: 'Student Preview',
      avatar_url: '',
      stream: 'Science',
      theme_preference: 'dark',
      target_year: '2026',
      school: 'A/L Study Console'
    };
    setUser(demoUser);
    setProfile(demoProfile);
    setSlots([]);
    setTodos([]);
    setMarks([]);
    setUnitProgress({});
    setIsOnboardingRequired(false);
  };

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'AxiomPass123!'
        });
        if (error) return { error: error.message };
        if (data.user) {
          const authUser = { id: data.user.id, email: data.user.email || email };
          setUser(authUser);
          await loadUserDataFromSupabase(data.user.id);
          return {};
        }
      }
      
      // Fallback local account
      const demoUser = { id: 'u-' + Math.random().toString(36).substring(2, 8), email };
      const demoProfile: Profile = {
        id: demoUser.id,
        full_name: email.split('@')[0] || 'Student',
        avatar_url: '',
        stream: 'Science',
        theme_preference: 'dark',
        target_year: '2026',
        school: ''
      };
      setUser(demoUser);
      setProfile(demoProfile);
      setSlots([]);
      setTodos([]);
      setMarks([]);
      setUnitProgress({});
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || 'AxiomPass123!',
          options: {
            data: { full_name: name }
          }
        });
        if (error) {
          if (
            error.message.toLowerCase().includes('rate limit') ||
            error.message.toLowerCase().includes('email rate limit')
          ) {
            return {
              error: 'Email rate limit reached on Supabase. In Supabase Dashboard → Authentication → Providers → Email, turn OFF "Confirm email" so students can register and log in instantly without email rate limits.'
            };
          }
          return { error: error.message };
        }
        if (data.user) {
          const newUser = { id: data.user.id, email: data.user.email || email };
          setUser(newUser);
          const initialProfile: Profile = {
            id: data.user.id,
            full_name: name || 'Student',
            avatar_url: '',
            stream: 'Science',
            theme_preference: 'dark',
            target_year: '2026',
            school: ''
          };
          setProfile(initialProfile);
          setSlots([]);
          setTodos([]);
          setMarks([]);
          setUnitProgress({});
          setIsOnboardingRequired(true);
          return {};
        }
      }

      // Demo signup
      const newUser = { id: 'u-' + Math.random().toString(36).substring(2, 8), email };
      const newProfile: Profile = {
        id: newUser.id,
        full_name: name || 'Student',
        avatar_url: '',
        stream: 'Science',
        theme_preference: 'dark',
        target_year: '2026',
        school: ''
      };
      setUser(newUser);
      setProfile(newProfile);
      setSlots([]);
      setTodos([]);
      setMarks([]);
      setUnitProgress({});
      setIsOnboardingRequired(true);
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
    } else {
      const googleUser = { id: 'g-user-101', email: 'student@axiomstudy.lk' };
      const googleProfile: Profile = {
        id: googleUser.id,
        full_name: 'Student Preview',
        avatar_url: '',
        stream: 'Science',
        theme_preference: 'dark',
        target_year: '2026',
        school: ''
      };
      setUser(googleUser);
      setProfile(googleProfile);
      setSlots([]);
      setTodos([]);
      setMarks([]);
      setUnitProgress({});
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSlots([]);
    setTodos([]);
    setMarks([]);
    setUnitProgress({});
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SLOTS);
    localStorage.removeItem(STORAGE_KEYS.TODOS);
    localStorage.removeItem(STORAGE_KEYS.MARKS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_UNITS);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const current = profile || {
      id: user?.id || 'student-user',
      full_name: user?.email?.split('@')[0] || 'Student',
      avatar_url: '',
      stream: 'Science' as ALStream,
      theme_preference: 'dark',
      target_year: '2026',
      school: ''
    };
    const updated: Profile = { ...current, ...updates };
    setProfile(updated);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: updated.full_name,
          avatar_url: updated.avatar_url,
          stream: updated.stream,
          theme_preference: updated.theme_preference
        });
      } catch (err) {
        console.warn('Could not sync profile update to remote Supabase:', err);
      }
    }
  };

  const saveOnboarding = async (stream: ALStream, subjectIds: string[]) => {
    const chosen = ALL_SUBJECTS.filter(s => subjectIds.includes(s.id));
    setSelectedSubjects(chosen);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(chosen));

    if (profile) {
      const updated = { ...profile, stream };
      setProfile(updated);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    }

    // Do NOT wipe slots, todos, marks or unitProgress - preserve user's data!
    setIsOnboardingRequired(false);

    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('profiles').update({ stream }).eq('id', user.id);
        await supabase.from('user_subjects').delete().eq('user_id', user.id);
        if (chosen.length > 0) {
          const insertPayload = chosen.map(s => ({
            user_id: user.id,
            subject_id: s.id
          }));
          const { error } = await supabase.from('user_subjects').insert(insertPayload);
          if (error) {
            console.error('Error saving user_subjects:', error);
          }
        }
      } catch (err) {
        console.warn('Could not sync onboarding to remote Supabase:', err);
      }
    }
  };

  const addSlot = async (slot: Omit<TimetableSlot, 'id' | 'user_id'>) => {
    const slotId = crypto.randomUUID();
    const newSlot: TimetableSlot = {
      ...slot,
      id: slotId,
      user_id: user?.id || 'local-user'
    };
    setSlots(prev => [...prev, newSlot]);

    if (isSupabaseConfigured && supabase && user) {
      try {
        const isValidUuid = slot.subject_id && UUID_REGEX.test(slot.subject_id);
        const { error } = await supabase.from('slots').insert({
          id: slotId,
          user_id: user.id,
          subject_id: isValidUuid ? slot.subject_id : null,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          title: slot.title,
          category: slot.category,
          room_or_link: slot.room_or_link || ''
        });
        if (error) console.error('Error inserting slot in Supabase:', error);
      } catch (err) {
        console.warn('Could not persist slot to Supabase:', err);
      }
    }
  };

  const deleteSlot = async (id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('slots').delete().eq('id', id).eq('user_id', user.id);
      } catch (err) {
        console.warn('Could not delete slot from Supabase:', err);
      }
    }
  };

  const addTodo = async (todo: Omit<TodoItem, 'id' | 'user_id'>) => {
    const todoId = crypto.randomUUID();
    const newTodo: TodoItem = {
      ...todo,
      id: todoId,
      user_id: user?.id || 'local-user'
    };
    setTodos(prev => [newTodo, ...prev]);

    if (isSupabaseConfigured && supabase && user) {
      try {
        const isValidUuid = todo.subject_id && UUID_REGEX.test(todo.subject_id);
        const { error } = await supabase.from('todos').insert({
          id: todoId,
          user_id: user.id,
          subject_id: isValidUuid ? todo.subject_id : null,
          title: todo.title,
          priority: todo.priority || 'Medium',
          due_date: todo.due_date || new Date().toISOString().split('T')[0],
          completed: todo.completed || false,
          is_homework: todo.is_homework ?? true,
          attachment_label: todo.attachment_label || ''
        });
        if (error) console.error('Error inserting todo in Supabase:', error);
      } catch (err) {
        console.warn('Could not persist todo to Supabase:', err);
      }
    }
  };

  const toggleTodo = async (id: string) => {
    let newStatus = false;
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        newStatus = !t.completed;
        return { ...t, completed: newStatus };
      }
      return t;
    }));

    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('todos').update({ completed: newStatus }).eq('id', id).eq('user_id', user.id);
      } catch (err) {
        console.warn('Could not toggle todo in Supabase:', err);
      }
    }
  };

  const deleteTodo = async (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('todos').delete().eq('id', id).eq('user_id', user.id);
      } catch (err) {
        console.warn('Could not delete todo from Supabase:', err);
      }
    }
  };

  const addMark = async (mark: Omit<Mark, 'id' | 'user_id'>) => {
    const markId = crypto.randomUUID();
    const newMark: Mark = {
      ...mark,
      id: markId,
      user_id: user?.id || 'local-user'
    };
    setMarks(prev => [newMark, ...prev]);

    if (isSupabaseConfigured && supabase && user) {
      try {
        const { error } = await supabase.from('marks').insert({
          id: markId,
          user_id: user.id,
          subject_id: mark.subject_id,
          title: mark.title,
          paper_type: mark.paper_type,
          score: mark.score,
          exam_date: mark.exam_date,
          unit: mark.unit || '',
          notes: mark.notes || ''
        });
        if (error) console.error('Error inserting mark in Supabase:', error);
      } catch (err) {
        console.warn('Could not persist mark to Supabase:', err);
      }
    }
  };

  const deleteMark = async (id: string) => {
    setMarks(prev => prev.filter(m => m.id !== id));
    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('marks').delete().eq('id', id).eq('user_id', user.id);
      } catch (err) {
        console.warn('Could not delete mark from Supabase:', err);
      }
    }
  };

  const toggleUnitProgress = async (unitId: string) => {
    const nextVal = !unitProgress[unitId];
    setUnitProgress(prev => ({
      ...prev,
      [unitId]: nextVal
    }));

    if (isSupabaseConfigured && supabase && user) {
      try {
        if (UUID_REGEX.test(unitId)) {
          await supabase.from('unit_progress').upsert({
            user_id: user.id,
            unit_id: unitId,
            completed: nextVal,
            completed_at: nextVal ? new Date().toISOString() : null
          }, { onConflict: 'user_id,unit_id' });
        }
      } catch (err) {
        console.warn('Could not sync unit progress to Supabase:', err);
      }
    }
  };

  const addCustomUnit = (unit: Omit<SyllabusUnit, 'id'>) => {
    const unitId = crypto.randomUUID();
    const newUnit: SyllabusUnit = {
      ...unit,
      id: unitId
    };
    setCustomUnits(prev => {
      const existing = prev[unit.subject_id] || [];
      return {
        ...prev,
        [unit.subject_id]: [...existing, newUnit]
      };
    });

    if (isSupabaseConfigured && supabase && user) {
      supabase.from('syllabus_units').insert({
        id: unitId,
        subject_id: unit.subject_id,
        unit_number: unit.unit_number,
        title: unit.title,
        hours: unit.hours || 20
      }).then();
    }
  };

  const deleteUnit = (unitId: string, subjectId: string) => {
    setCustomUnits(prev => {
      const existing = prev[subjectId] || [];
      return {
        ...prev,
        [subjectId]: existing.filter(u => u.id !== unitId)
      };
    });

    setUnitProgress(prev => {
      const updated = { ...prev };
      delete updated[unitId];
      return updated;
    });

    if (isSupabaseConfigured && supabase && user) {
      supabase.from('syllabus_units').delete().eq('id', unitId).then();
      supabase.from('unit_progress').delete().eq('unit_id', unitId).eq('user_id', user.id).then();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        selectedSubjects,
        slots,
        todos,
        marks,
        unitProgress,
        customUnits,
        theme,
        isLoading,
        isOnboardingRequired,
        login,
        signup,
        loginDemo,
        loginWithGoogle,
        logout,
        toggleTheme,
        updateProfile,
        saveOnboarding,
        addSlot,
        deleteSlot,
        addTodo,
        toggleTodo,
        deleteTodo,
        addMark,
        deleteMark,
        toggleUnitProgress,
        addCustomUnit,
        deleteUnit
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
