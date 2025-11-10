
import MainImg from "../../../../assets/banner.jpg";
import student1 from "../../../../assets/student1.jfif";
import student2 from "../../../../assets/student2.jpg";
import student3 from "../../../../assets/student3.webp";
import student4 from "../../../../assets/student4.jfif";

export const Banner = () => {
  return (
    <div className="max-w-9xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-5 px-6 lg:px-16 py-16 relative bg-[#fcfbfe]">
      {/* Left Content */}
      <div className="flex-1 max-w-lg">
        <h1 className="text-4xl lg:text-5xl font-bold mb-5 leading-tight">
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
          <button className="border-2 border-[#002060] text-[#002060] py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-[#002060] hover:text-white transition">
            <span>▶</span> PLAY VIDEO
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex justify-center items-center relative mt-10 lg:mt-0">
        {/* Main Image */}
        <img
          src={MainImg}
          alt="Main Student"
          className="w-80 lg:w-96 rounded-xl shadow-lg relative z-10"
        />

        {/* Circle Images */}
        <img
          src={student1}
          alt="Student"
          className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white shadow-lg absolute -top-2 left-32"
        />
        <img
          src={student2}
          alt="Student"
          className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white shadow-lg absolute -top-10 right-5"
        />
        <img
          src={student3}
          alt="Student"
          className="w-32 h-40 lg:w-36 lg:h-48 rounded-2xl object-cover border-4 border-white shadow-lg absolute -bottom-2 left-20"
        />
        <img
          src={student4}
          alt="Student"
          className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white shadow-lg absolute -bottom-10 right-5"
        />

        {/* Background Shapes */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-52 h-52 bg-[#002060] rounded-b-[60%] opacity-10 top-1/5 left-[70%]"></div>
          <div className="absolute w-30 h-30 bg-[#1e90ff] rounded-b-[60%] opacity-10 top-3/5 left-[80%]"></div>
          <div className="absolute w-24 h-24 bg-[#fdb813] rounded-b-[60%] opacity-10 bottom-10 left-[60%]"></div>
        </div>
      </div>
    </div>
  );
};


