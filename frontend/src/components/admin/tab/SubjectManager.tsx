import React, { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
// Interfaces imported from useSampleData.ts (simplified here)
interface Subject {
  _id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  location?: string;
  availability: {
    days: string[];
    timeSlots: string[];
  };
}
interface User { name: string; }

interface SubjectManagerProps {
  user: User;
  subjects: Subject[];
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ user, subjects }) => {
  const [showForm, setShowForm] = useState(false);
  const totalHours = subjects.reduce((total, sub) => {
    return total + ((sub.availability?.timeSlots?.length || 0) * (sub.availability?.days?.length || 0));
  }, 0);
  const totalDays = subjects.reduce((total, sub) => {
    return total + (sub.availability?.days?.length || 0);
  }, 0);
  
  // Edit/Delete handlers would typically update the state/call an API
  const handleEdit = (id: string) => {
    // Logic to load subject data into the form and show it
    console.log('Editing subject:', id);
    setShowForm(true); 
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      console.log('Deleting subject:', id);
    }
  };

  return (
    <div className="subject-dashboard max-w-6xl">
      <div className="top-section flex justify-between items-start flex-wrap mb-8 gap-4">

        <div className="flex-1 min-w-[200px] bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800">👋 {user.name}!</h3>
          <button className="flex items-center gap-2 p-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} weight="bold" />
            New Subject
          </button>
        </div>

        {/* Statistics Boxes */}
        <StatBox title="Total Subjects" value={subjects.length} />
        <StatBox title="Total Hours / Week" value={`${totalHours} hrs`} />
        <StatBox title="Total Days / Week" value={`${totalDays} days`} />
      </div>

      {/* Subject Form */}
      {showForm && (
        <div className="form-container bg-gray-50 p-6 rounded-xl mb-6">
          <form className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Create Subject</h3>
            {/* Form fields here */}
            <button type="submit" className="mt-4 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
              Create Subject
            </button>
          </form>
        </div>
      )}

      {/* Subjects Table */}
      <table className="subject-table w-full bg-white rounded-lg shadow-md mt-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Serial</th>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Level</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Days</th>
            <th className="p-3 text-left">Time Slots</th>
            <th className="p-3 text-center w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={subject._id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-bold text-indigo-600">#SUB{(index + 1).toString().padStart(2, '0')}</td>
              <td className="p-3">{subject.name}</td>
              <td className="p-3">{subject.category || 'N/A'}</td>
              <td className="p-3">{subject.level}</td>
              <td className="p-3">{subject.location || 'N/A'}</td>
              <td className="p-3">{subject.availability.days.join(', ')}</td>
              <td className="p-3">{subject.availability.timeSlots.join(' , ')}</td>
              <td className="p-3 text-center space-x-2">
                <a onClick={() => handleEdit(subject._id)} title="Edit" className="cursor-pointer text-blue-500 hover:text-blue-700">👁️</a>
                <span>|</span>
                <a onClick={() => handleDelete(subject._id)} title="Delete" className="cursor-pointer text-red-500 hover:text-red-700">🗑️</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper component for the stat boxes
const StatBox: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="flex-1 min-w-[150px] p-6 rounded-xl text-center bg-sky-100 shadow-md">
    <h4 className="text-sm text-gray-600">{title}</h4>
    <p className="text-xl font-bold text-blue-800 mt-2">{value}</p>
  </div>
);

export default SubjectManager;