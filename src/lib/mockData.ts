import { Subject, SyllabusUnit, TimetableSlot, TodoItem, Mark, ALStream } from '../types';

export const ALL_SUBJECTS: Subject[] = [
  // Science Stream
  { id: '7dc97b49-bd76-46b2-b705-f61f41794e08', code: 'CMATH', name: 'Combined Mathematics', stream: 'Science', color_token: '#6366f1', sort_order: 1 },
  { id: '4dcbac1c-33b9-42b0-95a9-7234ba73a56a', code: 'PHYS', name: 'Physics', stream: 'Science', color_token: '#ec4899', sort_order: 2 },
  { id: '0ad8860f-fa54-46ff-886b-56aee03fe79d', code: 'CHEM', name: 'Chemistry', stream: 'Science', color_token: '#06b6d4', sort_order: 3 },
  { id: '9f0c5ae9-bed7-43e1-a7ab-d869f6969dbc', code: 'BIO', name: 'Biology', stream: 'Science', color_token: '#10b981', sort_order: 4 },
  { id: '2d6d3e05-b6b8-4355-ae86-afa026cdf8b0', code: 'AGRI', name: 'Agriculture', stream: 'Science', color_token: '#84cc16', sort_order: 5 },

  // Commerce Stream
  { id: '48481e2a-78ce-4406-a568-cadcbacb1150', code: 'ECON', name: 'Economics', stream: 'Commerce', color_token: '#3b82f6', sort_order: 6 },
  { id: '040d8f2b-6900-4b52-887f-cae0a8913a2b', code: 'BST', name: 'Business Studies', stream: 'Commerce', color_token: '#f59e0b', sort_order: 7 },
  { id: 'e66f60cb-1068-41b4-b280-12006a9bc1f4', code: 'ACC', name: 'Accounting', stream: 'Commerce', color_token: '#8b5cf6', sort_order: 8 },
  { id: 'c5478e99-1d25-496c-8154-b4f56d87af1c', code: 'BSTAT', name: 'Business Statistics', stream: 'Commerce', color_token: '#14b8a6', sort_order: 9 },
  { id: '4634e6e5-d379-4eda-a16c-a51c3065ed3a', code: 'ICT_C', name: 'Information Technology (Commerce)', stream: 'Commerce', color_token: '#6366f1', sort_order: 10 },

  // Arts Stream
  { id: '6e5c29b0-19c4-47a2-9b95-1b667c9481b2', code: 'SINH', name: 'Sinhala', stream: 'Arts', color_token: '#d97706', sort_order: 11 },
  { id: 'a55c92e0-761e-412d-98f1-63728b872305', code: 'ENG', name: 'English', stream: 'Arts', color_token: '#2563eb', sort_order: 12 },
  { id: 'd285f1f6-0866-452b-8a5d-3cbdca37c920', code: 'HIST', name: 'History', stream: 'Arts', color_token: '#b45309', sort_order: 13 },
  { id: 'b99b620f-f59e-4936-ac34-b11c534d74e2', code: 'GEOG', name: 'Geography', stream: 'Arts', color_token: '#059669', sort_order: 14 },
  { id: '295b2223-31f3-4b6e-b320-9f8aa9f7bbf6', code: 'POL', name: 'Political Science', stream: 'Arts', color_token: '#dc2626', sort_order: 15 },
  { id: '624f2201-b3ec-4a9b-82d5-4b0ee579c466', code: 'LOGIC', name: 'Logic & Scientific Method', stream: 'Arts', color_token: '#7c3aed', sort_order: 16 },
  { id: 'a95d55b0-5a65-43e9-9cfc-919a82343931', code: 'MEDIA', name: 'Media Studies', stream: 'Arts', color_token: '#db2777', sort_order: 17 },

  // Technology Stream
  { id: 'a62afdf3-8c27-4b6c-b8d5-b2545c45f05a', code: 'ETEC', name: 'Engineering Technology (ET)', stream: 'Technology', color_token: '#ea580c', sort_order: 18 },
  { id: 'e476a1d0-c665-480e-81db-41a901c5adc4', code: 'BSTEC', name: 'Bio-Systems Technology (BST)', stream: 'Technology', color_token: '#16a34a', sort_order: 19 },
  { id: '8c584d71-6177-4530-aad9-ae5f706c3a1b', code: 'SFT', name: 'Science for Technology (SFT)', stream: 'Technology', color_token: '#0284c7', sort_order: 20 },
  { id: '5cd49a2d-b3f0-4d03-930a-9b47b403ac7b', code: 'ICT_T', name: 'Information Technology (Tech)', stream: 'Technology', color_token: '#6366f1', sort_order: 21 }
];

// Clean empty slate for syllabus units - no demo units
export const INITIAL_SYLLABUS_UNITS: Record<string, SyllabusUnit[]> = {};

// Starter dataset generator - clean empty slate so students add items one by one
export function generateStarterUserData(userId: string, selectedSubjects: Subject[]) {
  return {
    unitProgress: {} as Record<string, boolean>,
    slots: [] as TimetableSlot[],
    todos: [] as TodoItem[],
    marks: [] as Mark[]
  };
}

