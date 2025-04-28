import React from "react";
import { Navbar, Collapse, Typography, IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
function NavList() {
  return (
    <ul className='my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6'>
      <Typography as='li' variant='small' className='p-1 font-medium'>
        <a href='/about' className='flex items-center hover:text-accent transition-colors'>
          About
        </a>
      </Typography>
      <Typography as='li' variant='small' className='p-1 font-medium'>
        <a href='#Plans' className='flex items-center hover:text-accent transition-colors'>
          Plans
        </a>
      </Typography>
      <Typography as='li' variant='small' className='p-1 font-medium'>
        <a href='#FAQs' className='flex items-center hover:text-accent transition-colors'>
          FAQs
        </a>
      </Typography>
      <Typography as='li' variant='small' className='p-1 font-medium'>
        <a href='/contact' className='flex items-center hover:text-accent transition-colors'>
          Contact
        </a>
      </Typography>
    </ul>
  );
}

export default function NavbarLanding() {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();

  const handleWindowResize = () => window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar className='mx-auto w-[100dvw] max-w-screen-2xl px-6 py-3 bg-primary-dark border-0 shadow-accent rounded-md'>
      <div className='flex items-center justify-between text-text-light'>
        <Typography variant='h6' className='mr-4 cursor-pointer py-1.5 flex items-center'>
          <Link to='/'>
            <img src='/logo.png' alt='Genesisio_logo' className='w-8 h-8 object-cover' />
          </Link>
          <Link to='/' className='hidden lg:flex ml-2'>
            <p>Genesisio</p>
          </Link>
        </Typography>
        <div className='hidden lg:block text-text-light'>
          <NavList />
        </div>
        <div className='flex flex-row'>
          {/* <Link to='./auth/login'> */}
          <button
            className='accent-btn !px-6 !py-3 transition hidden lg:flex'
            onClick={() => navigate("/auth/login")}>
            Sign in
          </button>
          {/* </Link> */}
          <IconButton
            variant='text'
            className='ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden hover:text-accent'
            ripple={false}
            onClick={() => setOpenNav(!openNav)}>
            {openNav ? (
              <XMarkIcon className='h-6 w-6' strokeWidth={2} />
            ) : (
              <Bars3Icon className='h-6 w-6' strokeWidth={2} />
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}
