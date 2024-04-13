import { z } from 'zod';

export const formSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.length == 1, 'File is required.')
    .refine((file) => file[0]?.size <= 4000000, 'Max file size is 4MB.'),
});

export const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export function cropString(str: string) {
  if (str.length > 999) {
    return str.substring(0, 999);
  }
  return str;
}
