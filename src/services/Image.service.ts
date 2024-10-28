import { Image } from '../types/Image.types.ts';
import { calculateDay } from './Day.service';

const API_URL =
  'https://o7hgv46qcf7swox3ygn53tayay0zzhgl.lambda-url.us-east-1.on.aws/';

export const getImages = await (async () => {
  let cachedImages: Image[];

  return async () => {
    if (cachedImages) {
      return cachedImages;
    }
    const day = calculateDay();
    let images;
    try {
      images = await fetch(
        API_URL +
          '?' +
          new URLSearchParams({
            day: `${day}`,
          }).toString(),
      ).then((res) => res.json());
    } catch (err) {
      console.error(err);
      return;
    }
    cachedImages = _shuffle(images, day);
    return cachedImages;
  };
})();

function _shuffle(array: any[], seed: number) {
  var m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(_random(seed) * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed;
  }
  return array;
}

function _random(seed: number) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
