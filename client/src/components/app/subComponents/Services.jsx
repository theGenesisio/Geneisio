import { Card, CardBody, Typography } from "@material-tailwind/react";
import { PhoneIllustration } from "../../../assets/utilities";
import {
  ArrowTrendingUpIcon,
  BoltIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { supportIcon } from "../../../assets/icons";
import { fadeIn, staggerFadeIn2 } from "../../../assets/gsap";

const features = [
  {
    icon: <ArrowTrendingUpIcon className='w-5 h-5' />,
    title: "Robust Trading Platforms",
    description:
      "Access a range of platforms tailored to fit every trader’s unique style and goals.",
  },
  {
    icon: <CreditCardIcon className='w-5 h-5' />,
    title: "High Leverage",
    description: "Amplify your potential gains with competitive leverage and tight spreads.",
  },
  {
    icon: <BoltIcon className='w-5 h-5' />,
    title: "Rapid Execution",
    description: "Trade seamlessly with lightning-fast software designed to reduce slippage.",
  },
  {
    icon: <ShieldCheckIcon className='w-5 h-5' />,
    title: "Top-notch Security",
    description:
      "Stay protected with cutting-edge security systems that safeguard your account 24/7.",
  },
  {
    icon: <span className='w-5 h-5 scale-125'>{supportIcon}</span>,
    title: "24/7 Live Chat Support",
    description: "Get immediate assistance anytime from our expert team and market analysts.",
  },
];

const ServicesSection = () => {
  staggerFadeIn2(".gsapServices");
  fadeIn(".gsapService");
  return (
    <section className='overflow-hidden bg-primary-default min-h-screen'>
      <div className='container mx-auto px-4 py-20'>
        <div className='text-center mb-8 gsapService'>
          <Typography variant='h4' className='mb-4 text-text-light'>
            Explore Our Services
          </Typography>
          <Typography variant='paragraph' className='text-gray-600 max-w-xl mx-auto'>
            Our mission is to ensure you have a seamless and rewarding trading experience!
          </Typography>
        </div>

        <div className='flex flex-wrap justify-center items-center'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='p-4 shadow-md gsapServices'
                variant='gradient'
                color='gray'>
                <CardBody className='flex items-start'>
                  <div className='flex-shrink-0 mr-4'>
                    <div className='w-12 h-12 flex items-center justify-center bg-accent rounded-full text-text-light'>
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <Typography variant='h6' className='mb-2 text-text-light'>
                      {feature.title}
                    </Typography>
                    <Typography variant='paragraph' className='text-gray-600'>
                      {feature.description}
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          <div className='mt-8 lg:mt-0 lg:ml-8 gsapServices'>
            <img src={PhoneIllustration} alt='Phone App' className='max-w-xs lg:max-w-md mx-auto' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
