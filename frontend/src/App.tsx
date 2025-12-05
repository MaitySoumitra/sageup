
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './components/home/Home'
import AdminDashboard from './components/dashboard/admin/AdminDashboard'
import TeacherDashboard from './components/dashboard/teacher/TeacherDashboard'




function App() {
 

  return (
    <Routes>
      <Route path="*" element={<Home/>}/>
      {/* <Route path="/admin/*" element={<AdminApp/>}/> */}
     <Route path="/admin/vidyaru-dashboard" element={<AdminDashboard />} />
     <Route path='/dashboard/:userId/*' element={<TeacherDashboard/>}/>
    </Routes>
  )
}

export default App
