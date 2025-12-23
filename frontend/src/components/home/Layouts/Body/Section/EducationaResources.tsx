import React from 'react';
import { File, Clipboard, Book, Plus } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

interface ResourceTile {
  title: string;
  slug:string,
  icon: React.ReactNode;

}

const resourceTiles: ResourceTile[] = [
  { 
    title: 'Question Papers', 
    slug: 'question', // Matches backend enum 'question'
    icon: <File size={28} /> 
  },
  { 
    title: 'Exam Notes', 
    slug: 'note', // Matches backend enum 'note'
    icon: <Clipboard size={28} /> 
  },
  { 
    title: 'Solutions', 
    slug: 'solution', // Matches backend enum 'solution'
    icon: <Book size={28} /> 
  }
];

const EducationalResources: React.FC = () => {
  return (
    <section className="max-w-9xl mx-auto flex flex-col md:flex-row bg-[#0e1a1a] text-white p-8 md:p-16 font-sans">
      {/* Sidebar Title */}
      <div className="md:min-w-[200px] h-full md:pr-10 border-l-4 border-[#00ffc3] pl-4 mb-8 md:mb-0">
        <h2 className="text-2xl font-bold leading-snug font-['Cormorant_Garamond']">
          Explore
          <br />
          Educational
          <br />
          Resources
        </h2>
      </div>

      {/* Tile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {resourceTiles.map((item, index) => (
          <Link
          to={`/libraries/${item.slug}`}
            key={index}
            className="relative bg-[#1cd99d] rounded-xl p-6 flex flex-col items-start shadow-lg transform transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="absolute top-3 right-3 text-black">
              <Plus size={16} weight="fill" />
            </div>
            <div className="text-black mb-5">{item.icon}</div>
            <h3 className="text-black text-lg font-semibold">{item.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default EducationalResources;
