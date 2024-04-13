import Replicate from 'replicate';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { errorLogger } from '@/lib/custom_utils';

import { PROMPT, FACE_TO_STICKER } from './constants';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { imageUrl } = body;

    if (!imageUrl) {
      return new NextResponse('Input image is required', { status: 400 });
    }

    console.log({ imageUrl });

    const stickerInput = {
      image: imageUrl,
      steps: 20,
      width: 1024,
      height: 1024,
      prompt: PROMPT,
      upscale: false,
      upscale_steps: 10,
      negative_prompt: '',
      prompt_strength: 6,
      ip_adapter_noise: 0.5,
      ip_adapter_weight: 0.2,
      instant_id_strength: 0.7,
    };

    const response = await replicate.run(FACE_TO_STICKER, {
      input: stickerInput,
    });

    return NextResponse.json(response);
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
