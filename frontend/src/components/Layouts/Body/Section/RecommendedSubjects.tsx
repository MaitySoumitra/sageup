import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Clock } from '@phosphor-icons/react';

interface Availability {
  days?: string[];
  timeSlots?: string[];
}

interface User {
  name: string;
}

interface Subject {
  _id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  location?: string;
  availability?: Availability;
  user?: User;
}

const RecommendedSubjects: React.FC = () => {
  const [topSubjects, setTopSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get<Subject[]>('http://localhost:3000/api/subjects');

        const grouped: Record<'beginner' | 'intermediate' | 'advanced', Subject | null> = {
          beginner: null,
          intermediate: null,
          advanced: null,
        };

        for (let subject of res.data) {
          const level = subject.level;
          if (!grouped[level]) {
            grouped[level] = subject; // take first found subject per level
          }
        }

        const top = Object.values(grouped).filter(Boolean) as Subject[];
        setTopSubjects(top);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, []);

  const levelColors: Record<Subject['level'], string> = {
    beginner: 'border-l-4 border-green-500',
    intermediate: 'border-l-4 border-yellow-500',
    advanced: 'border-l-4 border-red-500',
  };

  return (
    <section className="max-w-9xl mx-auto bg-gray-100 py-12 px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Course Offered</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our top subjects tailored for your learning journey
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topSubjects.map((subject) => (
          <div
            key={subject._id}
            className={`bg-white p-6 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 ${levelColors[subject.level]}`}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{subject.name}</h3>
            <p className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm mb-3">
              {subject.category}
            </p>
            <p className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <MapPin size={16} weight="fill" /> {subject.location || 'N/A'}
            </p>
            {subject.availability?.days?.length && (
              <p className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock size={16} weight="fill" /> {subject.availability.days.join(', ')}{' '}
                {subject.availability.timeSlots?.length ? `(${subject.availability.timeSlots.join(', ')})` : ''}
              </p>
            )}
            {subject.user?.name && (
              <p className="mt-3 text-gray-400 italic text-sm">By {subject.user.name}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedSubjects;
