
import BasicFAQ from "@/components/Landing/faq";
import Explain from "@/components/Landing/majorcomponent";

import Example from "@/components/Landing/navbar";
import { PreHeading } from "@/components/Landing/preHeading";
import StackedCardTestimonials from "@/components/Landing/testimonials";
import { DrawCircleText } from "@/components/Landing/vision";
import { Video } from "@/components/Landing/video";
import Footer from "@/components/Landing/footer";
import BenefitsSection from "@/components/Landing/benefits";
import { StickyCards } from "@/components/Landing/newAbout";



export function LandingPage() {
    return (
        <>

    <Example />
   <section id="intro" className="scroll-smooth">
   <PreHeading />
   </section>
   
   <DrawCircleText/> 
   {/* <Explain/> */}
   <section id="why" className="scroll-smooth">
   <StickyCards/>
   </section>
   
   <BenefitsSection/>
    <Video />

    <section id="testimonials" className="scroll-smooth">
    <StackedCardTestimonials/>
    </section>
   
   <BasicFAQ/>
   <Footer/>
  
    </>


    );
  }