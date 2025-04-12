
import BasicFAQ from "@/components/Landing/faq";
import Explain from "@/components/Landing/majorcomponent";

import Example from "@/components/Landing/navbar";
import { PreHeading } from "@/components/Landing/preHeading";
import StackedCardTestimonials from "@/components/Landing/testimonials";
import { DrawCircleText } from "@/components/Landing/vision";

import { Video } from "@/components/Landing/video";
import CollapseCardFeatures from "@/components/Landing/collapseCard";
import Footer, { WaterFooter } from "@/components/Landing/footer";
import { BusRevealText } from "@/components/Landing/reveal";
import BenefitsSection from "@/components/Landing/benefits";



export function LandingPage() {
    return (
        <>

    <Example />
   
   <PreHeading />
   <DrawCircleText/>
   
   <Explain/>
  
   
  
        

   
   <BenefitsSection/>
    {/* <FallingText
        text={`React Bits is a library of animated and interactive React components designed to streamline UI development and simplify your workflow.`}
        highlightWords={["React", "Bits", "animated", "components", "simplify"]}
        highlightClass="highlighted"
        trigger="hover"
        backgroundColor="transparent"
        wireframes={false}
        gravity={0.56}
        fontSize="2rem"
        mouseConstraintStiffness={0.9}
        />  */}
        <Video />
        {/* <CollapseCardFeatures/> */}


   <StackedCardTestimonials/>
   <BasicFAQ/>
   {/* <BusRevealText/> */}
   {/* <WaterFooter/> */}
   <Footer/>
  
    </>


    );
  }