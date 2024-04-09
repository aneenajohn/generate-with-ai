'use client';

import React, { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import NoData from '@/components/no_data';
import Loader from '@/components/loader';

import { formSchema } from './constants';
import { errorLogger } from '@/lib/custom_utils';
import { cn } from '@/lib/utils';

const ChatPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  const [apiError, setApiError] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = form;

  const id = useId();

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
      setApiError(null);
      form.reset();
    } catch (error: any) {
      errorLogger(String(error));
      setApiError(String(error));
      setMessages([]);
    } finally {
      router.refresh();
    }
  };

  const handleGenerateClick = async () => {
    setApiError(null);
    await trigger(); // Trigger validation
    if (Object.keys(errors).length === 0) {
      handleSubmit(onSubmit)();
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
              // onSubmit={handleSubmit(onSubmit)}
              className='w-full grid grid-cols-12 gap-2 focus-within:shadow-sm border rounded-lg py-4 px-3 md:px-6 cursor-pointer'
            >
              <FormField
                name='prompt'
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-10'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        // className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        className={`border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent pl-2 ${
                          errors.prompt ? 'border-red-500 border' : ''
                        }`}
                        disabled={isSubmitting}
                        placeholder='Ask me anything like Which came first - The chicken or the egg?'
                        {...field}
                      />
                    </FormControl>
                    {errors.prompt && (
                      <span className='text-red-500 text-sm'>
                        {errors.prompt.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />
              <Button
                className='col-span-12 lg:col-span-2 w-full'
                // disabled={isLoading}
                disabled={isSubmitting}
                type='button'
                onClick={handleGenerateClick}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className='space-y-4 my-4'>
          {/* Empty comp */}
          {messages.length === 0 && !isSubmitting && (
            <NoData label='Ask, and you shall receive! Type in your query and hit Generate' />
          )}
          {isSubmitting && (
            <div className='w-full flex place-items-center'>
              <Loader />
            </div>
          )}
          {/* Response from gpt */}
          <div className='flex flex-col-reverse gap-y-4'>
            {messages.length > 0 &&
              messages.map((msg) => (
                <div
                  key={id}
                  className={cn(
                    'w-full flex items-start gap-x-8 rounded-lg p-8',
                    msg.role === 'user'
                      ? 'bg-white border border-black/10'
                      : 'bg-muted'
                  )}
                >
                  {msg.content}
                </div>
              ))}
            {apiError && <div className='text-red-500'>{apiError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
