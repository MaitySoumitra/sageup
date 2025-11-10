import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Star,  Suitcase,  UserIcon,  SuitcaseIcon,  } from "@phosphor-icons/react";

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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/profiles");
        setProfiles(res.data.profiles);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <section className="max-w-9xl mx-auto py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#002060] mb-3">
            Find the Right Institute
          </h2>
          <p className="text-gray-700 text-lg">
            Connect with trusted educators and grow your future
          </p>
        </div>

        {/* Profiles grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="flex flex-col bg-white rounded-xl shadow-md hover:-translate-y-1 transition-transform overflow-hidden"
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
                    {profile.location}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} color="#ff4545" weight="fill" />
                    ))}
                  </div>
                </div>

                <div className="font-semibold text-[#002060] text-sm mb-2 flex items-center gap-1">
                  <Suitcase size={16} />
                  {profile.experience || 0}+ yrs
                </div>

                <p className="text-gray-700 text-sm mb-4">{profile.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 font-semibold text-[#002060] text-sm">
                    <SuitcaseIcon  size={18} weight="fill" className="bg-[#E2E4EE] p-1 rounded-sm" />
                    {profile.type?.replace("_", " ")}
                  </div>
                  <button className="flex items-center gap-1 bg-[#E2E4EE] text-[#002060] text-xs px-3 py-2 rounded-md hover:bg-gray-200 transition">
                    <UserIcon size={16} />
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
