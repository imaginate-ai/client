import { Image } from './ImageInterface.ts';

export interface PhotoQueueProps {
  images: Partial<Image>[];
}

export interface PhotoQueueButtonProps {
  disabled: boolean;
  makeChoice: Function;
}
