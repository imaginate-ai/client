import { Flex } from 'antd';
import { Choice } from '../../types/Image.types';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useTransition, animated } from '@react-spring/web';

type PhotoCarouselProps = {
  choices: Choice[];
};

const emoji = ['☠️', '😿', '🤣', '😐', '😊', '😀', '😁', '😲', '😍'];

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

  const intervalRef = useRef<any>(null); //bad

  useEffect(() => {
    if (isButtonClicked) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setPhotoIndex((prevIndex) => (prevIndex + 1) % choices.length);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isButtonClicked]);

  const photos = choices.map(({ isCorrect: correct, image }) => {
    const generatedText = image.real ? 'real' : 'AI';
    const feedbackIcon = correct ? (
      <CheckOutlined className='text-6xl text-green-600 absolute bottom-6 right-6 z-10' />
    ) : (
      <CloseOutlined className='text-6xl text-red-600 absolute bottom-6 right-6 z-10' />
    );
    return (
      <div className='p-8' key={image.url}>
        <div className='flex justify-center'>
          <div className='relative p-4'>
            <img
              className='rounded-lg'
              src={`data:image/png;base64,${image.data}`}
            />
          </div>
        </div>
        <p className='text-2xl'>This photo is {generatedText}</p>
      </div>
    );
  });

  return (
    <div>
      {transitions((style, item) => {
        return <animated.div style={style}>{photos[item]}</animated.div>;
      })}
      <Flex
        justify='center'
        align='center'
        className='bg-gray-700 p-4 rounded-lg relative'
        gap={'2rem'}
      >
        {choices.map(({ isCorrect }, index, choices) => {
          let curHappiness = 0;
          for (let i = 0; i < index; i++) {
            curHappiness += choices[i].isCorrect ? 1 : -1;
          }
          return (
            <button
              key={index}
              onClick={() => {
                setIsButtonClicked(true);
                setAnimationOffset((index - photoIndex) * 20);
                setPhotoIndex(index);
              }}
              className={
                'rounded-xl w-16 aspect-square z-10 border-solid border-2 border-black' +
                (isCorrect
                  ? ' bg-green-600 hover:bg-green-500'
                  : ' bg-red-600 hover:bg-red-500')
              }
              style={{
                transition: 'all 0.2s',
                border: index === photoIndex ? '4px solid white' : '0px',
              }}
            >
              <div className='text-2xl'>
                {/* {emoji[isCorrect ? curHappiness + 4 : 4 - curHappiness]} */}
              </div>
            </button>
          );
        })}
        <div className='absolute top-1/2 transform -translate-y-1/2 z-0 h-1 bg-slate-200 w-full'></div>
      </Flex>
    </div>
  );
};

export default PhotoCarousel;
