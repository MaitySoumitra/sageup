import React, { useEffect, useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import AdminSidebar from './tab/Sidebar';
import AdminProfile from './tab/AdminProfile';
import PendingProfiles from './tab/PendingProfiles';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/vidyaru-dashboard`, { withCredentials: true });
      setDashboardData(res.data);
    };
    fetchData();
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return <AdminProfile {...dashboardData} />;
      case "pending-profiles":
        return <PendingProfiles />;
      case "approved":
        return <div>Approved Profiles Coming Soon</div>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout Sidebar={AdminSidebar} activeTab={activeTab} setActiveTab={setActiveTab}>
      {dashboardData ? renderTab() : <p>Loading...</p>}
    </DashboardLayout>
  );
};

export default AdminDashboard;
