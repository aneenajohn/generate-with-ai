import OpenAI from 'openai';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
// import { IncomingForm } from 'formidable';
import { createReadStream } from 'fs';

import { errorLogger } from '@/lib/custom_utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// console.log({ openai });

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { file, prompt, size = '512x512' } = body;

    console.log({ file, prompt, size });

    if (!prompt) {
      return new NextResponse('Image prompt are required', { status: 400 });
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    if (!size) {
      return new NextResponse('Resolution of image size is required', {
        status: 400,
      });
    }

    const response = await openai.images.edit({
      image: createReadStream(file) as unknown as File,
      prompt,
      size,
    });

    console.log('Edit result:', response.data);
    return NextResponse.json(response.data);

    // const form = new IncomingForm();
    // let uploadedFile: any;

    // OLD
    // Parse form data
    // form.onPart = function (part) {
    //   if (!part.filename) {
    //     form.handlePart(part);
    //   } else {
    //     part.on('data', (data) => {
    //       uploadedFile = data;
    //     });
    //   }
    // };

    // form.parse(req, async (err, fields, files) => {
    //   if (err) {
    //     console.error('Error parsing form data:', err);
    //     return new NextResponse(`Internal Error: ${err}`, { status: 500 });
    //   }

    //   if (!uploadedFile) {
    //     return new NextResponse('Image is required', { status: 400 });
    //   }

    //   if (!openai.apiKey) {
    //     return new NextResponse('OpenAI API key is missing', { status: 500 });
    //   }
    // OLD

    //   // Use 'uploadedFile' for further processing, such as passing it to OpenAI API
    //   // Example:
    //   const response = await openai.images.edit({
    //     image: uploadedFile,
    //     prompt: 'Create a 3D rendered image of a stylized cartoon character of the given image',
    //   });

    //   // Return the response
    //   return new NextResponse('Success', { status: 200 });
    // });

    // if (!formData) {
    //   return new NextResponse('Image is required', { status: 400 });
    // }

    // if (!openai.apiKey) {
    //   return new NextResponse('OpenAI api key is missing', {
    //     status: 500,
    //   });
    // }

    // const response = await openai.images.generate({
    //   prompt,
    //   n: parseInt(count, 10),
    //   size: resolution,
    // });

    // return NextResponse.json(response.data);
  } catch (error) {
    errorLogger(String(error));
    const errorCode = (error as any).code;
    console.log('chkkkkkkkkkkk:');
    console.log(error);
    console.log({ errorCode });
    return new NextResponse(`Internal Error: ${error}`, {
      status: 500,
    });
  }
}
