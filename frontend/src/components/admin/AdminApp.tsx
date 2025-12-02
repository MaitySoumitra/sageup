import DashboardLayout from './layouts/DashboardLayout';
import Sidebar from './tab/Sidebar';
import TutorProfile from './tab/TutorProfile';
import SubjectManager from './tab/SubjectManager';
import LibraryManager from './tab/LibraryManager';
import AdminDashboard from './tab/AdminDashboard';
import useSampleData from './hooks/useSampleData';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Auth from '../features/User/Auth';

// Helper component to house the Dashboard structure (Layout + Sidebar + Content)
const Dashboard = () => {
    // Use useLocation to get the current route for highlighting the active link in the Sidebar
    const location = useLocation();
   
   
    // Mock logged-in user and dynamic data
    const { user, profile, subjects, libraries, pendingProfiles } = useSampleData();
 
    // The Sidebar now uses the URL path for navigation and active state
    // and is rendered inside the main dashboard layout.

    // In a real application, you would check the user's role to conditionally render
    // the AdminDashboard route. We'll use a mock condition here.
    const isAdmin = user.name === 'Admin User'; // Replace with real auth check

    const Placeholder = ({ page }: { page: string }) => (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-700">Page: {page.charAt(0).toUpperCase() + page.slice(1)}</h2>
            <p className="mt-4 text-gray-500">Content for this section is not yet implemented.</p>
        </div>
    );

    return (
        <DashboardLayout>
            {/* Sidebar gets the user ID and current location */}
            <Sidebar userId={user._id} currentPath={location.pathname} />

            {/* The main content area where routes are rendered */}
            <div className="main-content flex-1 p-10">
                <Routes>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<TutorProfile user={user} profile={profile} />} />
                    <Route path="course" element={<SubjectManager user={user} subjects={subjects} />} />
                    <Route path="libraries" element={<LibraryManager user={user} libraries={libraries} />} />
                    <Route path="review" element={<Placeholder page="Review" />} />
                    <Route path="application" element={<Placeholder page="Application" />} />
                    {isAdmin && <Route path="admin" element={<AdminDashboard pendingProfiles={pendingProfiles} />} />}
                    <Route path="*" element={<Placeholder page="Not Found (404)" />} />

                </Routes>
            </div>
        </DashboardLayout>
    );
};

// Main App component that defines the overall routing structure
function AdminApp() {
    const { user } = useSampleData();
    const isAuthenticated = !!user;
    const userId = user?._id;

    return (
        <Routes>
            {/* Login page */}
            <Route path="/auth" element={<Auth onClose={() => { }} />} />

            {/* Dashboard routes (only visible when logged in) */}
            {isAuthenticated && (
                <Route path="/dashboard/:userId/*" element={<Dashboard />} />
            )}

            {/* Redirect /admin root to dashboard if logged in */}
            {isAuthenticated && userId && (
                <Route
                    path="/"
                    element={<Navigate to={`/admin/dashboard/${userId}/home`} replace />}
                />
            )}

            {/* Redirect /admin root or any invalid admin routes to /auth if not logged in */}
            {!isAuthenticated && (
                <Route path="/*" element={<Navigate to="/admin/auth" replace />} />
            )}
        </Routes>
    );
}





export default AdminApp;