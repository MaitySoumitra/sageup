import { MapPin, Star, Book, Laptop } from "@phosphor-icons/react";

const features = [
  { icon: <MapPin size={24} color="#f4dfbd" />, title: "Location", desc: "Conveniently located institutes near you" },
  { icon: <Star size={24} color="#f4dfbd" weight="fill" />, title: "Ratings", desc: "Top-rated by thousands of students" },
  { icon: <Book size={24} color="#f4dfbd" weight="fill" />, title: "Courses", desc: "Diverse courses for all career paths" },
  { icon: <Laptop size={24} color="#f4dfbd" />, title: "Online", desc: "Access learning from anywhere" },
];

export const Features = () => {
  return (
    <section className="max-w-9xl mx-auto py-16 px-6 lg:px-16 text-center">
      {/* Section Heading */}
      <div className="mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-3">Why Choose SageUp?</h2>
        <p className="text-gray-700 text-lg">
          We provide the best platform to discover and connect with top coaching institutes
        </p>
      </div>

      {/* Feature Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center bg-[#E2E4EE] text-[#002060] rounded-xl p-5 min-w-[260px] max-w-[300px] shadow-lg hover:-translate-y-1 transition-transform"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              {feature.icon}
            </div>
            <div className="text-left">
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
