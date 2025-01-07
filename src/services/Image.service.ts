import { Image } from "../types/Image.types.ts";
import { currentDay } from "./Day.service.ts";

export const getImages = (() => {
  let cachedImages: Promise<Image[]>;

  return async () => {
    if (cachedImages) {
      return cachedImages;
    }
    const day = currentDay();
    console.log(import.meta.env.VITE_API_URL);
    try {
      const imageResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/date/${day}/images`,
      ).then((res) => res.json());
      cachedImages = Promise.resolve(_shuffle(imageResponse, day));
    } catch (err) {
      console.error(err);
      return;
    }
    return cachedImages;
  };
})();

function _shuffle(array: Image[], seed: number) {
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
