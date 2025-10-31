import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { themeContext } from 'contexts/ThemeContext';

export default function Footer({ className }: { className?: string }) {
  const CurrentYear = new Date().getFullYear();
  const { isDarkMode } = useContext(themeContext);
  return (
    <div className={`${className ? className : ''} footer md:p-6 sm:p-3 py-3 mt-auto`}>
      <div className="container-fluid flex items-center justify-between gap-15 md:flex-row flex-col md:text-[16px]/[24px] text-[14px]/[20px]">
        <p className="text-font-color-100 text-center">
          © {CurrentYear}{' '}
          <Link href="/" className="text-primary">
            InBuildify
          </Link>
          , All Rights Reserved.
        </p>
        <Link href="/">
          <Image
            src={isDarkMode ? '/company-dark.png' : '/company-light.png'}
            alt="logo"
            width={100}
            height={100}
          />
        </Link>
        <ul className="flex items-center gap-x-20 gap-y-5 flex-wrap justify-center">
          <li>
            <Link href="#" className="text-font-color-100 transition-all hover:text-blue">
              Portfolio
            </Link>
          </li>
          <li>
            <Link href="#" className="text-font-color-100 transition-all hover:text-blue">
              Licenses
            </Link>
          </li>
          <li>
            <Link href="#" className="text-font-color-100 transition-all hover:text-blue">
              Support
            </Link>
          </li>
          {/* <li>
            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
              FAQs
            </Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
}
