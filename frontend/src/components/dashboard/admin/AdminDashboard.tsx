import React, { useEffect, useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import AdminSidebar from './tab/AdminSidebar';
import axios from 'axios';

interface User {
  name: string;
  email: string;
}

interface Profile {
  _id: string;
  user: User;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<{
    pendingProfiles: Profile[];
    approvedCount: number;
    rejectedCount: number;
    pendingCount: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/vidyaru-dashboard`, {
          withCredentials: true, // Important if you rely on cookies
        });
        setDashboardData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="p-8">Loading dashboard...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!dashboardData) return <p className="p-8">No dashboard data available.</p>;

  const pendingProfiles = dashboardData.pendingProfiles || [];

  return (
    <DashboardLayout Sidebar={AdminSidebar}>
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">📊 Admin Dashboard</h1>
      <p className="mb-8 text-gray-600">
        Welcome to the admin dashboard. Here is a summary of all user profile statuses.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-yellow-800">Pending Profiles</p>
          <p className="text-4xl font-bold text-yellow-700 mt-1">{dashboardData.pendingCount || 0}</p>
        </div>
        <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-green-800">Approved Profiles</p>
          <p className="text-4xl font-bold text-green-700 mt-1">{dashboardData.approvedCount || 0}</p>
        </div>
        <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-red-800">Rejected Profiles</p>
          <p className="text-4xl font-bold text-red-700 mt-1">{dashboardData.rejectedCount || 0}</p>
        </div>
      </div>

      {/* Pending Profiles List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex justify-between items-center">
          Recent Pending Profiles ({pendingProfiles.length})
          <a
            href="/admin/vidyaru-dashboard/pending-profiles"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All &rarr;
          </a>
        </h2>

        <ul className="divide-y divide-gray-100">
          {pendingProfiles.slice(0, 5).map(profile => (
            <li key={profile._id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{profile.user.name}</p>
                <p className="text-sm text-gray-500">{profile.user.email}</p>
              </div>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                Under Review
              </span>
            </li>
          ))}
          {pendingProfiles.length === 0 && (
            <li className="py-3 text-center text-gray-500 italic">No profiles currently pending review.</li>
          )}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
