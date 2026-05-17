import React from 'react'
import Hero from '../Components/Home/Hero.jsx'
import ServicesCard from '../Components/ServicesCard.jsx'
import Works from '../Components/Home/Works.jsx'
import Rate from '../Components/Home/Rate.jsx'
import Faq from '../Components/General/Faq.jsx'
import About from '../Components/Home/About.jsx'
import Contact from '../Components/General/Contact.jsx'
import TrustSection from '../Components/Home/TrustSection.jsx'
import FeaturesSection from '../Components/Features/FeaturesSection'
import SecuritySection from '../Components/DSHCOM/SecuritySection.jsx'


function Home() {
  return (
     <>
        <Hero/>
        <Rate/>
        <FeaturesSection/> 
        <About/> 
        <Works/>
        <TrustSection/> 
        <Faq/>
        <Contact/>
        <ServicesCard/>
      {/*<SecuritySection/>*/}
    </>
  )
}

export default Home