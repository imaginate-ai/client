import { Image } from './interfaces/ImageInterface.ts';
import cat1 from './assets/cat1.png';
import cat2 from './assets/cat2.png';
import cat3 from './assets/cat3.jpg';
import cat4 from './assets/cat4.jpg';
import cat5 from './assets/cat5.png';

export const testImages: Image[] = [
  {
    url: cat1,
    generated: true,
  },
  {
    url: cat2,
    generated: true,
  },
  {
    url: cat3,
    generated: false,
  },
  {
    url: cat4,
    generated: true,
  },
  {
    url: cat5,
    generated: true,
  },
];
