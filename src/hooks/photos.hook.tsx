import { useEffect, useState } from "react";
import { Image } from "../types/Image.types";
import { getToday } from "../services/Day.service";

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Image[]>();
  const [photoTheme, setPhotoTheme] = useState<string | undefined>();
  useEffect(() => {
    const fetchPhotoInfo = async () => {
      const fetchedPhotos = await fetchPhotos();
      setPhotos(fetchedPhotos);
      const fetchedTheme = await fetchTheme();
      setPhotoTheme(fetchedTheme);
    };
    fetchPhotoInfo();
  }, []);
  return [photos, photoTheme] as const;
};

const fetchPhotos = (() => {
  let cachedPhotos: Promise<Image[]>;
  return async () => {
    if (cachedPhotos) {
      return cachedPhotos;
    }
    const day = getToday();
    try {
      const photoResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/date/${day}/images`,
      ).then((res) => res.json());
      cachedPhotos = Promise.resolve(_shuffle(photoResponse, day));
    } catch (err) {
      console.error(err);
      return;
    }
    return cachedPhotos;
  };
})();

const fetchTheme = async () => {
  const response = await fetchPhotos();
  return response?.[0].theme;
};

const _shuffle = (array: Image[], seed: number) => {
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
};

const _random = (seed: number) => {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};
