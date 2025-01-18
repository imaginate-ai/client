import { Choice } from '../../types/Image.types';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useTransition, animated, useSpring } from '@react-spring/web';
import PhotoSelector from './PhotoSelector';
import { Flex } from 'antd';

type PhotoCarouselProps = {
  choices: Choice[];
};

const PhotoCarousel = ({ choices }: PhotoCarouselProps) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [animationOffset, setAnimationOffset] = useState(20);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const transitions = useTransition(photoIndex, {
    from: {
      opacity: 0,
      transform: `translateX(${animationOffset}px)`,
    },
    enter: { opacity: 1, transform: `translateX(0px)` },
    leave: { opacity: 0, transform: `translateX(${-1 * animationOffset}px)` },
    config: {
      duration: 200,
      easing: (t) => Math.pow(t - 1, 3) + 1,
    },
    keys: [photoIndex],
    exitBeforeEnter: true,
  });

  const selectNewPhotoIndex = (newIndex: number) => {
    setIsButtonClicked(true);
    setAnimationOffset((newIndex - photoIndex) * 20);
    setPhotoIndex(newIndex);
  };

  const intervalRef = useRef<any>(null); //bad

  useEffect(() => {
    if (isButtonClicked) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (choices.length > 0) {
      intervalRef.current = setInterval(() => {
        setPhotoIndex((prevIndex) => (prevIndex + 1) % choices.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isButtonClicked, choices]);

  const photos = choices.map(({ isCorrect: correct, image }) => {
    const generatedText = image.real ? 'real' : 'AI';
    const feedbackIconClasses = 'text-6xl absolute bottom-6 right-6 z-10';
    const feedbackIcon = correct ? (
      <CheckOutlined className={feedbackIconClasses + 'text-green-600'} />
    ) : (
      <CloseOutlined className={feedbackIconClasses + 'text-red-600'} />
    );
    return (
      <div className='p-8' key={image.url}>
        <div className='flex justify-center'>
          <div className='relative p-4'>
            <img
              className='rounded-lg'
              src={`data:image/png;base64,${image.data}`}
            />
            {feedbackIcon}
          </div>
        </div>
        <p className='text-2xl'>This photo is {generatedText}</p>
      </div>
    );
  });

  return (
    <Flex justify='center' align='center' className='w-full h-full' vertical>
      {transitions((style, item) => {
        return <animated.div style={style}>{photos[item]}</animated.div>;
      })}
      <div className='max-w-lg w-full'>
        <PhotoSelector
          choices={choices}
          clickHandler={selectNewPhotoIndex}
          selectedIndex={photoIndex}
        />
      </div>
    </Flex>
  );
};

export default PhotoCarousel;
