import { Carousel } from 'antd';
import { Choice } from '../../types/Image.types';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

interface PhotoCarouselProps {
  choices: Choice[];
}

const PhotoCarousel = ({ choices }: PhotoCarouselProps) => {
  const answers = useMemo(() => {
    return buildAnswers(choices);
  }, [choices]);

  return (
    <Carousel
      arrows
      dotPosition='left'
      infinite={false}
      className='flex gap-4'
      style={{ width: '100%' }}
    >
      {answers}
    </Carousel>
  );
};

const buildAnswers = (choices: Choice[]) => {
  return choices.map(({ isCorrect: correct, image }) => {
    const generatedText = image.real ? 'real' : 'AI';
    const feedbackIcon = correct ? (
      <CheckOutlined className='text-6xl text-green-600 absolute bottom-6 right-6 z-10' />
    ) : (
      <CloseOutlined className='text-6xl text-red-600 absolute bottom-6 right-6 z-10' />
    );
    return (
      <div className='p-8' key={image.url}>
        <div className='flex justify-center '>
          <div className='relative p-4'>
            <img
              className={
                'rounded-lg border-solid border-2 z-0 ' +
                (correct ? 'border-green-500' : 'border-red-500')
              }
              style={{ maxWidth: '100%' }}
              src={`data:image/png;base64,${image.data}`}
            />
            {feedbackIcon}
          </div>
        </div>
        <p className='text-2xl'>This photo is {generatedText}</p>
      </div>
    );
  });
};

export default PhotoCarousel;
