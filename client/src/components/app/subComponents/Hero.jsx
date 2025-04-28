import { useNavigate } from "react-router-dom";
import { HeroIllustration } from "../../../assets/utilities";
import { staggerFadeIn } from "../../../assets/gsap";

const Hero = () => {
  const navigate = useNavigate();
  staggerFadeIn(".hero");
  return (
    <div className='flex flex-col lg:flex-row items-center justify-between px-6 py-10 lg:px-20 min-h-[90dvh] gap-4'>
      {/* Text Section */}
      <div className='lg:max-w-xl hero'>
        <h1 className='text-4xl font-bold mb-4'>Smart Solutions for Trading and Investing</h1>
        <p className='text-lg text-gray-600 mb-6'>
          With effortless trading and investing, we’ve enabled 1.3 million+ customers to reach their
          financial goals.
        </p>

        <div className='flex flex-row justify-start gap-2 w-full'>
          <button
            className='accent-btn !px-6 !py-3 transition'
            onClick={() => navigate("/auth/login")}>
            Sign in
          </button>
          <button
            className='primary-btn !px-6 !py-3 transition'
            onClick={() => navigate("/auth/register")}>
            Create free account
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className='w-full lg:max-w-2xl hero'>
        <img
          src={HeroIllustration}
          alt='Illustration'
          className='w-full h-auto rounded-lg shadow-lg'
        />
      </div>
    </div>
  );
};

export default Hero;
