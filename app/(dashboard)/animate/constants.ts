import { z } from 'zod';

export const formSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.length == 1, 'File is required.')
    .refine((file) => file[0]?.size <= 3000000, `Max file size is 3MB.`),
});