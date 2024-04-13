export const IMAGE_TO_TOONIFY =
  'fofr/become-image:42cf9559131f57f018bf8cdc239a74f4871c5852045ce8f23b346e4ef8f56aa8';

export const PROMPT =
  'Analyze the image  carefully and Create a 3D rendered image of a stylized cartoon character based on image_to_become';

export const IMAGE_TO_BECOME_URLS = [
  'https://img.freepik.com/free-photo/3d-rendering-cartoon-character-beach_23-2151054516.jpg?t=st=1712908361~exp=1712911961~hmac=c37101dda59e3805e77f69ea44b5735e4bf19767cb6a4043a6861231aa2551ce&w=826',
  'https://replicate.delivery/pbxt/KYFOJNyo1YrmlDBhbk40UvfBWXOLMnVv4ADvMsP3uqdhAusX/ComfyUI_00001_.png',
  'https://img.freepik.com/free-photo/3d-carnival-character_23-2151179368.jpg?t=st=1712909842~exp=1712913442~hmac=ae4bee5cc33dce5b17100104bdcd5bb9c4d843e6c9b8428133017e0f6962173f&w=826',
  'https://img.freepik.com/premium-photo/3d-cartoon-super-hero_602089-17572.jpg?w=1380',
  ,
  'https://img.freepik.com/premium-photo/cartoon-character-with-backpack-antlers-carrying-map_861724-2584.jpg?w=1380',
  'https://img.freepik.com/free-photo/view-3d-shocked-man-with-mouth-wide-open_23-2150709972.jpg?t=st=1712909458~exp=1712913058~hmac=fb2778fe4c78983083f510631c8276127f14554cbf719d01f48094825b905c33&w=1380',
  'https://img.freepik.com/free-photo/anime-character-traveling_23-2151278894.jpg?t=st=1712909401~exp=1712913001~hmac=3c5e3d2ae10713bee767bd8861f3c7a78b73d165a7ba3ae994bf96beca0076d8&w=1380',
  'https://static.vecteezy.com/ti/vettori-gratis/t1/36173920-gallo-baseball-illustrazione-vettore-vettoriale.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Jk3nxQwUpPNEzVgZ7b1-OLd7osGUK_DN9loE0dhl_Q&s',
  'https://img.freepik.com/free-photo/3d-rendering-cartoon-like-boy-holding-sign_23-2150797672.jpg?t=st=1712908484~exp=1712912084~hmac=5c734504a042457794a076f8ff4b6b346b3d9e088de4ff2ae523084cd72fd290&w=1380',
  'https://img.freepik.com/premium-photo/young-man-with-beard-glasses-showing-thumbs-up-front-fantasy-landscape_1057-39913.jpg?w=1380',
];

export function getRandomElement(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
