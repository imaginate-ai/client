import { animated, easings, useSpring } from '@react-spring/web';
import { ReactNode, useState } from 'react';

type PhotoSelectorButtonProps = {
  children: ReactNode;
  selected: boolean;
  isCorrect: boolean;
  clickHandler: (input: boolean) => void;
};

const tailwindCSSToHex = {
  'bg-red-600': '#dc2626',
  'bg-green-600': '#16a34a',
  'bg-red-500': '#ef4444',
  'bg-green-500': '#22c55e',
};

const PhotoSelectorButton = ({
  children,
  selected,
  isCorrect,
  clickHandler,
}: PhotoSelectorButtonProps) => {
  const [hovering, setHovering] = useState(false);

  const backgroundColor = isCorrect
    ? hovering
      ? tailwindCSSToHex['bg-green-500']
      : tailwindCSSToHex['bg-green-600']
    : hovering
      ? tailwindCSSToHex['bg-red-500']
      : tailwindCSSToHex['bg-red-600'];

  const sizeAnimation = useSpring({
    transform: selected || hovering ? 'scale(1.1)' : 'scale(1)',
    config: { tension: 700, friction: 20 },
  });

  const borderAnimation = useSpring({
    borderWidth: selected ? 4 : 2,
    borderColor: selected ? 'white' : 'gray',
    backgroundColor,
    config: { duration: 200, easing: easings.easeInOutExpo },
  });

  const animations = {
    ...sizeAnimation,
    ...borderAnimation,
  };

  return (
    <animated.button
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => {
        clickHandler(true);
      }}
      className={'rounded-xl w-16 aspect-square z-10 relative text-xl'}
      style={animations}
    >
      {children}
    </animated.button>
  );
};

export default PhotoSelectorButton;
