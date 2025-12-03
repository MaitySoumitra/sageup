import React, { useEffect, useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import axiosClient from '../../../api/axiosClient'; // your axios instance
import type { Subject, User } from '../profile';

interface SubjectManagerProps {
  user: User;
  subjects:Subject[]
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ user }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: '',
    category: '',
    level: 'beginner',
    location: '',
    availability: { days: [], timeSlots: [] },
  });

  // Fetch subjects created by logged-in user
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/subjects/my', { withCredentials: true });
      setSubjects(res.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle form submission for creating a new subject
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/api/subjects', newSubject, { withCredentials: true });
      setSubjects(prev => [...prev, res.data]);
      setShowForm(false);
      setNewSubject({
        name: '',
        category: '',
        level: 'beginner',
        location: '',
        availability: { days: [], timeSlots: [] },
      });
    } catch (err) {
      console.error('Error creating subject:', err);
    }
  };

  // Delete subject
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;

    try {
      await axiosClient.delete(`/api/subjects/${id}`, { withCredentials: true });
      setSubjects(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  // Edit subject (simplified: just toggles the form, implement full editing as needed)
  const handleEdit = (subject: Subject) => {
    setShowForm(true);
    setNewSubject(subject);
  };

  // Stats
  const totalHours = subjects.reduce(
    (total, sub) => total + ((sub.availability?.timeSlots?.length || 0) * (sub.availability?.days?.length || 0)),
    0
  );
  const totalDays = subjects.reduce((total, sub) => total + (sub.availability?.days?.length || 0), 0);

  if (loading) return <p>Loading subjects...</p>;

  return (
    <div className="subject-dashboard max-w-6xl mx-auto p-6">
      <div className="top-section flex justify-between items-start flex-wrap mb-8 gap-4">
        <div className="flex-1 min-w-[200px] bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800">👋 {user.name}!</h3>
          <button
            className="flex items-center gap-2 p-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={20} weight="bold" />
            {showForm ? 'Cancel' : 'New Subject'}
          </button>
        </div>

        <StatBox title="Total Subjects" value={subjects.length} />
        <StatBox title="Total Hours / Week" value={`${totalHours} hrs`} />
        <StatBox title="Total Days / Week" value={`${totalDays} days`} />
      </div>

      {/* Subject Form */}
      {showForm && (
        <div className="form-container bg-gray-50 p-6 rounded-xl mb-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              {newSubject._id ? 'Edit Subject' : 'Create Subject'}
            </h3>

            <input
              type="text"
              placeholder="Name"
              value={newSubject.name || ''}
              onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
              required
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Category"
              value={newSubject.category || ''}
              onChange={e => setNewSubject({ ...newSubject, category: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <select
              value={newSubject.level || 'beginner'}
              onChange={e => setNewSubject({ ...newSubject, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
              className="w-full p-2 border rounded-md"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={newSubject.location || ''}
              onChange={e => setNewSubject({ ...newSubject, location: e.target.value })}
              className="w-full p-2 border rounded-md"
            />

            {/* TODO: Add availability form fields for days/timeSlots */}

            <button
              type="submit"
              className="mt-4 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              {newSubject._id ? 'Update Subject' : 'Create Subject'}
            </button>
          </form>
        </div>
      )}

      {/* Subjects Table */}
      <table className="subject-table w-full bg-white rounded-lg shadow-md mt-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">#</th>
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
                <a onClick={() => handleEdit(subject)} title="Edit" className="cursor-pointer text-blue-500 hover:text-blue-700">👁️</a>
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

const StatBox: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="flex-1 min-w-[150px] p-6 rounded-xl text-center bg-sky-100 shadow-md">
    <h4 className="text-sm text-gray-600">{title}</h4>
    <p className="text-xl font-bold text-blue-800 mt-2">{value}</p>
  </div>
);

export default SubjectManager;
