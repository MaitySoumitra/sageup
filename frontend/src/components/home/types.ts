// src/components/ProfileView/types.ts

// Assuming a simplified User structure for display
export interface User {
  _id: string;
  name: string;
  // Add other user fields if needed (e.g., role)
}

export interface Review {
  _id: string;
  user: { _id: string, name: string }; // User who wrote the review
  review: string; // Review text
  rating: number; // 1 to 5
  createdAt: string; // for display
}

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
  category: string;
  fileUrl: string;
}

export interface FullProfile {
  _id: string;
  user: User; // Full user object of the profile owner
  type: 'private_tutor' | 'coaching_center' | 'small_institute';
  location: string;
  experience: number;
  description: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  profileImage: string;
  rating: number; // Average rating
  reviews: Review[]; // Array of full review objects
  // The following are assumed to be fetched separately or in a combined endpoint response
  subjects: Subject[]; 
  libraryItems: LibraryItem[];
  // Other fields...
}