import { Button } from '@/components/ui/button';
import DashboardPage from '@/app/(dashboard)/dashboard/page';

export default function Home() {
  return (
    <>
      <p className='text-pretty font-bold'>Hellooo</p>
      <Button>Click me!</Button>

      <hr />
      <DashboardPage />
    </>
  );
}
