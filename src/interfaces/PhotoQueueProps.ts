import { Image } from "./ImageInterface";

export interface PhotoQueueProps {
  images: Image[],
}

export interface PhotoQueueButtonProps {
  disabled: boolean;
  makeChoice: Function;
}