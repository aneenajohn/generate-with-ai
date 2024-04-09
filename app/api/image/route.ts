import OpenAI from 'openai';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { chatLogger, errorLogger } from '@/lib/custom_utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// console.log({ openai });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, count = 1, resolution = '512x512' } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!prompt) {
      return new NextResponse('Image prompt are required', { status: 400 });
    }

    if (!count) {
      return new NextResponse('Number of images is required', { status: 400 });
    }

    if (!resolution) {
      return new NextResponse('Resolution of images is required', {
        status: 400,
      });
    }

    if (!openai.apiKey) {
      return new NextResponse('OpenAI api key is missing', {
        status: 500,
      });
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(count, 10),
      size: resolution,
    });

    return NextResponse.json(response.data);
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
