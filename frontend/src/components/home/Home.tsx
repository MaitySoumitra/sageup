import { Routes, Route } from "react-router-dom"
import { IndexPage } from "./Pages/IndexPage"

import  {ProfileView}  from "./Pages/ProfilePage"

export const Home=()=>{
    return(
        <>
        <Routes>
            <Route path="/" element={<IndexPage/>} />
            <Route path="/profile/:profileId" element={<ProfileView />} />
        </Routes>
        </>
    )
}