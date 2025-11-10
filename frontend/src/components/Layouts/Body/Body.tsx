import { Banner } from "../Body/Section/Banner";
import EducationalResources from "./Section/EducationaResources";
import { Features } from "./Section/Fetaures";
import { Profiles } from "./Section/Profile";
import RecommendedSubjects from "./Section/RecommendedSubjects";
import { ServicesSection } from "./Section/Services";

export const Body = () => {
  return (
    <div>
      <Banner />
      <Features/>
      <Profiles/>
      <ServicesSection/>
      <RecommendedSubjects/>
      <EducationalResources/>
      
    </div>
  )
}
