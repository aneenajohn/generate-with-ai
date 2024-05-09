import { z } from 'zod';

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: 'Video link is required',
  }),
});

export const TRANSCRIPTION_URL = 'https://api.speechflow.io/asr/file/v1/create';

export const LANG = "en";
