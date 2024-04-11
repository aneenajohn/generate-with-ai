import OpenAI from 'openai';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
// import formidable from 'formidable';
import { createReadStream } from 'fs';
import { join } from 'path';

import { errorLogger } from '@/lib/custom_utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface UploadableFile {
  content: Buffer;
  lastModified: number;
  name: string;
  size: number;
  type: string;
}
// console.log({ openai });
function fileToBuffer(file: File): Promise<UploadableFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve({
          content: Buffer.from(reader.result),
          lastModified: file.lastModified,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      } else {
        reject(new Error('File reader result is not a string'));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsArrayBuffer(file);
  });
}
export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.formData();
    const file = body.get('file') as File;
    const prompt = body.get('prompt') as string;
    const size = body.get('size');

    console.log({ file, prompt, size });

    if (!file) {
      return new NextResponse('file is required', { status: 400 });
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    if (!size) {
      return new NextResponse('Resolution of image size is required', {
        status: 400,
      });
    }

    // const response = await openai.images.edit({
    // image: createReadStream(file) as unknown as File,
    //   // image: file,
    // image: imageStream,
    //   prompt,
    //   size,
    // });

    // const fileStream = createReadStream(file);

    const sizeOfImage = '512x512';

    // const imagePath = join(__dirname, 'aneena.png');
    // path.join(__dirname, 'cool.txt');

    const imagePath = 'app/api/animate/aneena.png';
    const response = await openai.images.edit({
      // image: await fileToBuffer(file),
      image: createReadStream(imagePath),
      mask: createReadStream(imagePath),
      prompt,
      size: sizeOfImage,
    });
    console.log('Edit result:', response.data);
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
