'use client';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/card';
import {
  ArrowRight,
  MessageCircle,
  CodeIcon,
  ImageIcon,
  Music2Icon,
  VideoIcon,
  BoltIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const tools = [
    {
      label: 'Chat with AI',
      href: '/chat',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      icon: MessageCircle,
    },
    {
      label: 'Animate Images',
      href: '/animate',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      icon: BoltIcon,
    },
    {
      label: 'Music Generation',
      icon: Music2Icon,
      href: '/music',
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      label: 'Image Generation',
      icon: ImageIcon,
      color: 'text-pink-700',
      bgColor: 'bg-pink-700/10',
      href: '/image',
    },
    {
      label: 'Video Generation',
      icon: VideoIcon,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-700/10',
      href: '/video',
    },
    {
      label: 'Code Generation',
      icon: CodeIcon,
      color: 'text-orange-700',
      bgColor: 'bg-orange-700/10',
      href: '/code',
    },
  ];

  const router = useRouter();

  return (
    <div>
      <div className='mb-8 space-y-4'>
        <h2 className='text-2xl md:text-4xl font-bold text-center text-primary'>
          Ready to create with AI?
        </h2>
        <p className='text-muted-foreground font-light text-sm md:text-lg text-center'>
          Your AI-powered creativity assistant
        </p>
      </div>
      <div className='px-4 md:px-20 lg:px-32 space-y-4'>
        {tools.map((tool) => (
          <Card
            key={tool.href}
            className='p-4 border-black/5 flex justify-between items-center hover:shadow-md transition cursor-pointer'
            onClick={() => router.push(tool.href)}
          >
            <div className='flex items-center gap-4'>
              <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                <tool.icon className={cn('w-8 h-8', tool.color)} />
              </div>
              <div className='font-semibold'>{tool.label}</div>
            </div>
            <ArrowRight className='w-5 h-5' />
          </Card>
        ))}
      </div>
    </div>
  );
}
