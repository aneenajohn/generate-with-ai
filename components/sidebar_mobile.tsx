'use client';
import React from 'react';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import Sidebar from '@/components/sidebar';

const SidebarMobile = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <div className='w-8 h-8 hover:bg-slate-400/20 hover:transition rounded-lg flex place-items-center p-2'>
          <Menu />
        </div>

        {/* </Button> */}
      </SheetTrigger>
      <SheetContent side='left' className='p-0'>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default SidebarMobile;
