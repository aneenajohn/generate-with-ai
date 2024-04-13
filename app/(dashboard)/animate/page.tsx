'use client';

import React, { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Download, ImageIcon } from 'lucide-react';

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

import NoData from '@/components/no_data';
import Loader from '@/components/loader';

import { formSchema, convertBase64, cropString } from './constants';
import { errorLogger } from '@/lib/custom_utils';
import { Card, CardFooter } from '@/components/ui/card';

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
    try {
      setImages([]);
      console.log({ values });
      console.log('File: ', values.file[0]);
      const fileData = form.getValues('file');
      console.log({ fileData });
      console.log({ errors });

      const file_1: File = form.getValues('file')[0];
      console.log({ file_1 });

      const file: File = values.file[0];

      await convertBase64(file)
        .then(async (base64Data: any) => {
          const formData = new FormData();
          formData.append('base64Image', base64Data);

          // const response = await axios.post('/api/animate', formData);
          // if (response.status == 200) {
          //   const prefix = 'Create a 3D cartoonified image of ';
          //   let prompt = cropString(prefix + response.data);
          //   const resp = await axios.post('/api/image ', {
          //     prompt,
          //     n: 1,
          //     size: '512x512',
          //   });
          //   const urls = resp.data.map((image: { url: string }) => image.url);
          //   setImages(urls);
          //   console.log(urls);
          // }
        })
        .catch((err) => console.log(err));
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

    console.log({ errors });
    // console.log(form);
    if (Object.keys(errors).length === 0) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <Heading
        title='Cartoonize with Donut AI'
        description='Transform your photos into lively animated avatars'
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
                  <FormItem className='col-span-12 lg:col-span-10'>
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
                    {errors.file && errors.file.message && (
                      <span className='text-red-500 text-sm'>
                        <p>{String(errors.file.message)}</p>
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
          <div className='gap-4 mt-8 w-full flex place-items-center'>
            {images.map((image) => (
              <Card key={image} className='rounded-lg overflow-hidden'>
                <div className='relative aspect-square w-full'>
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
