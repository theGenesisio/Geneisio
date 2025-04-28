import Features from "./subComponents/Features";
import Hero from "./subComponents/Hero";
import Services from "./subComponents/Services";
import Testimonial from "./subComponents/Testimonial";
import FAQs from "./FAQs";
import Always from "./Always";
import MarketData from "./subComponents/Tradeview/MarketData";

const Home = () => {
  return (
    <section className='overflow-x-hidden'>
      <Hero />
      <Features />
      <Services />
      <Always />
      <Testimonial />
      <MarketData />
      <FAQs />
    </section>
  );
};

export default Home;
