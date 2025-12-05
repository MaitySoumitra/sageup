import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MapPin, Clock, CaretLeft, CaretRight } from '@phosphor-icons/react';
import axiosClient from '../../../../api/axiosClient';

// --- 1. INTERFACE DEFINITIONS (Kept as is) ---

interface Availability {
  days?: string[];
  timeSlots?: string[];
}

interface User {
  name: string;
}

interface Subject {
  _id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  location?: string;
  availability?: Availability;
  user?: User;
}

// --- 2. RECOMMENDED SUBJECTS COMPONENT (Refactored for Slider) ---

const RecommendedSubjects: React.FC = () => {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Carousel State
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isMobileScroll, setIsMobileScroll] = useState(false);

  // Color mapping for consistency
  const levelColors: Record<Subject['level'], string> = useMemo(() => ({
    beginner: 'border-l-4 border-green-500', // Green for Beginner
    intermediate: 'border-l-4 border-yellow-500', // Yellow for Intermediate
    advanced: 'border-l-4 border-red-500', // Red for Advanced
  }), []);

  const levelTextColors: Record<Subject['level'], string> = useMemo(() => ({
    beginner: 'text-green-500',
    intermediate: 'text-yellow-500',
    advanced: 'text-red-500',
  }), []);


  // --- Data Fetching Logic (Updated to set allSubjects) ---
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      // NOTE: The original logic filtered subjects by level. 
      // For a general slider, we fetch and show all subjects.
      const res = await axiosClient.get<Subject[]>('/api/subjects');

      // Filter out subjects without a name or level for safety
      const validSubjects = res.data.filter(s => s.name && s.level);
      setAllSubjects(validSubjects);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setAllSubjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // --- Carousel and Responsiveness Logic (Copied from Testimonials) ---
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      let newVisibleCards;
      if (width >= 1024) newVisibleCards = 3;
      else if (width >= 768) newVisibleCards = 2;
      else newVisibleCards = 1;

      setVisibleCards(newVisibleCards);
      setIsMobileScroll(width < 992);
      setIndex(0); // Reset index on resize to prevent out-of-bounds
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // --- Scroll Navigation Logic ---
  const scroll = (dir: "left" | "right") => {
    if (isMobileScroll || allSubjects.length === 0) return;

    const maxIndex = allSubjects.length - visibleCards;
    let newIndex = dir === "left" ? index - 1 : index + 1;

    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;

    setIndex(newIndex);
  };

  const maxIndexReached = index >= allSubjects.length - visibleCards;
  const gapSize = 24; // Tailwind's 'gap-6' is typically 24px

  // --- RENDER ---
  return (
    <section className="max-w-9xl mx-auto bg-gray-100 py-12 px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-['Cormorant_Garamond']">
          Top Subjects Offered 🚀
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our wide selection of courses for every level.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-lg p-10">Loading recommended subjects...</p>
      ) : allSubjects.length === 0 ? (
        <p className="text-center text-lg p-10">No subjects are currently available.</p>
      ) : (

        <div className={`relative overflow-hidden ${isMobileScroll ? 'overflow-visible' : ''} py-5`}>
          <div className={`subject-wrapper ${isMobileScroll ? 'overflow-visible' : 'overflow-hidden'} w-full`}>

            {/* Track and Cards */}
            <div
              className={`flex ${isMobileScroll ? 'gap-6 sm:gap-6 md:gap-6 lg:gap-6 px-5 py-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar' : 'gap-6 transition-transform duration-600 ease-in-out'}`}
              style={{
                transform: isMobileScroll ? 'none' : `translateX(-${index * (100 / visibleCards)}%)`,
              }}
            >
              {allSubjects.map((subject) => (
                <div
                  key={subject._id}
                  className={`subject-card bg-white p-6 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 flex-shrink-0 snap-start h-full ${levelColors[subject.level]}`}
                  style={{
                    // Flex basis calculation to handle gaps for smooth sliding
                    flex: isMobileScroll
                      ? (visibleCards === 1 ? "0 0 100%" : (visibleCards === 2 ? `0 0 calc(50% - ${gapSize / 2}px)` : `0 0 calc(33.333% - ${gapSize * 2 / 3}px)`))
                      : `0 0 calc(${100 / visibleCards}% - ${gapSize * (visibleCards - 1) / visibleCards}px)`,
                  }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{subject.name}</h3>
                  <p className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm mb-3">
                    {subject.category}
                  </p>
                  <p className={`font-medium mb-2 ${levelTextColors[subject.level]} text-sm capitalize`}>
                    Level: {subject.level}
                  </p>
                  <p className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <MapPin size={16} weight="fill" /> {subject.location || 'Online'}
                  </p>
                  {subject.availability?.days?.length && (
                    <p className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock size={16} weight="fill" />
                      {subject.availability.days.slice(0, 3).join(', ')}{subject.availability.days.length > 3 ? '...' : ''}
                      {subject.availability.timeSlots?.length ? ` (${subject.availability.timeSlots[0]})${subject.availability.timeSlots.length > 1 ? '...' : ''}` : ''}
                    </p>
                  )}
                  {subject.user?.name && (
                    <p className="mt-3 text-gray-400 italic text-sm">Taught by {subject.user.name}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Arrows (Hidden on Mobile) */}
            <button
              className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-xl shadow-md justify-center items-center transition-all duration-300 border-0 ${index === 0 ? "opacity-30 pointer-events-none" : "hover:bg-gray-200"} left-[-8px]`}
              onClick={() => scroll("left")}
              disabled={index === 0}
            >
              <CaretLeft className="text-gray-700" />
            </button>

            <button
              className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-xl shadow-md justify-center items-center transition-all duration-300 border-0 ${maxIndexReached ? "opacity-30 pointer-events-none" : "hover:bg-gray-200"} right-[-10px]`}
              onClick={() => scroll("right")}
              disabled={maxIndexReached}
            >
              <CaretRight className="text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecommendedSubjects;