'use client';

import React, { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { any, z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Download, ImageIcon } from 'lucide-react';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';

import NoData from '@/components/no_data';
import Loader from '@/components/loader';

import { countOptions, formSchema, resolutionOptions } from './constants';
import { errorLogger } from '@/lib/custom_utils';
import { cn } from '@/lib/utils';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

const ImagePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      count: '1',
      resolution: '1024x1024',
    },
  });

  const [images, setImages] = useState<string[]>([]);

  const [apiError, setApiError] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = form;

  const id = useId();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);
      const response = await axios.post('/api/image ', values);
      const urls = response.data.map((image: { url: string }) => image.url);
      setImages(urls);

      console.log('Res: ', response);
      // setMessages((currentMsg) => [...currentMsg, userMessage, response.data]);
      setApiError(null);
      form.reset();
    } catch (error: any) {
      errorLogger(String(error));
      setApiError(String(error));
      // setMessages([]);
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
        title='Visualize with Donut AI'
        description='Instantly create custom images tailored to your needs with our intuitive image generator tool.'
        icon={ImageIcon}
        iconColor='text-pink-400'
        bgColor='bg-pink-400/10'
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
                  <FormItem className='col-span-12 lg:col-span-6'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        // className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        className={`border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent pl-2 ${
                          errors.prompt ? 'border-red-500 border' : ''
                        }`}
                        disabled={isSubmitting}
                        placeholder='Create an image of a dog wearing sunglasses riding a skateboard with pizza in one paw'
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
              <FormField
                control={form.control}
                name='count'
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-2'>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countOptions.map((count) => (
                          <SelectItem key={count.value} value={count.value}>
                            {count.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='resolution'
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-2'>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((count) => (
                          <SelectItem key={count.value} value={count.value}>
                            {count.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          {images.length === 0 && !isSubmitting && (
            <NoData label='Ask, and you shall receive! Type in your query and hit Generate' />
          )}
          {isSubmitting && (
            <div className='w-full flex place-items-center'>
              <Loader />
            </div>
          )}
          {/* Response from gpt */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8'>
            {images.map((image) => (
              <Card key={image} className='rounded-lg overflow-hidden'>
                <div className='relative aspect-square'>
                  <Image alt='ai generated image' fill src={image} />
                </div>
                <CardFooter className='p-2'>
                  <Button
                    variant='secondary'
                    className='w-full'
                    onClick={() => window.open(image)}
                  >
                    <Download className='w-2 h-2 mr-2' />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
