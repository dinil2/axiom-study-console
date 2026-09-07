export type ALStream = 'Science' | 'Commerce' | 'Arts' | 'Technology';

export interface Subject {
  id: string;
  code: string;
  name: string;
  stream: ALStream;
  color_token: string;
  sort_order: number;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  stream: ALStream;
  theme_preference: 'light' | 'dark' | 'system';
  target_year?: string;
  school?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserSubject {
  id: string;
  user_id: string;
  subject_id: string;
  subject?: Subject;
}

export interface SyllabusUnit {
  id: string;
  subject_id: string;
  unit_number: number;
  title: string;
  description?: string;
  hours?: number;
}

export interface UnitProgress {
  id: string;
  user_id: string;
  unit_id: string;
  completed: boolean;
  notes?: string;
  updated_at?: string;
}

export interface Mark {
  id: string;
  user_id: string;
  subject_id: string;
  subject?: Subject;
  title: string;
  paper_type: 'MCQ' | 'Essay' | 'Structured' | 'Term Test' | 'Full Paper';
  score: number;
  exam_date: string;
  unit?: string;
  notes?: string;
}

export interface TimetableSlot {
  id: string;
  user_id: string;
  subject_id?: string;
  subject?: Subject;
  day_of_week: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
  start_time: string;  // e.g. "8:00 pm" or "14:00"
  end_time: string;    // e.g. "10:00 pm" or "16:00"
  title: string;
  category: 'Class' | 'Tuition' | 'Self Study' | 'Revision';
  room_or_link?: string;
}

export interface TodoItem {
  id: string;
  user_id: string;
  subject_id?: string;
  subject?: Subject;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  due_date: string;
  completed: boolean;
  is_homework: boolean;
  attachment_label?: string;
}
