import { Image } from './interfaces/ImageInterface.ts';
import cat1 from './assets/cat1.png';
import cat2 from './assets/cat2.png';
import cat3 from './assets/cat3.jpg';
import cat4 from './assets/cat4.jpg';
import cat5 from './assets/cat5.png';

export const testImages: Partial<Image>[] = [
  {
    url: cat1,
    real: false,
    theme: 'cat',
  },
  {
    url: cat2,
    real: false,
    theme: 'cat',
  },
  {
    url: cat3,
    real: true,
    theme: 'cat',
  },
  {
    url: cat4,
    real: false,
    theme: 'cat',
  },
  {
    url: cat5,
    real: false,
    theme: 'cat',
  },
];
