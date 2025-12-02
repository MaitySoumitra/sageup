import React, { useEffect, useState } from 'react';
import Sidebar from './tab/Sidebar';
import TutorProfile from './tab/TutorProfile';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';

const TeacherDashboard: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>({ name: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/profiles/me`,  {
            withCredentials: true // ✅ send cookies along with request
          });
        setProfile(res.data.profile);
        setUser(res.data.profile?.user || { name: 'Teacher' });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex">
      <Sidebar currentPath={location.pathname} userId={userId!} profileStatus={profile?.status} />

      <main className="flex-1 p-8">
        {profile?.status !== 'approved' ? (
          <TutorProfile user={user} profile={profile} />
        ) : (
          <p>✅ Your profile is approved! You can now access other tabs.</p>
          // Here you can render other components like SubjectManager, LibraryManager, etc.
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
