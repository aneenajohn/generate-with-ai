'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import Heading from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { formSchema } from './constants';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { errorLogger } from '@/lib/custom_utils';

const ChatPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt,
      };
      const newMessage = [...messages, userMessage];

      const response = await axios.post('/api/chat', {
        messages: newMessage,
      });

      setMessages((currentMsg) => [...currentMsg, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      errorLogger(String(error));
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title='Chat with AI'
        description='Simulate AI-powered conversations with customizable characters and dialogues.'
        icon={MessageCircle}
        iconColor='text-purple-400'
        bgColor='bg-purple-400/10'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full grid grid-cols-12 gap-2 focus-within:shadow-sm border rounded-lg py-4 px-3 md:px-6 cursor-pointer'
            >
              <FormField
                name='prompt'
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-10'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        disabled={isLoading}
                        placeholder='Ask me anything'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className='col-span-12 lg:col-span-2 w-full'
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className='space-y-4 my-4'>Result</div>
      </div>
    </div>
  );
};

export default ChatPage;
