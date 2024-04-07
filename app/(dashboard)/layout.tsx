import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full relative'>
      {/* Sidebar for desktop */}
      <div className='hidden h-full md:flex mg:flex-col md:fixed md:inset-y-0 z-[1] bg-slate-800 md:w-[15%]'>
        <div className='h-full w-full'>
          <Sidebar />
        </div>
      </div>
      <main className='md:pl-[15%]'>
        {/* Mobile nav bar */}
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
