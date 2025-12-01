import { Routes, Route } from "react-router-dom"
import { IndexPage } from "./Pages/IndexPage"
import { ServicesSection } from "./Pages/ServicePage"

export const Home=()=>{
    return(
        <>
        <Routes>
            <Route path="/" element={<IndexPage/>} />
            <Route path="/services" element={<ServicesSection/>}/>
        </Routes>
        </>
    )
}