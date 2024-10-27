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
import posthog from 'posthog-js';
const septemberFirst = new Date(2024, 8, 1).setHours(0, 0, 0, 0);
const msPerDay = 86400000;
const today = new Date().setHours(0, 0, 0, 0);
const imaginateDay = (today - septemberFirst) / msPerDay;

const cookies = new Cookies();

export const PhotoQueue = ({ images }: PhotoQueueProps): JSX.Element => {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [choiceKeeper, setChoiceKeeper] = useState<Array<boolean>>([]);
  const [disableButtons, setDisableButtons] = useState(true);
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
        posthog.capture('completed_game', {
          score: score,
          length: images.length,
          grade: score / images.length,
          day: today.setHours(0, 0, 0, 0),
          theme: images[0].theme,
        });
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
      <div className='p-8' key={image.url}>
        <div className='flex justify-center '>
          <div className='relative p-4'>
            <img
              className={
                'rounded-lg border-solid border-2 z-0 ' +
                (userChoseCorrectly ? 'border-green-500' : 'border-red-500')
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

  const share = async () => {
    const completeScoreText = cookies.get('last_complete_score_text');
    const isMobile = () => {
      const regex =
        /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return regex.test(navigator.userAgent);
    };
    if (shareButton.current) {
      try {
        if (isMobile()) {
          const shareData = {
            title: 'Imaginate',
            text: completeScoreText,
            url: 'https://playimaginate.com',
          };
          await navigator.share(shareData);
          shareButton.current.innerHTML = '🎉 Score shared!';
        } else {
          await navigator.clipboard.writeText(completeScoreText);
          shareButton.current.innerHTML = '🎉 Score copied!';
        }
        posthog.capture('score_shared');
      } catch (err) {
        if (err instanceof DOMException && err.name !== 'AbortError') {
          shareButton.current.innerHTML = 'Something went wrong...';
        }
      }
    }
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
            <Flex
              justify='center'
              align='center'
              gap={'1rem'}
              className='text-center'
              vertical
            >
              <p className='text-2xl'>
                You got {score} out of {images.length} correct!
              </p>
              <Carousel
                arrows
                dotPosition='left'
                infinite={false}
                className='flex gap-4'
                style={{ width: '100%' }}
              >
                {answers}
              </Carousel>
              <div className='p-1 m-8 share-button-border rounded-full'>
                <Button
                  className='p-8 text-xl rounded-full '
                  ref={shareButton}
                  type='default'
                  key='shareButton'
                  onClick={() => share()}
                >
                  <CopyOutlined className='mr-2' />
                  Share score
                </Button>
              </div>
            </Flex>
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
