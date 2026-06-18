import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Gallery from './Gallery';
import Pricing from './Pricing';
import Testimonials from './Testimonials';
import Footer from './Footer';

const LandingPage = ({ onOpenAuth }) => {
  return (
    <div className="w-full">
      <Hero onOpenAuth={onOpenAuth} />
      <Features />
      <HowItWorks />
      <Gallery />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;
