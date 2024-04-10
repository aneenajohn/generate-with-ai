'use client';

import React, { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { any, z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Download, ImageIcon } from 'lucide-react';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
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

import { formSchema } from './constants';
import { errorLogger } from '@/lib/custom_utils';
import { cn } from '@/lib/utils';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

const ImagePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
    mode: 'onChange',
  });

  const fileRef = form.register('file', { required: true });

  const [images, setImages] = useState<string[]>([]);

  const [apiError, setApiError] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = form;

  const id = useId();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // try {
    //   setImages([]);
    //   console.log({ values });
    //   console.log('File: ', values.file);
    //   const fileData = form.getValues('file');
    //   console.log({ fileData });
    //   console.log({ errors });

    //   const file: File = form.getValues('file')[0];
    //   console.log({ file });
    //   // const response = await axios.post('/api/image ', values);
    //   // const urls = response.data.map((image: { url: string }) => image.url);
    //   // setImages(urls);

    //   // console.log('Res: ', response);
    //   // // setMessages((currentMsg) => [...currentMsg, userMessage, response.data]);
    //   // setApiError(null);
    //   // form.reset();

    //   if (file) {
    //     try {
    //       // Create a new FormData object
    //       const formData = new FormData();
    
    //       // Append the file to the FormData object
    //       formData.append('file', file);
    
    //       // Send the FormData object to your API
    //       const response = await axios.post('/api/animate', formData);
    

    //     } catch (error) {
    //       // Handle network or other errors
    //       console.error('Error uploading file:', error);
    //     }
    //   }
    // } 
    try {
      const formData = new FormData();
      formData.append('file', values.file[0]);

      const response = await axios.post('/api/animate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle response
      console.log(response.data);
    }
    catch (error: any) {
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

    console.log({ errors });
    // console.log(form);
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
                          errors.file ? 'border-red-500 border' : ''
                        }`}
                        disabled={isSubmitting}
                        placeholder='upload image'
                        type='file'
                        accept='image/*'
                        multiple={false}
                        {...field}
                        {...fileRef}
                      />
                    </FormControl>
                    <FormMessage />
                    {errors.file && (
                      <span className='text-red-500 text-sm'>
                        <p>{errors?.file?.message}</p>
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
