
import skillDevelopmentImg from '../../../../../assets/skill-development-image.jpg';
import onlineTutoringImg from '../../../../../assets/online-tutoring.jpg';
import careerCounselingImg from '../../../../../assets/career-counseling.jpg';
import examPreparationImg from '../../../../../assets/exam-preparation-image.jpg';

interface Service {
  title: string;
  description: string;
  image: string;
}

export const educationServices: Service[] = [
  {
    title: 'Online Tutoring',
    description:
      'Connect with expert tutors for personalized online learning sessions across various subjects and grade levels.',
    image: onlineTutoringImg,
  },
  {
    title: 'Exam Preparation',
    description:
      'Comprehensive coaching and resources to help students excel in board exams, entrance tests, and competitive assessments.',
    image: examPreparationImg,
  },
  {
    title: 'Skill Development',
    description:
      'Enhance your skills with specialized courses in coding, communication, and other essential areas for academic and career growth.',
    image: skillDevelopmentImg,
  },
  {
    title: 'Career Counseling',
    description:
      'Get expert guidance on course selection, career paths, and higher education opportunities tailored to your interests.',
    image: careerCounselingImg,
  },
];

export const ServicesSection = () => {
  return (
    <section className="max-w-9xl mx-auto relative bg-white py-20 px-4 md:px-8">
      {/* Top curve */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-blue-600 to-blue-200 rounded-b-[50%] z-0" />

      {/* Intro text */}
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trusted Learning for Every Student
        </h2>
        <p className="text-white text-base md:text-lg max-w-xl mx-auto">
          Explore our wide range of educational services for academic growth, skill enhancement, and career development.
        </p>
      </div>

      {/* Services grid */}
      <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {educationServices.map((service, index) => (
          <div
            key={index}
            className="relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl"
            style={{ backgroundImage: `url(${service.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-white/90 to-transparent p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-700">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div className="relative z-10 mt-12 text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition">
          Explore All Services
        </button>
      </div>
    </section>
  );
};


