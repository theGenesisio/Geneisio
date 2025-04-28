import { Typography } from "@material-tailwind/react";

const SITEMAP = [
  {
    title: "Company",
    links: ["About Us"],
    href: "./about",
  },
  {
    title: "Help Center",
    links: ["Contact Us"],
    href: "./contact",
  },
  {
    title: "Reads",
    links: ["Terms and conditions"],
    href: "./terms",
  },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className='relative w-full bg-primary-dark'>
      <div className='mx-auto w-full max-w-7xl px-8'>
        <div className='mx-auto grid w-full grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3'>
          {SITEMAP.map(({ title, links, href }, key) => (
            <div key={key} className='w-full'>
              <Typography
                variant='small'
                className='mb-4 font-bold uppercase opacity-50 text-white'>
                {title}
              </Typography>
              <ul className='space-y-1'>
                {links.map((link, key) => (
                  <Typography key={key} as='li' className='font-normal text-text-light'>
                    <a
                      href={href}
                      className='inline-block py-1 pr-2 transition-transform hover:scale-105'>
                      {link}
                    </a>
                  </Typography>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className='flex w-full items-center justify-center border-t border-accent py-4'>
          <Typography variant='small' className='mb-4 text-center font-normal text-white md:mb-0'>
            &copy; {currentYear} Genesisio. All Rights Reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}
