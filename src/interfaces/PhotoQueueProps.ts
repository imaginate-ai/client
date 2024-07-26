import { Image } from "./imageInterface";

export interface PhotoQueueProps {
  images: Image[],
}

export interface PhotoQueueButtonProps {
  children: string;
  color: string;
  onClick: Function;
}