'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Montserrat } from 'next/font/google';

import { cn } from '@/lib/utils';
import {
  CodeIcon,
  ImageIcon,
  LayoutDashboard,
  MessageCircle,
  Music2Icon,
  SettingsIcon,
  VideoIcon,
} from 'lucide-react';

const montserrat = Montserrat({
  weight: '600',
  subsets: ['cyrillic', 'latin', 'vietnamese'],
});

const sidebar = () => {
  const routes = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      color: 'text-secondary',
      icon: LayoutDashboard,
    },
    {
      label: 'Chat',
      href: '/chat',
      color: 'text-purple-400',
      icon: MessageCircle,
    },
    {
      label: 'Generate Images',
      href: '/image',
      color: 'text-pink-400',
      icon: ImageIcon,
    },
    {
      label: 'Generate Videos',
      href: '/video',
      color: 'text-emerald-400',
      icon: VideoIcon,
    },
    {
      label: 'Generate Code',
      href: '/code',
      color: 'text-orange-400',
      icon: CodeIcon,
    },
    {
      label: 'Generate Music',
      href: '/music',
      color: 'text-primary',
      icon: Music2Icon,
    },
    {
      label: 'Settings',
      href: '/settings',
      color: 'text-gray-400',
      icon: SettingsIcon,
    },
  ];
  return (
    <div className='text-secondary bg-slate-800 space-y-4 py-4 flex flex-col h-full'>
      <Link href='/dashboard' className='flex items-center pl-3'>
        <div className='relative w-14 h-14 mr-4 flex items-center'>
          <Image alt='logo' src='/pippin-2.png' fill />
          <h1
            className={cn(
              'font-bold text-2xl pl-14 ml-2 align-middle text-primary',
              montserrat.className
            )}
          >
            Dodo
          </h1>
        </div>
      </Link>
      <div className='space-y-1 px-4 py-4 h-full flex flex-col'>
        {routes.map((route, index) => (
          <Link
            href={route.href}
            key={route.href}
            className={`w-full flex justify-start group text-sm font-medium hover:text-white hover:bg-white/10 rounded-md transition p-4 ${
              index === routes.length - 1 ? 'flex-grow' : ''
            }`}
          >
            <div className={`flex flex-1 items-center h-full`}>
              <route.icon
                className={cn('h-5 w-5 mr-2', route.color)}
              ></route.icon>
              {route.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default sidebar;
