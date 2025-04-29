import BasicFAQ from "@/components/Landing/faq";
import Example from "@/components/layout/navbar";
import { PreHeading } from "@/components/Landing/preHeading";
import StackedCardTestimonials from "@/components/Landing/testimonials";
import { DrawCircleText } from "@/components/Landing/vision";
import { Video } from "@/components/Landing/video";
import Footer from "@/components/Landing/footer";
// import BenefitsSection from "@/components/Landing/benefits";
import { StickyCards } from "@/components/Landing/newAbout";

export function LandingPage() {
  return (
    <div className="overflow-x-hidden w-full max-w-[100vw]">
      <Example />

      <section id="intro" className="scroll-smooth">
        <PreHeading />
      </section>

      <DrawCircleText />

      <section id="why" className="scroll-smooth">
        <StickyCards />
      </section>

      {/* <BenefitsSection /> */}
      <Video />

      <section id="testimonials" className="scroll-smooth">
        <StackedCardTestimonials />
      </section>

      <BasicFAQ />
      <Footer />
    </div>
  );
}
