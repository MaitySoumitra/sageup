import React from 'react';

// Interfaces imported from useSampleData.ts (simplified here)
interface Profile {
  _id: string;
  user: { name: string; email: string };
  type: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
}

interface AdminDashboardProps {
  pendingProfiles: Profile[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ pendingProfiles }) => {
  // Mock counts - in a real app, these would come from an API endpoint
  const pendingCount = pendingProfiles.length;
  const approvedCount = 15;
  const rejectedCount = 3;

  const handleStatusUpdate = (e: React.FormEvent<HTMLFormElement>, profileId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStatus = formData.get('status');
    // Simulate API call to update status
    console.log(`Updating profile ${profileId} to status: ${newStatus}`);
    alert(`Status for ${profileId} updated to ${newStatus}. (Simulated)`);
  };

  return (
    <div className="dashboard-container bg-white p-8 rounded-xl shadow-lg max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">👑 Admin Dashboard</h1>

      {/* Profile Status Stats */}
      <div className="stats flex gap-6 mt-4">
        <StatCard title="Pending Profiles" count={pendingCount} color="text-yellow-600" />
        <StatCard title="Approved Profiles" count={approvedCount} color="text-green-600" />
        <StatCard title="Rejected Profiles" count={rejectedCount} color="text-red-600" />
      </div>

      {/* Pending Profile List */}
      <div className="profile-list mt-10">
        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Pending Profile Approvals ({pendingCount})</h2>
        
        {pendingProfiles.map(profile => (
          <div key={profile._id} className="profile-card bg-gray-50 p-5 rounded-lg mb-4 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800">
              {profile.user.name} (<span className="text-indigo-600">{profile.type.replace('_', ' ')}</span>)
            </h3>
            <p className="mt-1 text-sm text-gray-600"><strong>Email:</strong> {profile.user.email}</p>
            <p className="text-sm text-gray-600"><strong>Location:</strong> {profile.location}</p>
            <p className="mt-2 font-semibold"><strong>Status:</strong> <span className="text-yellow-700">{profile.status.toUpperCase()}</span></p>

            <form onSubmit={(e) => handleStatusUpdate(e, profile._id)} className="flex gap-3 mt-4">
              <select name="status" className="p-2 border rounded-md text-sm">
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
                <option value="under_review">Under Review</option>
              </select>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition text-sm">
                Update Status
              </button>
            </form>
          </div>
        ))}

        {pendingCount === 0 && (
            <p className="text-gray-500 italic p-4 border rounded-md">No pending profiles found.</p>
        )}
      </div>
    </div>
  );
};

// Helper component for stat cards
const StatCard: React.FC<{ title: string; count: number; color: string }> = ({ title, count, color }) => (
    <div className="stat flex-1 bg-gray-100 p-5 rounded-lg text-center shadow-inner">
      <h2 className={`text-4xl font-extrabold ${color}`}>{count}</h2>
      <p className="mt-1 text-gray-600">{title}</p>
    </div>
  );

export default AdminDashboard;