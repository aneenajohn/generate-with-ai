import OpenAI from 'openai';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';

import { errorLogger } from '@/lib/custom_utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// console.log({ openai });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { formData } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const form = new IncomingForm();
    let uploadedFile: any;

    // Parse form data
    form.onPart = function (part) {
      if (!part.filename) {
        form.handlePart(part);
      } else {
        part.on('data', (data) => {
          uploadedFile = data;
        });
      }
    };

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return new NextResponse(`Internal Error: ${err}`, { status: 500 });
      }

      if (!uploadedFile) {
        return new NextResponse('Image is required', { status: 400 });
      }

      if (!openai.apiKey) {
        return new NextResponse('OpenAI API key is missing', { status: 500 });
      }

      // Use 'uploadedFile' for further processing, such as passing it to OpenAI API
      // Example:
      const response = await openai.images.edit({
        image: uploadedFile,
        prompt: 'Create a 3D rendered image of a stylized cartoon character of the given image',
      });

      // Return the response
      return new NextResponse('Success', { status: 200 });
    });

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
