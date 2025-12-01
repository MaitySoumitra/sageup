import { useState } from 'react';

// Define TS Interfaces based on EJS variables
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Profile {
  _id: string;
  user: User;
  type: 'private_tutor' | 'coaching_center' | 'small_institute';
  location: string;
  experience: number;
  description: string;
  contactInfo: string;
  profileImage?: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
}

interface Subject {
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

interface LibraryItem {
  _id: string;
  title: string;
  description: string;
  type: 'question' | 'solution' | 'note';
  category?: string;
  fileUrl: string;
  uploadedBy?: { name: string };
}


const MOCK_USER: User = { _id: 'tutor-123', name: 'Dr. Jane Smith', email: 'jane.s@example.com' };

const MOCK_PROFILE: Profile = {
  _id: 'prof-456',
  user: MOCK_USER,
  type: 'private_tutor',
  location: 'New Town, Kolkata',
  experience: 5,
  description: 'Experienced Math and Science tutor focused on conceptual clarity.',
  contactInfo: 'jane.s@example.com / 9876543210',
  status: 'pending',
};

const MOCK_SUBJECTS: Subject[] = [
  {
    _id: 'sub-001',
    name: 'Advanced Calculus',
    category: 'Mathematics',
    level: 'advanced',
    location: 'Online',
    availability: {
      days: ['Tuesday', 'Thursday'],
      timeSlots: ['7PM-9PM'],
    },
  },
  {
    _id: 'sub-002',
    name: 'Physics (Class 12)',
    category: 'Science',
    level: 'intermediate',
    location: 'In-person',
    availability: {
      days: ['Saturday', 'Sunday'],
      timeSlots: ['10AM-12PM', '4PM-6PM'],
    },
  },
];

const MOCK_LIBRARIES: LibraryItem[] = [
  {
    _id: 'lib-001',
    title: 'Kinematics Practice Sheet',
    description: 'A collection of difficult kinematics problems.',
    type: 'question',
    category: 'Physics (Class 11)',
    fileUrl: '/files/kinematics.pdf',
    uploadedBy: { name: 'Dr. Jane Smith' },
  },
  {
    _id: 'lib-002',
    title: 'Differential Equations Notes',
    description: 'Detailed lecture notes on ODEs.',
    type: 'note',
    category: 'Mathematics',
    fileUrl: '/files/odes.pdf',
  },
];

const MOCK_ADMIN_PROFILES: Profile[] = [
  { ...MOCK_PROFILE, _id: 'p-1', user: { _id: 'u-1', name: 'John Doe', email: 'john@example.com' }, status: 'pending' },
  { ...MOCK_PROFILE, _id: 'p-2', user: { _id: 'u-2', name: 'Acme Tutoring', email: 'acme@example.com' }, type: 'coaching_center', status: 'pending' },
];

const useSampleData = () => {
  // In a real app, this would use React Query or Redux to fetch from actual APIs.
  // We're simulating the EJS data passed from the server.
  const [user] = useState(MOCK_USER);
  const [profile] = useState(MOCK_PROFILE);
  const [subjects] = useState(MOCK_SUBJECTS);
  const [libraries] = useState(MOCK_LIBRARIES);
  const [pendingProfiles] = useState(MOCK_ADMIN_PROFILES);

  return {
    user,
    profile,
    subjects,
    libraries,
    pendingProfiles,
    // Admin counts are derived from the list
    pendingCount: MOCK_ADMIN_PROFILES.length,
    approvedCount: 15, // Mock value
    rejectedCount: 3,  // Mock value
  };
};

export default useSampleData;