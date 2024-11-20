import { useState, JSX, useRef, ReactElement, useEffect } from 'react';
import { PhotoQueueProps } from './PhotoQueue.types.ts';
import { Modal, Progress, Flex, Tour, TourProps, FloatButton } from 'antd';
import {
  CloseOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import PhotoQueueButtons from './PhotoQueueButtons.tsx';
import loadingGif from '../../assets/loading.gif';
import posthog from 'posthog-js';
import GameRecap from '../GameRecap/GameRecap.tsx';
import { Choice } from '../../types/Image.types.ts';

const PhotoQueue = ({ images }: PhotoQueueProps): JSX.Element => {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [choiceKeeper, setChoiceKeeper] = useState<Array<Choice>>([]);
  const [disableButtons, setDisableButtons] = useState(true);
  const image = useRef<HTMLImageElement>(null);
  const parentBox = useRef<HTMLDivElement>(null);
  const [feedbackOverlay, setFeedbackOverlay] = useState<ReactElement>();

  const [openTour, setOpenTour] = useState(false);

  const imageTourStep = useRef<HTMLDivElement>(null);
  const buttonsTourStep = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Welcome!',
      description:
        'This is Imaginate. You will be given a different list of photos every day, and you have to decipher which are real photos, and which are AI generated.',
      target: null,
    },
    {
      title: 'The Photo Queue',
      description:
        'Here is where the photos will appear, one after another. Be sure to analyze them thoroughly!',
      placement: 'top',
      target: () => imageTourStep.current as HTMLElement,
    },
    {
      title: 'The Choice Buttons',
      description:
        'These buttons are used to select whether you think the current photo is real or AI generated. The choice is yours. Good luck!',
      placement: 'bottom',
      target: () => buttonsTourStep.current as HTMLElement,
    },
  ];

  useEffect(() => {
    if (choiceKeeper.length) {
      localStorage.setItem('last_choice_keeper', JSON.stringify(choiceKeeper));
    }
  }, [choiceKeeper]);

  const makeChoice = (choseReal: boolean, choiceCallBack: Function) => {
    const isCorrectChoice = choseReal == images[index].real;

    if (isCorrectChoice) {
      setScore(score + 1);
      setFeedbackOverlay(
        <div className='absolute w-full h-full content-center text-center bg-green-500'>
          <CheckOutlined className='text-9xl text-green-800' />
        </div>,
      );
      setChoiceKeeper([
        ...choiceKeeper,
        { isCorrect: true, image: images[index] },
      ]);
    } else {
      setFeedbackOverlay(
        <div className=' absolute w-full h-full content-center text-center bg-red-500'>
          <CloseOutlined className='text-9xl text-red-800' />
        </div>,
      );
      setChoiceKeeper([
        ...choiceKeeper,
        { isCorrect: false, image: images[index] },
      ]);
    }

    setTimeout(() => {
      if (index < images.length - 1) {
        setIndex(index + 1);
      } else {
        setIsModalOpen(true);
        setDisableButtons(true);
        const today = new Date().setHours(0, 0, 0, 0);
        localStorage.setItem('day_last_played', today.toString());
        posthog.capture('completed_game', {
          score: score,
          length: images.length,
          grade: score / images.length,
          day: today,
          theme: images[0].theme,
        });
      }
      setFeedbackOverlay(undefined);
      choiceCallBack();
    }, 750);

    return isCorrectChoice;
  };

  useEffect(() => {
    if (images.length) {
      setDisableButtons(false);
    }
  }, [images]);

  return (
    <div className='w-full'>
      <FloatButton
        tooltip='How to play'
        icon={<QuestionCircleOutlined />}
        onClick={() => {
          setOpenTour(true);
          posthog.capture('tour_triggered');
        }}
      />

      <Flex align='center' justify='center'>
        <div ref={parentBox} className='w-10/12' style={{ maxWidth: '512px' }}>
          <Progress
            size={[parentBox.current?.offsetWidth ?? 0, 10]}
            percent={
              images.length
                ? disableButtons
                  ? 100
                  : (index / images.length) * 100
                : 0
            }
            showInfo={false}
          />
          <div
            ref={imageTourStep}
            className='flex justify-center relative rounded-lg overflow-hidden mb-8'
            style={{ backgroundColor: undefined }}
          >
            {images.length ? (
              <img
                ref={image}
                className='w-auto flex-auto'
                src={`data:image/png;base64,${images[index].data}`}
              />
            ) : (
              <div
                style={{ width: '512px' }}
                className='rounded-xl bg-zinc-900 aspect-square'
              >
                <Flex
                  align='center'
                  justify='center'
                  vertical
                  className='w-full h-full -mt-8'
                >
                  <img width='192px' src={loadingGif} />
                  <p className='text-center'>Loading images...</p>
                </Flex>
              </div>
            )}

            <div className='opacity-75 absolute w-full h-full'>
              {feedbackOverlay}
            </div>
          </div>
          <div ref={buttonsTourStep}>
            <PhotoQueueButtons
              makeChoice={makeChoice}
              disabled={disableButtons}
            />
          </div>
          <Modal
            title=''
            open={isModalOpen}
            width={'600px'}
            style={{
              maxWidth: '95vw',
              maxHeight: '95vh',
              top: '1rem',
              height: '100%',
            }}
            footer={null}
            onCancel={() => {
              setIsModalOpen(false);
            }}
          >
            <GameRecap choices={choiceKeeper} />
          </Modal>
        </div>
        <Tour
          open={openTour}
          onClose={() => setOpenTour(false)}
          steps={steps}
        />
      </Flex>
    </div>
  );
};

export default PhotoQueue;
