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

const OPEN_AI_SYSTEM_PROMPT = `You are an expert image analyst. You can extract accurate information from an image.
Your Job is to accept an image which can be a photo of a human and respond with as much details as you can.
Give additional details about facial expression, shape of specs if person has wore specs, pose of the person, hair style, type and color of outfit, hand expression, type of beard person has if one has, details about facial anatomy, color of skin, camera angle, how much of a person is visible in under 940 characters length`;

const OPENAI_USER_PROMPT =
  'Analyze the image carefully and give me the details in not more than 940 characters length';

const prefix =
  'Create a 3D rendered image of a stylized cartoon character based on following prompt';

async function generateImage(prompt) {
  const response = await fetch('/api/image/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function POST(req: Request) {
  async function getImageDetails(base64Image: string) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: OPEN_AI_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: OPENAI_USER_PROMPT,
            },
          ],
        },
      ],
    });

    console.log(
      'Content',
      response.choices[0].message.content?.length,
      response.choices[0].message.content
    );
    return response.choices[0].message.content;
  }

  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // const body = await req.json();
    // const { file } = body;

    const body = await req.formData();
    const base64Image = body.get('base64Image') as string;

    console.log({ base64Image });

    if (!base64Image) {
      return new NextResponse('Image prompt are required', { status: 400 });
    }

    const imageDetails = await getImageDetails(base64Image);
    const imagePrompt = prefix + '\n\n' + imageDetails;
    // const imageUrl = await generateImage(imagePrompt);
    // console.log({ imageUrl });

    return NextResponse.json(imageDetails);
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
