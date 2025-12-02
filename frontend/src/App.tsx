
import { Routes, Route } from 'react-router-dom'
import './App.css'
import AdminApp from './components/admin/AdminApp'
import { Home } from './components/home/Home'



function App() {
 

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/admin/*" element={<AdminApp/>}/>
    </Routes>
  )
}

export default App
