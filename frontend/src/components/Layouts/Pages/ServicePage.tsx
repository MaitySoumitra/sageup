import { useState } from "react";
import {
  educationServices
} from "../Body/Section/Services"; // Adjust path based on your structure

export const ServicesSection = () => {
  const [showFullLayout, setShowFullLayout] = useState(false);

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 md:px-8 bg-white relative">

      {/* Top curve */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-blue-600 to-blue-200 rounded-b-[50%] z-0" />

      {/* Intro */}
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trusted Learning for Every Student
        </h2>
        <p className="text-white text-base md:text-lg max-w-xl mx-auto">
          Explore our wide range of educational services for academic growth, skill enhancement, and career development.
        </p>
      </div>

      {/* If button not clicked → show simple grid */}
      {!showFullLayout && (
        <>
          {/* Simple grid preview */}
          <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {educationServices.map((service, index) => (
              <div
                key={index}
                className="relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  backgroundImage: `url(${service.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-white/90 to-transparent p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-700">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div className="relative z-10 mt-12 text-center">
            <button
              onClick={() => setShowFullLayout(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition"
            >
              Explore All Services
            </button>
          </div>
        </>
      )}

      {/* ===========================
          FULL LAYOUT (same as old grid)
          =========================== */}
      {showFullLayout && (
        <div className="space-y-20 relative z-10">

          {educationServices.map((service, index) => {
            const isReverse = index % 2 !== 0;

            return (
              <div
                key={service.title}
                className={`grid md:grid-cols-2 gap-10 items-center ${
                  isReverse ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`rounded-2xl shadow-xl overflow-hidden transform transition hover:scale-[1.03] ${
                    isReverse ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div
                  className={`md:px-6 ${
                    isReverse ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                    {service.title}
                  </h1>

                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition">
                    Learn More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
