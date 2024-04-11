import { z } from 'zod';

export const formSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.length == 1, 'File is required.')
    .refine((file) => file[0]?.size <= 4000000, 'Max file size is 4MB.')
    .refine(
      (file) => file?.type !== 'image/png',
      'Only .png files are allowed'
    ),
});