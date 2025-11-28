import { Routes, Route } from "react-router-dom"
import { Body } from "../Layouts/Body/Body"
import { ServicesSection } from "../Layouts/Pages/ServicePage"
export const HomePageRoute = () => {
  return (
    <Routes>
        <Route path="/" element={<Body/>} />
        <Route path="/service" element={<ServicesSection/>} />
    </Routes>
  )
}
