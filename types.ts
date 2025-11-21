export interface WeightRecord {
  id?: string;
  date: string;
  weight: number; // in grams
}

export interface MedicalRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'upcoming';
  type: 'vaccine' | 'medication' | 'checkup' | 'other';
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  type: 'medical' | 'life' | 'vaccine' | 'birthday' | 'medication' | 'deworming' | 'other';
  isCompleted?: boolean;
}

export interface Note {
  id: string;
  date: string;
  content: string;
  tags?: string[];
}

export interface AgeParts {
  years: number;
  months: number;
  weeks: number;
  days: number;
}