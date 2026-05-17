import React from 'react'
import CoreValuesSection from '../Components/AboutUs/CoreValuesSection.jsx'
import MissionVision from '../Components/AboutUs/MissionVision.jsx'
import HealthJourney from '../Components/AboutUs/HealthJourney'
import OurFounding from '../Components/AboutUs/OurFounding'
import Team from '../Components/AboutUs/Team.jsx'
import Contact from '../Components/General/Contact.jsx'

function AboutUsPage() {
  return (
    <>
    <HealthJourney/>
    <MissionVision/>
    <CoreValuesSection/>
    <OurFounding/>
    <Team/>
    <Contact/>


    </>
  )
}

export default AboutUsPage