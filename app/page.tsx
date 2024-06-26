'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className='grid min-h-screen overflow-hidden items-stretch gap-0'>
        <header className='sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-filter backdrop-blur-sm/20 py-2 md:py-4 dark:bg-gray-950 dark:border-gray-950'>
          <div className='container flex items-center justify-between px-4 md:px-6'>
            {/* <Link className='flex items-center space-x-2 font-medium' href='#'>
              <span className='h-6 w-6 overflow-hidden rounded-lg'>
                <Image
                  alt='Logo'
                  className='rounded-lg object-contain'
                  height='24'
                  src='/placeholder.svg'
                  style={{
                    aspectRatio: '24/24',
                    objectFit: 'cover',
                  }}
                  width='24'
                />
              </span>
              <span className='sr-only'>Home</span>
            </Link>
            <nav className='hidden space-x-4 text-sm font-medium md:flex'>
              <Link
                className='inline-flex items-center h-10 px-1 border-b-2 border-transparent dark:text-gray-400'
                href='#'
              >
                Code
              </Link>
              <Link
                className='inline-flex items-center h-10 px-1 border-b-2 border-transparent dark:text-gray-400'
                href='#'
              >
                Images
              </Link>
              <Link
                className='inline-flex items-center h-10 px-1 border-b-2 border-transparent dark:text-gray-400'
                href='#'
              >
                Conversations
              </Link>
              <Link
                className='inline-flex items-center h-10 px-1 border-b-2 border-transparent dark:text-gray-400'
                href='#'
              >
                Videos
              </Link>
              <Link
                className='inline-flex items-center h-10 px-1 border-b-2 border-transparent dark:text-gray-400'
                href='#'
              >
                Music
              </Link>
            </nav> */}
            <div className='flex items-center space-x-4'>
              {/* dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-950 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300' */}
              <Link
                className='inline-flex h-10 items-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm space-x-2'
                href='/sign-in'
              >
                Sign in
              </Link>
              <Link
                className='inline-flex h-10 items-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50'
                href='/sign-up'
              >
                Sign up
              </Link>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
