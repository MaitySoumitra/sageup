import { useState, useEffect } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

// 1. DEFINE THE PROPS INTERFACE FOR StarRating
// This explicitly tells TypeScript what types 'rating' and 'color' should be.
interface StarRatingProps {
  rating: number; // Based on your data, rating is a number (e.g., 5)
  color: string;  // Based on your data, color is a string (e.g., "#f7a500")
}

// Component to render a star rating
// 2. APPLY THE INTERFACE TO THE COMPONENT PROPS
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

// 3. (Optional but recommended) DEFINE THE TESTIMONIAL ITEM INTERFACE
interface TestimonialItem {
  name: string;
  review: string;
  rating: number;
  color: string;
  image: string;
}

export const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isMobileScroll, setIsMobileScroll] = useState(false);

  // 4. APPLY THE INTERFACE TO THE TESTIMONIALS ARRAY
  const testimonials: TestimonialItem[] = [
    {
      name: "Sam Jais",
      review: "I had a very wonderful exprince with ahaan software they created our clothing brand website heliclothing( mens lcasual wear) Really apriciated their work",
      rating: 5,
      color: "#f7a500", // Orange
      image: "https://ahaanmedia.com/asc/testimonial/1.jpg",
    },
    {
      name: "Samuel Watson",
      review: "Good designing & development company. Recently, they have designed my website and currently doing marketing for Solar Installation services. Work quality is excellent and they met my expectations. Thanks to your entire team. 👍",
      rating: 5,
      color: "#4CAF50", // Green
      image: "https://ahaanmedia.com/asc/testimonial/3.jpg",
    },
    {
      name: "Rosanna Feyerabend",
      review: "Disciplined job and are ethically trustworthy. The team of this company are always available for inquiries and questions, and they provide support, key insight, ideas and direction when possible. I think they have a good team, well organized and efficient with their time. Nice experience with this company that designed my business website.",
      rating: 5,
      color: "#f44336", // Red
      image: "https://ahaanmedia.com/asc/testimonial/2.jpg",
    },
    {
      name: "Aman Jaiswal",
      review: "We partnered with this company for both social media branding and website development, and the results have been fantastic. Our business conversions increased by 50% thanks to their effective strategies and high-quality work. The team is knowledgeable, creative, and results-driven. Highly recommended for any business looking to grow!",
      rating: 5,
      color: "#2196F3", // Blue
      image: "https://ahaanmedia.com/asc/testimonial/7.jpg",
    },
    {
      name: "Dennis Johnson",
      review: "These guys did a wonderful job and very quickly, the page was so nice, I already hired them to redo the whole site. will use again and again",
      rating: 5,
      color: "#f7a500", // Orange
      image: "https://ahaanmedia.com/asc/testimonial/6.jpg",
    },
    {
      name: "Valynn Johnson",
      review: "All I can say is WOW. This company did exactly what they said they would do and went over the top with ideas to better my Website. THANK YOU!!",
      rating: 5,
      color: "#4CAF50", // Green
      image: "https://ahaanmedia.com/asc/testimonial/5.jpg",
    },
    {
      name: "Dr. Kunal Dey",
      review: "It was a great experience to work with Vishal, he did the job beyond my expectations, highly recommend. Easy to communicate with and on time , I would actually say before time. Will hire him again!",
      rating: 5,
      color: "#f44336", // Red
      image: "https://ahaanmedia.com/asc/testimonial/4.jpg",
    },
  ];

  // Set visible cards based on screen width
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      let newVisibleCards;
      if (width >= 1024) newVisibleCards = 3; // lg:
      else if (width >= 768) newVisibleCards = 2; // md:
      else newVisibleCards = 1; // Default/sm:

      setVisibleCards(newVisibleCards);
      setIsMobileScroll(width < 992); // Set mobile scroll state (original CSS used 991px breakpoint)
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // Scroll left/right
  const scroll = (dir: "left" | "right") => {
    if (isMobileScroll) return; // Prevent scroll logic if on mobile scroll mode

    const maxIndex = testimonials.length - visibleCards;
    let newIndex = dir === "left" ? index - 1 : index + 1;
    
    // Clamp the index
    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;

    setIndex(newIndex);
  };

  const maxIndexReached = index >= testimonials.length - visibleCards;

  return (
    <div className=" max-w-9xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center ">
        <h6 className="subtitle text-lg font-semibold text-gray-500 mb-2">
          Testimonials <span className="inline-block w-8 h-px bg-gray-400 align-middle ml-2"></span>
        </h6>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
        <p className="max-w-3xl mx-auto mb-10 text-gray-600">
          Driven to be future-ready, and push beyond the building blocks of
          technology, digital, and marketing, Ahaan Software Consulting proudly
          participated in The Asia Business Show 2024 in Singapore—the powerhouse
          of innovation and enterprise!
        </p>
      </div>
      {/* End Header Section */}

      {/* Testimonial Slider */}
      <div className={`relative overflow-hidden ${isMobileScroll ? 'overflow-visible' : ''} py-10`}>
        <div className={`testimonial-wrapper ${isMobileScroll ? 'overflow-visible' : 'overflow-hidden'} w-full`}>
          
          {/* Track and Cards */}
          <div
            className={`flex ${isMobileScroll ? 'gap-10 sm:gap-10 md:gap-8 lg:gap-5 px-5 py-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar' : 'py-5 gap-5 transition-transform duration-600 ease-in-out'}`}
            style={{
              transform: isMobileScroll ? 'none' : `translateX(-${index * (100 / visibleCards)}%)`,
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`testimonial-card relative p-3 transition-all duration-300 flex flex-col snap-start`}
                style={{
                  flex: isMobileScroll 
                        ? (visibleCards === 1 ? "0 0 100%" : (visibleCards === 2 ? "0 0 calc(50% - 20px)" : "0 0 calc(33.333% - 14px)"))
                        : `0 0 calc(${100 / visibleCards}% - ${20 * (visibleCards - 1) / visibleCards}px)`, // Adjust gap in flex basis for non-mobile
                  // Note: The original CSS had a gap of 20px, 30px, 40px depending on screen size. This Tailwind uses `gap-5` (20px) and adjusts mobile via `gap-10` + `px-5`.
                }}
              >
                {/* Custom ::before element simulation using a separate div and absolute positioning */}
                <div 
                  className="absolute top-0 right-0 h-full w-4/5 z-10 rounded-[30px]"
                  style={{
                    backgroundColor: t.color,
                    clipPath: "polygon(70% 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                ></div>

                {/* Testimonial Content Card */}
                <div className="relative z-20 flex flex-col justify-between bg-white rounded-[30px] shadow-xl p-5 md:p-8 h-full shadow-[rgba(88,66,25,0.3)_0px_5px_25px]">
                  
                  {/* Quote Icon */}
                  <div
                    className="absolute top-[-15px] left-[-10px] bg-white w-[50px] h-[50px] rounded-full pt-[10px] shadow-md flex justify-center items-center text-[48px] font-black opacity-100 z-10"
                    style={{ color: t.color }}
                  >
                  “
                  </div>
                  
                  {/* Review Text */}
                  <div className="testimonial-text mb-4 mt-8">
                    <p className="text-[15px] leading-relaxed text-gray-700">{t.review}</p>
                  </div>
                  
                  {/* Name and Rating */}
                  <div className="mt-auto">
                    <h3 className="text-lg font-bold ml-8 mb-1" style={{ color: t.color }}>{t.name}</h3>
                    <StarRating rating={t.rating} color={t.color} />
                  </div>
                </div>

                {/* User Icon Container */}
                <div
                  className="absolute bottom-[-20px] right-[-20px] w-20 h-20 rounded-full bg-white flex justify-center items-center shadow-lg z-50 overflow-hidden"
                  style={{ border: `6px solid ${t.color}` }}
                >
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow Button (Hidden on mobile via media query/logic) */}
          <button
            className={`hidden lg:flex testimonial-arrow-btn left absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-xl shadow-md justify-center items-center cursor-pointer transition-all duration-300 border-0 ${index === 0 ? "opacity-30 pointer-events-none" : "hover:bg-gray-50"} left-[-8px]`}
            onClick={() => scroll("left")}
            disabled={index === 0}
          >
            <CaretLeft className="text-gray-700" />
          </button>

          {/* Right Arrow Button (Hidden on mobile via media query/logic) */}
          <button
            className={`hidden lg:flex testimonial-arrow-btn right absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-xl shadow-md justify-center items-center cursor-pointer transition-all duration-300 border-0 ${maxIndexReached ? "opacity-30 pointer-events-none" : "hover:bg-gray-50"} right-[-10px]`}
            onClick={() => scroll("right")}
            disabled={maxIndexReached}
          >
            <CaretRight className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

