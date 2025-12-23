
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './components/home/Home'
import AdminDashboard from './components/dashboard/admin/AdminDashboard'
import TeacherDashboard from './components/dashboard/teacher/TeacherDashboard'
import SubjectDetails from './components/home/Pages/SubjectDetails'
import ResourceCategoryPage from './components/home/Pages/ResourceCategoryPage'




function App() {
 

  return (
    <Routes>
      <Route path="*" element={<Home/>}/>
     <Route path="/admin/vidyaru-dashboard" element={<AdminDashboard />} />
     <Route path='/dashboard/:userId/*' element={<TeacherDashboard/>}/>
     <Route path="/subject/:id" element={<SubjectDetails />} />
     <Route path='/libraries/:category' element={<ResourceCategoryPage/>}/>
    </Routes>
  )
}

export default App
