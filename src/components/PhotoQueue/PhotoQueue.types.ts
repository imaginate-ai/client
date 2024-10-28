import { Image } from '../../types/Image.types';

export type PhotoQueueProps = {
  images: Image[];
};

export type PhotoQueueButtonProps = {
  disabled: boolean;
  makeChoice: Function;
};
