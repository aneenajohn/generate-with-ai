'use client';

import React, { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import { UploadWidgetConfig } from '@bytescale/upload-widget';
import { UrlBuilder } from '@bytescale/sdk';

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
  const [imageName, setImageName] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [apiError, setApiError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setImages([]);
    setImageName(null);
    setOriginalImageUrl(null);

    setApiError(null);
    setError(null);
  };

  const id = useId();

  const options: UploadWidgetConfig = {
    apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
      ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
      : 'free',
    maxFileCount: 1,
    mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    editor: { images: { crop: false } },
    styles: { colors: { primary: '#000' } },
  };

  const UploadDropZone = () => (
    <UploadDropzone
      options={options}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length !== 0) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: {
              transformation: 'preset',
              transformationPreset: 'thumbnail',
            },
          });
          setImageName(imageName);
          console.log({ imageUrl });
          setOriginalImageUrl(imageUrl);
        }
      }}
      width='100%'
      height='300px'
    />
  );

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  async function cartoonifyImage(fileUrl: string) {
    setLoading(true);
    try {
      const response = await axios.post('/api/toonify', {
        imageUrl: fileUrl,
      });
      console.log({ response });
      setApiError(null);
      setImages(response.data);
    } catch (error: any) {
      errorLogger(String(error));
      setApiError(String(error));
      setOriginalImageUrl(null);
    } finally {
      router.refresh();
      setLoading(false);
    }
  }

  async function generateSticker(imagUrl: string) {
    setLoading(true);
    try {
      const response = await axios.post('/api/sticker', {
        imageUrl: imagUrl,
      });
      console.log({ response });
      setApiError(null);
      setImages(response.data);
    } catch (error: any) {
      errorLogger(String(error));
      setApiError(String(error));
      setOriginalImageUrl(null);
    } finally {
      router.refresh();
      setLoading(false);
    }
  }

  const handleGenerateClick = async (type: string) => {
    if (!originalImageUrl) {
      setError('Upload a valid image');
      return;
    }
    if (type === 'toonify') {
      cartoonifyImage(originalImageUrl);
    } else {
      generateSticker(originalImageUrl);
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
          {!originalImageUrl ? (
            <div className={`${error ? 'border border-red-500' : ''}`}>
              <UploadDropZone />
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Original Image */}
              <Card
                key={'original_image'}
                className='rounded-lg overflow-hidden'
              >
                <div className='relative aspect-square'>
                  <Image
                    alt='user uploaded image'
                    fill
                    src={originalImageUrl}
                  />
                </div>
              </Card>
              {/* Sticker or Cartoonified Image */}
              {images.length === 0 && !isLoading ? (
                <NoData label='Ask, and you shall receive! Hit Generate' />
              ) : originalImageUrl && isLoading ? (
                <div className='w-full h-full flex justify-center items-center'>
                  <Loader />
                </div>
              ) : (
                <Card
                  key={'cartoonified version'}
                  className='rounded-lg overflow-hidden'
                >
                  <div className='relative aspect-square'>
                    <Image alt='ai generated image' fill src={images[0]} />
                  </div>
                </Card>
              )}
            </div>
          )}

          {error && (
            <span className='text-red-500 text-sm py-3'>{`*${error}`}</span>
          )}

          {apiError && (
            <span className='text-red-500 text-sm py-3'>{`*${apiError}`}</span>
          )}
          <div className='w-full flex gap-4'>
            <Button
              className='col-span-12 lg:col-span-2 w-full my-4'
              // disabled={isLoading}
              disabled={isLoading}
              type='button'
              onClick={() => handleGenerateClick('toonify')}
            >
              Cartoonize
            </Button>
            <Button
              className='col-span-12 lg:col-span-2 w-full my-4'
              // disabled={isLoading}
              disabled={isLoading}
              type='button'
              onClick={() => handleGenerateClick('sticker')}
              variant='outline'
            >
              Generate Sticker
            </Button>
          </div>
          <div>
            {originalImageUrl ? (
              <Button
                className='col-span-12 lg:col-span-2 w-full my-4'
                // disabled={isLoading}
                disabled={isLoading}
                type='button'
                onClick={() => handleReset()}
                variant='outline'
              >
                Upload another
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
