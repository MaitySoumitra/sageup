// src/types/index.ts

export interface Subject {
  _id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  location?: string;
  availability: {
    days: string[];
    timeSlots: string[];
  };
}

export interface LibraryItem {
  _id: string;
  title: string;
  description: string;
  type: 'question' | 'solution' | 'note';
  category?: string;
  fileUrl: string;
  uploadedBy?: { name: string };
}

export interface User {
  name: string;
}
