import React, { useEffect, useState, useCallback } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import axiosClient from '../../../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

// --- Interface Definitions ---
interface Subject {
  _id: string;
  name: string;
  category: string;
  imageUrl?: string; // Added for the visual aspect of the design
}

const RecommendedSubjects: React.FC = () => {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4); // Image shows 4 cards
  const [isMobile, setIsMobile] = useState(false);


  const navigate= useNavigate()
  const fetchSubjects = useCallback(async () => {
    setLoading(false);
    try {
      const res = await axiosClient.get<Subject[]>('/api/subjects');
      setAllSubjects(res.data.filter(s => s.name));
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setVisibleCards(4);
      else if (width >= 1024) setVisibleCards(3);
      else if (width >= 768) setVisibleCards(2);
      else setVisibleCards(1.2); // Partial peek for mobile
      setIsMobile(width < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fetchSubjects]);

  const scroll = (dir: "left" | "right") => {
    const maxIndex = allSubjects.length - Math.floor(visibleCards);
    let newIndex = dir === "left" ? index - 1 : index + 1;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;
    setIndex(newIndex);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <section className="max-w-7xl mx-auto py-6 px-6 border border-gray-300 rounded-lg mb-5">
      {/* Header Section */}
      <h2 className="text-[24px] font-bold text-[#1c1c1c] tracking-tight">
        Trending Subjects for You
      </h2>
      <p className="text-[#70757a] text-[14px] mb-8">
        Explore popular topics students are learning right now.
      </p>


      <div className="relative group">
        {/* Slider Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${index * (100 / visibleCards)}%)`,
              gap: '16px' // spacing between cards
            }}
          >
            {allSubjects.map((subject) => (
              <div
                key={subject._id}
                onClick={() => navigate(`/subject/${subject._id}`)}
                className="flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden flex items-center bg-white hover:shadow-md transition-shadow"
                style={{ width: `calc(${100 / visibleCards}% - 12px)` }}
              >
                {/* Left Side: Image */}
                <div className="w-1/3 h-24 bg-gray-100 overflow-hidden">
                  <img
                    src={subject.imageUrl || 'https://via.placeholder.com/150'}
                    alt={subject.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Side: Content */}
                <div className="w-2/3 p-4 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[#1c1c1c] leading-tight truncate">
                    {subject.name}
                  </h3>
                 <span className="text-[#1a73e8] font-semibold text-sm mt-1 flex items-center gap-1 hover:underline cursor-pointer">
                    View Details <CaretRight size={12} weight="bold" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Navigation Arrows (Matching your image's style) */}
        {!isMobile && index > 0 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-xl rounded-md p-2 z-10 hover:bg-gray-50"
          >
            <CaretLeft size={15} weight="bold" />
          </button>
        )}

        {!isMobile && index < allSubjects.length - visibleCards && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-xl rounded-md p-2 z-10 hover:bg-gray-50"
          >
            <CaretRight size={15} weight="bold" />
          </button>
        )}
      </div>
    </section>
  );
};

export default RecommendedSubjects;