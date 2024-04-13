import Replicate from 'replicate';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { errorLogger } from '@/lib/custom_utils';

import {
  PROMPT,
  IMAGE_TO_TOONIFY,
  IMAGE_TO_BECOME_URLS,
  getRandomElement,
} from './constants';

const OPEN_AI_SYSTEM_PROMPT = `You are an expert image analyst. You can extract accurate information from an image.
Your Job is to accept an image which can be a photo of a human and respond with as much details as you can.
Give additional details about facial expression, shape of specs if person has wore specs, pose of the person, hair style, type and color of outfit, hand expression, type of beard person has if one has, details about facial anatomy, color of skin, camera angle, how much of a person is visible in under 940 characters length`;

const OPENAI_USER_PROMPT =
  'Analyze the image carefully and give me the details in not more than 940 characters length';

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

    const cartoonifyInput = {
      image: imageUrl,
      prompt: PROMPT,
      image_to_become: getRandomElement(IMAGE_TO_BECOME_URLS),
      // image_to_become:
      //   'https://img.freepik.com/free-photo/3d-rendering-cartoon-character-beach_23-2151054516.jpg?t=st=1712908361~exp=1712911961~hmac=c37101dda59e3805e77f69ea44b5735e4bf19767cb6a4043a6861231aa2551ce&w=826',
      // image_to_become:
      //   'https://replicate.delivery/pbxt/KYFOJNyo1YrmlDBhbk40UvfBWXOLMnVv4ADvMsP3uqdhAusX/ComfyUI_00001_.png',
      negative_prompt: '',
      prompt_strength: 2.5,
      number_of_images: 1,
      denoising_strength: 1,
      instant_id_strength: 1,
      image_to_become_noise: 0.3,
      control_depth_strength: 0.8,
      image_to_become_strength: 0.75,
    };

    const response = await replicate.run(IMAGE_TO_TOONIFY, {
      input: cartoonifyInput,
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
