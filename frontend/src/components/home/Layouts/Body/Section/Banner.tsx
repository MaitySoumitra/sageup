
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const Banner = () => {
  return (
    <div className=" max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-5 px-4 md:px-6 py-4 relative">
      {/* Left Content */}
      <div className="flex-1 max-w-lg">
        <h1 className="text-4xl lg:text-5xl font-bold mb-5 leading-tight font-['Cormorant_Garamond']">
          START A CAREER. <br /> HIRE A STAR.
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          We bring talented young adults and top companies together to launch
          careers, power business, and build community.
        </p>
        <div className="flex gap-5">
          <button className="bg-[#002060] text-white py-3 px-6 rounded-lg hover:opacity-90 transition">
            BECOME A STUDENT
          </button>
        </div>
      </div>
      <div className=" flex-1 flex justify-center items-center relative mt-10 lg:mt-0">
        <DotLottieReact
          autoplay
          loop
          src="https://lottie.host/e6dd9468-f110-4022-96ad-8896981e48be/pvRjOkmiJw.lottie"
          style={{ height: "400px", width: "400px" }}
        />

        {/* Background Shapes */}
        
      </div>
    </div>
  );
};
