import { Image } from './ImageInterface.ts';

export interface PhotoQueueProps {
  images: Image[];
}

export interface PhotoQueueButtonProps {
  disabled: boolean;
  makeChoice: Function;
}
