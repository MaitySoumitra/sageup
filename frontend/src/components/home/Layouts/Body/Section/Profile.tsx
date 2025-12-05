import { useEffect, useState, useCallback } from "react";
import { MapPin, Star, Suitcase, UserIcon, CaretLeft, CaretRight } from "@phosphor-icons/react";
import axiosClient from "../../../../api/axiosClient";
import { useNavigate } from "react-router-dom";

interface Profile {
    _id: string;
    user?: { name?: string };
    location?: string;
    experience?: number;
    description?: string;
    type?: string;
}

export const Profiles = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate()
    // --- Carousel State ---
    const [index, setIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);
    const [isMobileScroll, setIsMobileScroll] = useState(false);

    // Tailwind's 'gap-6' is typically 24px
    const gapSize = 24;

    // --- Data Fetching ---
    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/api/profiles");
            setProfiles(res.data.profiles || []);
        } catch (err) {
            console.error("Error fetching profiles:", err);
            setProfiles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    // --- Carousel and Responsiveness Logic ---
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
        if (isMobileScroll || profiles.length === 0) return;

        const maxIndex = profiles.length - visibleCards;
        let newIndex = dir === "left" ? index - 1 : index + 1;

        if (newIndex < 0) newIndex = 0;
        if (newIndex > maxIndex) newIndex = maxIndex;

        setIndex(newIndex);
    };

    const maxIndexReached = index >= profiles.length - visibleCards;

    // --- RENDER ---
    return (
        <section className="max-w-9xl mx-auto py-16 bg-white">
            <div className="container mx-auto px-6 lg:px-16">
                {/* Section heading */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#002060] mb-3 font-['Cormorant_Garamond']">
                        Find the Right Institute
                    </h2>
                    <p className="text-gray-700 text-lg">
                        Connect with trusted educators and grow your future
                    </p>
                </div>

                {loading ? (
                    <p className="text-center text-lg p-10">Searching for profiles...</p>
                ) : profiles.length === 0 ? (
                    <p className="text-center text-lg p-10">No profiles found.</p>
                ) : (


                    <div className={`relative overflow-hidden ${isMobileScroll ? 'overflow-visible' : ''} py-5`}>
                        <div className={`profile-wrapper ${isMobileScroll ? 'overflow-visible' : 'overflow-hidden'} w-full`}>

                            {/* Track and Cards */}
                            <div
                                className={`flex ${isMobileScroll ? 'gap-6 sm:gap-6 md:gap-6 lg:gap-6 px-5 py-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar' : 'gap-6 transition-transform duration-600 ease-in-out'}`}
                                style={{
                                    transform: isMobileScroll ? 'none' : `translateX(-${index * (100 / visibleCards)}%)`,
                                }}
                            >

                                {profiles.map((profile) => (
                                    <div
                                        key={profile._id}
                                        className="flex flex-col bg-white rounded-xl shadow-md hover:-translate-y-1 transition-transform overflow-hidden flex-shrink-0 snap-start h-full"
                                        style={{
                                            // Flex basis calculation to handle gaps for smooth sliding
                                            flex: isMobileScroll
                                                ? (visibleCards === 1 ? "0 0 100%" : (visibleCards === 2 ? `0 0 calc(50% - ${gapSize / 2}px)` : `0 0 calc(33.333% - ${gapSize * 2 / 3}px)`))
                                                : `0 0 calc(${100 / visibleCards}% - ${gapSize * (visibleCards - 1) / visibleCards}px)`,
                                        }}
                                    >
                                        {/* Top block */}
                                        <div className="h-40 bg-gradient-to-br from-[#E2E4EE] to-[#E5EFFE] flex items-center justify-center text-[#002060] font-semibold text-xl">
                                            {profile.user?.name || "Profile"}
                                        </div>

                                        {/* Card content */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="text-lg font-semibold text-black mb-2">
                                                {profile.user?.name}
                                            </h3>

                                            <div className="flex justify-between items-center text-gray-600 text-sm mb-2">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={16} />
                                                    {profile.location || 'N/A'}
                                                </div>
                                                {/* Static 5-star rating placeholder - needs real data integration */}
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={16} color="#ff4545" weight="fill" />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="font-semibold text-[#002060] text-sm mb-2 flex items-center gap-1">
                                                <Suitcase size={16} />
                                                {profile.experience || 0}+ yrs Experience
                                            </div>
                                            <p className="text-gray-700 text-sm mb-4 flex-1">{profile.description || "No description provided."}</p>

                                            <div className="flex justify-between items-center mt-auto">
                                                <div className="flex items-center gap-1 font-semibold text-[#002060] text-sm">
                                                    <Suitcase size={18} weight="fill" className="bg-[#E2E4EE] p-1 rounded-sm" />
                                                    {profile.type?.replace("_", " ")}
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/profile/${profile._id}`)} // Assuming you use `useNavigate`
                                                    className="flex items-center gap-1 bg-[#E2E4EE] text-[#002060] text-xs px-3 py-2 rounded-md hover:bg-gray-200 transition">
                                                    <UserIcon size={16} />
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
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
            </div>

        </section>
    );
};