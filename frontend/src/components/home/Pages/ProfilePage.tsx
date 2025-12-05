// src/components/ProfileView/ProfileView.tsx

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  SuitcaseSimple, 
  Phone, 
  Envelope, 
  Clock, 
  FileText,
  ChatCircleDots
} from "@phosphor-icons/react";
import axiosClient from "../../api/axiosClient";
import type { FullProfile, Review, Subject, LibraryItem } from '../types'; // Import the defined types

// Define the custom colors
const PRIMARY_COLOR = '#013F63'; // Dark Blue
const SECONDARY_COLOR = '#1B9B7D'; // Teal Green

// --- Utility Components ---

// Renders the star rating
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center space-x-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={20} 
        weight={i < rating ? "fill" : "regular"} 
        color={SECONDARY_COLOR} 
      />
    ))}
    <span className="text-lg font-semibold ml-2 text-gray-800">{rating.toFixed(1)}</span>
  </div>
);

// Basic Card Wrapper for sections
const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <h3 className="text-2xl font-bold mb-4" style={{ color: PRIMARY_COLOR }}>{title}</h3>
    {children}
  </div>
);

// Subject Card
const SubjectCard: React.FC<{ subject: Subject }> = ({ subject }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h4 className="text-lg font-semibold" style={{ color: SECONDARY_COLOR }}>{subject.name}</h4>
    <p className="text-sm text-gray-600 mb-2">{subject.category} • <span className="capitalize">{subject.level}</span></p>
    <div className="flex flex-wrap gap-2 text-xs text-gray-700">
      <div className="flex items-center gap-1"><MapPin size={14} /> {subject.location || 'Profile Location'}</div>
      <div className="flex items-center gap-1"><Clock size={14} /> {subject.availability.days.join(', ')}</div>
    </div>
  </div>
);

// Library Item Card
const LibraryItemCard: React.FC<{ item: LibraryItem }> = ({ item }) => (
  <div className="p-4 bg-white rounded-lg border-l-4" style={{ borderLeftColor: SECONDARY_COLOR }}>
    <div className="flex items-center justify-between">
      <h4 className="text-base font-semibold text-gray-800">{item.title}</h4>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
        item.type === 'note' ? 'bg-blue-100 text-blue-700' :
        item.type === 'solution' ? 'bg-green-100 text-green-700' :
        'bg-yellow-100 text-yellow-700'
      }`}>
        {item.type}
      </span>
    </div>
    <p className="text-sm text-gray-600 my-1">{item.category}</p>
    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: PRIMARY_COLOR }}>
      <FileText size={16} className="inline-block mr-1"/>
      Download Resource
    </a>
  </div>
);

// Review Card
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="flex justify-between items-start mb-2">
      <div className="font-semibold text-gray-900 flex items-center gap-2">
        <ChatCircleDots size={20} style={{ color: PRIMARY_COLOR }} weight="fill"/>
        {review.user.name}
      </div>
      <div className="flex-shrink-0">
        <StarRating rating={review.rating} />
      </div>
    </div>
    <p className="text-gray-700 italic text-sm">"{review.review}"</p>
    <p className="text-xs text-gray-500 mt-2 text-right">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
  </div>
);

// --- Main Component ---
export const ProfileView = () => {
  // Use a route parameter for the profile ID, e.g., /profile/:profileId
  const { profileId } = useParams<{ profileId: string }>(); 
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NOTE: You must update your backend API to return the FullProfile structure 
  // (joining User, Reviews, Subjects, and Library data).
  const fetchProfile = useCallback(async () => {
    if (!profileId) return;

    setLoading(true);
    setError(null);
    try {
      // Adjusted endpoint to fetch all related data
      const res = await axiosClient.get(`/api/profiles/${profileId}/full`); 
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching full profile:", err);
      setError("Could not load profile. It may not exist or an error occurred.");
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return <div className="text-center p-20 text-xl">Loading profile details...</div>;
  }

  if (error) {
    return <div className="text-center p-20 text-xl text-red-600">{error}</div>;
  }
  
  if (!profile) {
    return <div className="text-center p-20 text-xl">No profile data found.</div>;
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen pt-12 pb-20" style={{ backgroundColor: '#f9fafb' }}>
      <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
        
        {/* Header Section */}
        <header className="mb-10 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Profile Image / Initials */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-3xl font-bold" style={{ color: PRIMARY_COLOR, border: `3px solid ${SECONDARY_COLOR}` }}>
              {profile.user.name ? profile.user.name[0] : 'P'}
            </div>

            {/* Title and Stats */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-extrabold mb-1">
                {profile.user.name}
              </h1>
              <p className="text-xl font-medium mb-3" style={{ color: SECONDARY_COLOR }}>
                {profile.type.replace(/_/g, ' ').toUpperCase()}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <MapPin size={20} color="white" weight="fill" />
                  {profile.location}
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <SuitcaseSimple size={20} color="white" weight="fill" />
                  {profile.experience}+ Years Experience
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Star size={20} color={SECONDARY_COLOR} weight="fill" />
                  {profile.rating.toFixed(1)} Rating ({profile.reviews.length} reviews)
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Description & Contact) */}
          <div className="lg:col-span-2 space-y-8">
            <SectionCard title="About Us">
              <p className="text-gray-700 text-lg leading-relaxed">{profile.description}</p>
            </SectionCard>

            <SectionCard title="Areas of Expertise (Subjects)">
              {profile.subjects && profile.subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.subjects.map(subject => (
                    <SubjectCard key={subject._id} subject={subject} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No subjects currently listed.</p>
              )}
            </SectionCard>
          </div>
          
          {/* Right Column (Contact Info & Resources) */}
          <div className="lg:col-span-1 space-y-8">
            <SectionCard title="Contact Information">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-lg text-gray-800">
                  <Phone size={24} style={{ color: PRIMARY_COLOR }} weight="fill" />
                  <span className="font-medium">{profile.contactInfo.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-gray-800">
                  <Envelope size={24} style={{ color: PRIMARY_COLOR }} weight="fill" />
                  <span className="font-medium">{profile.contactInfo.email || 'N/A'}</span>
                </div>
                <div className="pt-2">
                  <button className="w-full py-3 rounded-lg text-white font-semibold transition-colors duration-200 hover:opacity-90" style={{ backgroundColor: SECONDARY_COLOR }}>
                    Book a Consultation
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Shared Library/Resources">
              {profile.libraryItems && profile.libraryItems.length > 0 ? (
                <div className="space-y-3">
                  {profile.libraryItems.map(item => (
                    <LibraryItemCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No public resources available.</p>
              )}
            </SectionCard>
          </div>
        </div>

        {/* Reviews Section (Full Width) */}
        <div className="mt-12">
          <SectionCard title={`Student Reviews (${profile.reviews.length})`}>
            {profile.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.reviews.map(review => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Be the first to leave a review!</p>
            )}
          </SectionCard>
        </div>

      </div>
    </div>
  );
};