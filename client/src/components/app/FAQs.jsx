import { DocumentIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Accordion, AccordionBody, AccordionHeader, Card } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supportIcon } from "../../assets/icons";
import { staggerFadeIn2 } from "../../assets/gsap";
const FAQs = () => {
  staggerFadeIn2(".gsapFAQs");
  const [open, setOpen] = useState(null);

  const handleOpen = (index) => {
    setOpen(open === index ? null : index);
  };
  const faqs = [
    {
      question: "Is there a startup bonus available?",
      answer: "Yes! You’ll receive a $5 startup bonus immediately after registration.",
    },
    {
      question: "Can I upgrade my plan after selecting a lower one?",
      answer: "Absolutely. You can upgrade your plan once each 24-hour trading cycle is completed.",
    },
    {
      question: "Do I earn rewards for referrals?",
      answer:
        "Yes. You'll receive a $5 bonus for every person who registers and funds their account through your referral link.",
    },
    {
      question: "Is it possible to withdraw my deposit?",
      answer:
        "Yes, your deposit becomes available for withdrawal once the trading cycle concludes.",
    },
    {
      question: "What are the deposit limits?",
      answer: "The minimum deposit is $50, and the maximum deposit per plan is capped at $1,000.",
    },
    {
      question: "How is my money protected and profits guaranteed?",
      answer:
        "Our advanced trading algorithm securely manages your deposit, ensuring a guaranteed ROI at the close of each trading window.",
    },
    {
      question: "When and how can I withdraw my earnings?",
      answer:
        "Earnings can be withdrawn once your profit or ROI matures, according to the schedule in your selected payment package.",
    },
  ];

  const features = [
    {
      icon: <QuestionMarkCircleIcon className='w-7 h-7' />,
      title: "FAQs",
      description: "Find quick answers and key insights about how our platform works.",
    },
    {
      icon: <DocumentIcon className='w-7 h-7' />,
      title: "Guides",
      description:
        "Follow our step-by-step guides to easily navigate and get the most out of your experience.",
    },
    {
      icon: <span className='w-7 h-7'>{supportIcon}</span>,
      title: "Support Request",
      description: "Need help? Reach out to our 24/7 support team ready to assist you at any time.",
    },
  ];

  return (
    <section className='py-16 bg-primary-default' id='FAQs'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center mb-12 gsapFAQs'>
          <h4 className='text-2xl font-semibold mb-4'>Get the Support You Deserve!</h4>
          <p className='text-text-light max-w-2xl mx-auto'>
            Our friendly customer service team is always ready and available to assist you whenever
            you need it.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <Card
              key={index}
              variant='gradient'
              color='gray'
              className='p-6 text-center shadow-md gsapFAQs'>
              <div className='flex flex-row justify-center gap-4'>
                <div className='text-text-light mb-4 text-4xl'>{feature.icon}</div>
                <h5 className='text-lg font-medium text-text-light'>{feature.title}</h5>
              </div>
              <p className='text-text-light mt-3'>{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className='container mx-auto px-4 mt-16 gsapFAQs'>
        <div className='text-center mb-12'>
          <h4 className='text-2xl font-semibold mb-4'>Frequently Asked Questions</h4>
          <p className='text-text-light max-w-2xl mx-auto'>
            Please review the information below to ensure a thorough understanding.
          </p>
        </div>

        {/* Accordion */}
        <div className='w-full'>
          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <Accordion key={index} open={open === index} className='border-0 rounded-lg gsapFAQs'>
                <AccordionHeader onClick={() => handleOpen(index)} className='p-4 bg-accent'>
                  <h6 className='text-lg font-medium text-white'>{faq.question}</h6>
                </AccordionHeader>
                <AccordionBody className='p-4 text-text-light'>{faq.answer}</AccordionBody>
              </Accordion>
            ))}
          </div>
        </div>
      </div>

      {/* Sign-Up Section */}
      <section className='py-12 bg-primary-default gsapFAQs'>
        <div className='container mx-auto px-4'>
          <div className='p-8 bg-accent text-white rounded-lg'>
            <div className='flex flex-wrap items-center'>
              <div className='w-full md:w-8/12 mb-8 md:mb-0'>
                <h4 className='text-2xl font-bold mb-4'>The Better Way to Trade & Invest</h4>
                <p>
                  Join over 1.3 million customers who have achieved their financial goals by trading
                  and investing with ease.
                </p>
              </div>
              <div className='w-full md:w-4/12 text-center md:text-right'>
                <Link
                  to='./auth/register'
                  className='bg-white text-accent font-medium px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition'>
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default FAQs;
