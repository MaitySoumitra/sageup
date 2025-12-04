import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from './tab/Sidebar';
import TutorProfile from './tab/TutorProfile';
import SubjectManager from './tab/SubjectManager';
import LibraryManager from './tab/LibraryManager';
import IndexManager from './tab/IndexManager'
import axiosClient from '../../api/axiosClient';
import type { Subject, LibraryItem, User } from './profile';

const TeacherDashboard: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<User>({ name: '' });
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [libraries, setLibraries] = useState<LibraryItem[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get('/api/profiles/me', { withCredentials: true });
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
      <Sidebar currentPath={window.location.pathname} userId={userId!} profileStatus={profile?.status} />

      <main className="flex-1">
        {profile?.status !== 'approved' ? (
          <TutorProfile user={user} profile={profile} />
        ) : (
          <Routes>
            <Route path='' element={<IndexManager/>} />
           <Route path="course" element={<SubjectManager user={user} subjects={subjects} />} />
            <Route path="libraries" element={<LibraryManager user={user} libraries={libraries} />} />
            <Route path="review" element={<p>Review tab content</p>} />
            <Route path="application" element={<p>Application tab content</p>} />
            <Route path="*" element={<p>Page not found</p>} />
          </Routes>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
