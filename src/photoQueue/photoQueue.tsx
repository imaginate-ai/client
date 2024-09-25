import { useState, JSX, useRef, ReactElement, useEffect } from 'react';
import { PhotoQueueProps } from './interfaces/PhotoQueueProps.ts';
import {
  Modal,
  Button,
  Carousel,
  Progress,
  Flex,
  Tour,
  TourProps,
  FloatButton,
} from 'antd';
import {
  CloseOutlined,
  CheckOutlined,
  CopyOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import Cookies from 'universal-cookie';
import { PhotoQueueButtons } from './photoQueueButtons.tsx';
import loadingGif from '../assets/loading.gif';
const septemberFirstTimeStamp = 1725148800000;
const septemberFirst = new Date(septemberFirstTimeStamp).setHours(0, 0, 0, 0);
const msPerDay = 86400000;
const today = new Date().setHours(0, 0, 0, 0);
const imaginateDay = (today - septemberFirst) / msPerDay;

const cookies = new Cookies();

export const PhotoQueue = ({ images }: PhotoQueueProps): JSX.Element => {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [choiceKeeper, setChoiceKeeper] = useState<Array<boolean>>([]);
  const [disableButtons, setDisableButtons] = useState(false);
  const shareButton = useRef<HTMLButtonElement>(null);
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

  const generateCompleteScoreText = () => {
    const scoreText = 'Imaginate #' + imaginateDay;
    let emojiScoreText;
    emojiScoreText = choiceKeeper
      .map((correctChoice) => (correctChoice ? '🟩' : '🟥'))
      .join('');
    if (choiceKeeper.every((val) => val === choiceKeeper[0])) {
      emojiScoreText += '✨';
    }
    return scoreText + '\n' + emojiScoreText;
  };

  useEffect(() => {
    if (choiceKeeper.length) {
      const completeScoreText = generateCompleteScoreText();
      cookies.set('last_complete_score_text', completeScoreText);
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
      setChoiceKeeper([...choiceKeeper, true]);
    } else {
      setFeedbackOverlay(
        <div className=' absolute w-full h-full content-center text-center bg-red-500'>
          <CloseOutlined className='text-9xl text-red-800' />
        </div>,
      );
      setChoiceKeeper([...choiceKeeper, false]);
    }

    setTimeout(() => {
      if (index < images.length - 1) {
        setIndex(index + 1);
      } else {
        setIsModalOpen(true);
        setDisableButtons(true);
        const today = new Date();
        cookies.set('day_last_played', today.setHours(0, 0, 0, 0));
      }
      setFeedbackOverlay(undefined);
      choiceCallBack();
    }, 750);

    return isCorrectChoice;
  };

  const answers = images.map((image, index) => {
    const generatedText = image.real ? 'real' : 'AI';
    const userChoseCorrectly = choiceKeeper[index];
    const feedbackIcon = userChoseCorrectly ? (
      <CheckOutlined className='text-6xl text-green-600 absolute bottom-6 right-6 z-10' />
    ) : (
      <CloseOutlined className='text-6xl text-red-600 absolute bottom-6 right-6 z-10' />
    );

    return (
      <div className='p-8' key={image.filename}>
        <div className='flex justify-center '>
          <div className='relative p-4'>
            <img
              className={
                'rounded-lg border-solid border-2 z-0 ' +
                (userChoseCorrectly ? 'border-green-500' : 'border-red-500')
              }
              style={{ maxWidth: '100%' }}
              key={image.url}
              src={`data:image/png;base64,${image.data}`}
            />
            {feedbackIcon}
          </div>
        </div>
        <p className='text-2xl'>This photo is {generatedText}</p>
      </div>
    );
  });

  const shareButtonCopy = () => {
    const completeScoreText = cookies.get('last_complete_score_text');
    if (shareButton.current) {
      if (completeScoreText) {
        navigator.clipboard.writeText(completeScoreText);
        shareButton.current.innerHTML = 'Score copied!';
      } else {
        shareButton.current.textContent = 'Something went wrong :(';
      }
    }
  };

  if (images.length) {
    return (
      <div className='w-full'>
        <FloatButton
          tooltip='How to play'
          icon={<QuestionCircleOutlined />}
          onClick={() => setOpenTour(true)}
        />

        <Flex align='center' justify='center'>
          <div
            ref={parentBox}
            className='w-10/12'
            style={{ maxWidth: '512px' }}
          >
            <Progress
              size={[parentBox.current?.offsetWidth ?? 0, 10]}
              percent={disableButtons ? 100 : (index / images.length) * 100}
              showInfo={false}
            />
            <div
              ref={imageTourStep}
              className='flex justify-center relative rounded-lg overflow-hidden mb-8'
              style={{ backgroundColor: undefined }}
            >
              <img
                ref={image}
                className='w-auto flex-auto'
                src={`data:image/png;base64,${images[index].data}`}
              />
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
              title='Well Played!'
              open={isModalOpen}
              width={'600px'}
              style={{ maxWidth: '95vw' }}
              footer={[
                <Button
                  ref={shareButton}
                  type='default'
                  key='shareButton'
                  onClick={() => shareButtonCopy()}
                >
                  <CopyOutlined />
                  Copy score
                </Button>,
              ]}
              onCancel={() => setIsModalOpen(false)}
            >
              <div className='text-center grid gap-6 grid-cols-1'>
                <p className='text-2xl'>
                  You got {score} out of {images.length} correct!
                </p>
                <Carousel
                  arrows
                  dotPosition='left'
                  infinite={false}
                  className='flex gap-4'
                >
                  {answers}
                </Carousel>
              </div>
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
  } else {
    return (
      <Flex align='center' justify='center' className='w-screen' vertical>
        <img width='192px' src={loadingGif} />
        <p className='text-center'>Loading images...</p>
      </Flex>
    );
  }
};
