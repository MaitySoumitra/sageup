import { Body } from "../Layouts/Body/Body"
import Footer from "../Layouts/Footer/Footer"
import Header from "../Layouts/Header/Header"
import { useCurrentUser } from "../../api/useCurrentUser"


export const IndexPage = () => {
  const {isLoading}=useCurrentUser()
  if(isLoading){
    return <div>Loading...</div>
  }
  return (
    <>
    <Header/>
    <Body/>
    <Footer/>
    </>
  )
}
