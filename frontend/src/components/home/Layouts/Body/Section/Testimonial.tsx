import { useState, useEffect, useCallback, useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import axiosClient from "../../../../api/axiosClient";

// --- 1. INTERFACE DEFINITIONS (Kept as is) ---

// Define the shape of the dynamic review data from the backend
interface DynamicReview {
    _id: string;
    review: string; // The review text
    rating: number; // The star rating (1-5)
    createdAt: string;
    user: { 
        name: string;
        profilePicture?: string;
    };
    profile: {
        _id: string;
        user: { 
            name: string;
        };
        type: string;
    };
}

// Define the interface for a single item rendered in the carousel
interface TestimonialCardData {
    id: string;
    name: string;
    review: string;
    rating: number;
    color: string; 
    image: string;
    teacherName: string;
}

interface StarRatingProps {
    rating: number;
    color: string;
}

// Component to render a star rating (Kept as is)
const StarRating = ({ rating, color }: StarRatingProps) => (
    <div className="mt-4 text-2xl leading-none tracking-[5px] text-gray-300">
        {Array(5)
            .fill(0)
            .map((_, j) => (
                <span
                    key={j}
                    style={{ color: j < rating ? color : "#ccc" }}
                    className="inline-block"
                >
                    ★
                </span>
            ))}
    </div>
);

// --- Debounce Utility ---
const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout:number;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

// --- 2. REVIEW SUBMISSION SUB-COMPONENT (Updated for Autocomplete) ---

const ReviewSubmissionSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Color palette
    const PRIMARY_COLOR = "#013F63"; // Dark Blue

    // Simple Star Rating for input
    const SimpleStarRatingInput = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => (
        <div className="flex text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
                <span 
                    key={star} 
                    onClick={() => setRating(star)}
                    style={{ color: star <= rating ? PRIMARY_COLOR : "#ccc" }}
                >
                    ★
                </span>
            ))}
        </div>
    );

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            if (term.length < 2) {
                setSearchResults([]);
                return;
            }
            try {
                // Remove the leading '@' for the API call
                const cleanTerm = term.startsWith('@') ? term.substring(1) : term;
                const res = await axiosClient.get(`/api/profiles/search?name=${cleanTerm}`);
                setSearchResults(res.data.results || []);
            } catch (error) {
                console.error('Search failed:', error);
            }
        }, 300), 
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        setSelectedProfileId(null);
        setSelectedProfileName(null);
        setMessage(null);

        // Only search if term starts with '@' and has subsequent characters
        if (term.startsWith('@') && term.length > 1) {
            debouncedSearch(term);
        } else if (!term.startsWith('@')) {
             setSearchResults([]);
        }
    };

    const handleSelectProfile = (profile: any) => {
        setSelectedProfileId(profile._id);
        setSelectedProfileName(profile.user.name);
        // Set the input field to the selected name (optional, but good UX)
        setSearchTerm(`@${profile.user.name}`); 
        setSearchResults([]); // Hide search results
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProfileId || rating === 0 || reviewText.length < 10) {
            setMessage({ type: 'error', text: 'Please select a teacher, complete all fields (min 10 chars review).' });
            return;
        }

        try {
            const res = await axiosClient.post('/api/reviews', {
                profileId: selectedProfileId,
                review: reviewText,
                rating: rating
            }, { withCredentials: true });

            setMessage({ type: 'success', text: res.data.message || 'Review submitted successfully! Refreshing reviews...' });
            // Reset form after successful submission
            setReviewText('');
            setRating(0);
            setSelectedProfileId(null);
            setSearchTerm('');
            // NOTE: You might want to trigger a refresh of the main Testimonials list here (not implemented, but recommended)
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Error submitting review. Check login status (must be Student).';
            setMessage({ type: 'error', text: msg });
        }
    };

    return (
        <div className="p-8 bg-gray-50 border border-gray-200 rounded-xl mb-12 shadow-md">
            <h3 className="text-2xl font-bold mb-4" style={{ color: PRIMARY_COLOR }}>✍️ Submit Your Review</h3>
            {/* 1. Teacher Search (Autocomplete/Suggest) */}
            <div className="mb-6 relative">
                <label className="block text-md font-medium text-gray-700 mb-2">Teacher Profile</label>
                
                <input
                    type="text"
                    placeholder="@Type teacher name here..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={`w-full p-2 border rounded-lg ${selectedProfileId ? 'border-green-500' : 'border-gray-300'}`}
                />

                {/* Search Results Dropdown */}
                {searchTerm.startsWith('@') && searchTerm.length > 1 && searchResults.length > 0 && !selectedProfileId && (
                    <div className="absolute z-30 w-full mt-1 border border-gray-300 rounded-lg max-h-40 overflow-y-auto bg-white shadow-lg">
                        {searchResults.map((profile) => (
                            <div
                                key={profile._id}
                                className="p-3 border-b cursor-pointer hover:bg-indigo-50"
                                onClick={() => handleSelectProfile(profile)}
                            >
                                <span className="font-medium">{profile.user.name}</span> <span className="text-xs text-gray-500">({profile.type})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. Review Submission Form */}
            
                <form onSubmit={handleSubmit} className="">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <SimpleStarRatingInput rating={rating} setRating={setRating} />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial</label>
                        <textarea
                            id="reviewText"
                            rows={2} // Decreased height
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Share your honest experience (max 500 characters)..."
                            maxLength={500}
                        />
                    </div>

                    <button
                        type="submit"
                        className=" py-2 px-4 font-bold rounded-lg transition duration-150 bg-[#1B9B7D] text-white"
                    >
                        Post Review
                    </button>
                </form>
            {/* Message Display */}
            {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};


// --- 3. MAIN TESTIMONIALS COMPONENT (FETCHES AND RENDERS REVIEWS - Updated) ---

export const Testimonials = () => {
    const [index, setIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);
    const [isMobileScroll, setIsMobileScroll] = useState(false);
    const [allReviews, setAllReviews] = useState<DynamicReview[]>([]);
    const [loading, setLoading] = useState(true);

    // Color cycle updated to use the two requested colors
    const COLOR_CYCLE = ["#1B9B7D", "#013F63"]; // Teal and Dark Blue

    const PRIMARY_COLOR = "#013F63"; // Dark Blue

    // Transform dynamic review data into the structure the carousel expects
    const testimonialCards: TestimonialCardData[] = useMemo(() => {
        return allReviews.map((review, i) => ({
            id: review._id,
            name: review.user.name, // Reviewer's name
            review: review.review,
            rating: review.rating,
            color: COLOR_CYCLE[i % COLOR_CYCLE.length], // Cycle through colors
            image: review.user.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg", 
            teacherName: review.profile.user.name, // Teacher's name
        }));
    }, [allReviews]);

    // Data Fetching Logic (kept as is)
    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/api/reviews?limit=50'); 
            setAllReviews(res.data.reviews || []);
        } catch (err) {
            console.error('Failed to fetch all reviews:', err);
            setAllReviews([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);


    // --- Carousel and Responsiveness Logic (kept as is) ---
    useEffect(() => {
        const updateVisibleCards = () => {
            const width = window.innerWidth;
            let newVisibleCards;
            if (width >= 1024) newVisibleCards = 3;
            else if (width >= 768) newVisibleCards = 2;
            else newVisibleCards = 1;

            setVisibleCards(newVisibleCards);
            setIsMobileScroll(width < 992);
        };

        updateVisibleCards();
        window.addEventListener("resize", updateVisibleCards);
        return () => window.removeEventListener("resize", updateVisibleCards);
    }, []);

    const scroll = (dir: "left" | "right") => {
        if (isMobileScroll || testimonialCards.length === 0) return;

        const maxIndex = testimonialCards.length - visibleCards;
        let newIndex = dir === "left" ? index - 1 : index + 1;
        
        if (newIndex < 0) newIndex = 0;
        if (newIndex > maxIndex) newIndex = maxIndex;

        setIndex(newIndex);
    };

    const maxIndexReached = index >= testimonialCards.length - visibleCards;

    // --- RENDER ---
    return (
        <div className=" max-w-9xl mx-auto px-4 py-12">
            
            {/* 🎯 Simplified Header/Title */}
            <div className="text-center ">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-10" style={{ color: PRIMARY_COLOR }}>
                    Student Testimonials 📚
                </h2>
            </div>
            {/* --- */}

            {loading ? (
                <p className="text-center text-lg p-10">Fetching latest reviews...</p>
            ) : testimonialCards.length === 0 ? (
                <p className="text-center text-lg p-10">No reviews have been posted yet. Be the first!</p>
            ) : (
                
                <div className={`relative overflow-hidden ${isMobileScroll ? 'overflow-visible' : ''} py-10`}>
                    <div className={`testimonial-wrapper ${isMobileScroll ? 'overflow-visible' : 'overflow-hidden'} w-full`}>
                        
                        {/* Track and Cards */}
                        <div
                            className={`flex ${isMobileScroll ? 'gap-10 sm:gap-10 md:gap-8 lg:gap-5 px-5 py-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar' : 'py-5 gap-5 transition-transform duration-600 ease-in-out'}`}
                            style={{
                                transform: isMobileScroll ? 'none' : `translateX(-${index * (100 / visibleCards)}%)`,
                            }}
                        >
                            {testimonialCards.map((t) => (
                                <div
                                    key={t.id}
                                    className={`testimonial-card relative p-3 transition-all duration-300 flex flex-col snap-start`}
                                    style={{
                                        flex: isMobileScroll 
                                            ? (visibleCards === 1 ? "0 0 100%" : (visibleCards === 2 ? "0 0 calc(50% - 20px)" : "0 0 calc(33.333% - 14px)"))
                                            : `0 0 calc(${100 / visibleCards}% - ${20 * (visibleCards - 1) / visibleCards}px)`,
                                    }}
                                >
                                    {/* Custom ::before element simulation */}
                                    <div 
                                        className="absolute top-0 right-0 h-full w-4/5 z-10 rounded-[30px]"
                                        style={{
                                            backgroundColor: t.color,
                                            clipPath: "polygon(70% 0, 100% 0, 100% 100%, 0 100%)",
                                        }}
                                    ></div>

                                    {/* Testimonial Content Card (Decreased height elements) */}
                                    <div className="relative z-20 flex flex-col justify-between bg-white rounded-[30px] shadow-xl p-5 md:p-6 h-full ">
                                        
                                        {/* Quote Icon */}
                                        <div
                                            className="absolute top-[-15px] left-[-10px] bg-white w-[45px] h-[45px] rounded-full pt-[8px] shadow-md flex justify-center items-center text-[40px] font-black opacity-100 z-10"
                                            style={{ color: t.color }}
                                        >
                                            “
                                        </div>
                                        
                                        {/* Review Text */}
                                        <div className="testimonial-text mb-4 mt-8 flex-1">
                                            <p className="text-[14px] leading-relaxed text-gray-700">
                                                <span className="font-semibold text-sm block mb-1" style={{ color: t.color }}>
                                                    — Reviewed Teacher: {t.teacherName}
                                                </span>
                                                {t.review}
                                            </p>
                                        </div>
                                        
                                        {/* Name and Rating */}
                                        <div className="mt-auto">
                                            <h3 className="text-md font-bold ml-8 mb-1" style={{ color: t.color }}>{t.name}</h3>
                                            <StarRating rating={t.rating} color={t.color} />
                                        </div>
                                    </div>

                                    {/* User Icon Container (Smaller) */}
                                    <div
                                        className="absolute bottom-[-15px] right-[-15px] w-16 h-16 rounded-full bg-white flex justify-center items-center shadow-lg z-50 overflow-hidden"
                                        style={{ border: `4px solid ${t.color}` }}
                                    >
                                        <img src={t.image} alt={t.name} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Arrows (Kept styling consistent) */}
                        <button
                            className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-xl shadow-md justify-center items-center transition-all duration-300 border-0 ${index === 0 ? "opacity-30 pointer-events-none" : "hover:bg-gray-50"} left-[-8px]`}
                            onClick={() => scroll("left")}
                            disabled={index === 0}
                        >
                            <CaretLeft className="text-gray-700" />
                        </button>

                        <button
                            className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-xl shadow-md justify-center items-center transition-all duration-300 border-0 ${maxIndexReached ? "opacity-30 pointer-events-none" : "hover:bg-gray-50"} right-[-10px]`}
                            onClick={() => scroll("right")}
                            disabled={maxIndexReached}
                        >
                            <CaretRight className="text-gray-700" />
                        </button>
                    </div>
                </div>
            )}
            
            {/* 🎯 REVERSED ORDER: Review Submission comes after the list */}
            <ReviewSubmissionSection />
        </div>
    );
};