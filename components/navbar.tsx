import React from 'react';
import { UserButton } from '@clerk/nextjs';

import SidebarMobile from '@/components/sidebar_mobile';

const Navbar = () => {
  return (
    <div className='flex items-center p-4'>
      <SidebarMobile />
      <div className='w-full flex justify-end pr-2'>
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  );
};

export default Navbar;
