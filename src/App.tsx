import { useState, JSX, useRef, ReactElement, useEffect } from 'react';
import './App.css';
import {
  PhotoQueueProps,
  PhotoQueueButtonProps,
} from './interfaces/PhotoQueueProps.ts';
import { testImages } from './testData.ts';
import Navbar from './navigation/Navbar';
import {
  ConfigProvider,
  theme,
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
  LoadingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import posthog from 'posthog-js';
import Cookies from 'universal-cookie';

const imageTheme = testImages[0].theme;
const septemberFirstTimeStamp = 1725148800000;
const septemberFirst = new Date(septemberFirstTimeStamp).setHours(0, 0, 0, 0);
const msPerDay = 86400000;
const today = new Date().setHours(0, 0, 0, 0);
const imaginateDay = (today - septemberFirst) / msPerDay;

const cookies = new Cookies();

const PhotoQueueButtons = ({
  makeChoice,
  disabled,
}: PhotoQueueButtonProps): JSX.Element => {
  const AiButton = useRef<HTMLButtonElement>(null);
  const RealButton = useRef<HTMLButtonElement>(null);

  const clickHandler = (target: HTMLElement) => {
    let choseReal: boolean;

    if (AiButton?.current && RealButton?.current) {
      buttonsDisabled(true);
      if (target.textContent === 'A.I.') {
        choseReal = false;
      } else {
        choseReal = true;
      }
      makeChoice(choseReal, choiceCallBack);
    }
  };

  const choiceCallBack = () => {
    if (AiButton?.current && RealButton?.current) {
      buttonsDisabled(false);
    }
  };

  const buttonsDisabled = (value: boolean) => {
    if (AiButton?.current && RealButton?.current) {
      if (value) {
        AiButton.current.setAttribute('disabled', 'true');
        RealButton.current.setAttribute('disabled', 'true');
      } else {
        AiButton.current.removeAttribute('disabled');
        RealButton.current.removeAttribute('disabled');
      }
    }
  };

  if (disabled) {
    buttonsDisabled(true);
  }

  return (
    <div className='flex flex-row gap-8 h-16'>
      <Button
        ref={AiButton}
        type='primary'
        className={'choiceButton mb-2 w-full h-full text-body'}
        onClick={(event) => clickHandler(event.target as HTMLElement)}
      >
        A.I.
      </Button>
      <Button
        ref={RealButton}
        type='primary'
        className={'choiceButton mb-2 w-full h-full text-body'}
        onClick={(event) => clickHandler(event.target as HTMLElement)}
      >
        Real
      </Button>
    </div>
  );
};

// const apiUrl = 'http://127.0.0.1:5000';

const PhotoQueue = ({ images }: PhotoQueueProps): JSX.Element => {
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
    const scoreText = 'Imaginate ' + imaginateDay;
    const emojiScoreText = choiceKeeper
      .map((correctChoice) => (correctChoice ? '🟩' : '🟥'))
      .join('');
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
    const generatedText = image.real ? 'Real' : 'AI';
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
              style={{ maxWidth: '500px' }}
              width='100%'
              key={image.url}
              src={image.url}
            />
            {feedbackIcon}
          </div>
        </div>
        <p className='text-2xl'>This Photo is {generatedText}</p>
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
  // let apiTest;
  // const getPhotos = async () => {
  //   const dateBody = await fetch(apiUrl + '/date/latest').then((res) =>
  //     res.json(),
  //   );
  //   const date = dateBody.date;
  //   const imageBody: any[] = await fetch(apiUrl + `/date/${date}/images`).then(
  //     (res) => res.json(),
  //   );
  //   const apiImages: any[] = imageBody.map(
  //     async (image) =>
  //       await fetch(apiUrl + image.url).then((response) => response.json()),
  //   );
  //   apiTest = await apiImages.map((body) => (
  //     <img src={'data:image/png;base64, ' + body.url} />
  //   ));
  // };

  if (images) {
    return (
      <div>
        <FloatButton
          tooltip='How to play'
          icon={<QuestionCircleOutlined />}
          onClick={() => setOpenTour(true)}
        />

        <Flex align='center' justify='center'>
          <div ref={parentBox} className='w-10/12'>
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
                className='w-auto h-full'
                src={images[index].url}
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
              width={'700px'}
              style={{ maxWidth: '95vw' }}
              footer={[
                <Button
                  ref={shareButton}
                  type='default'
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
      <Flex justify='center' className='w-screen'>
        <LoadingOutlined className='text-5xl' />
      </Flex>
    );
  }
};

function App() {
  const { darkAlgorithm } = theme;
  const [showApp, setShowApp] = useState(true);
  const savedScoreString = useRef<ReactElement>();

  posthog.init('phc_TrQqpxDjEZAOLzSUBk8DKJF8UzhBj4sbkhe6YOSxYxe', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  });

  const splitNewlinesToParagraphTags = (input: string) => {
    return input.split('\n').map((text) => <p>{text}</p>);
  };

  useEffect(() => {
    const dayLastPlayed = new Date(cookies.get('day_last_played'));
    const completeScoreText: string = cookies.get('last_complete_score_text');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
      dayLastPlayed.toTimeString() === today.toTimeString() &&
      completeScoreText
    ) {
      setShowApp(false);
      savedScoreString.current = (
        <div>{splitNewlinesToParagraphTags(completeScoreText)}</div>
      );
    }
  }, []);

  const dailyGameReminder = (
    <div style={{ width: '100vw', maxWidth: '1024px' }} className='text-center'>
      <p className='font-semibold mb-2'>
        You already played today! See you again tomorrow :)
      </p>
      {savedScoreString.current}
    </div>
  );
  const body = showApp ? <PhotoQueue images={testImages} /> : dailyGameReminder;

  return (
    <div className='h-full'>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <Flex align='flex-start' className='h-full w-full' vertical>
          <Navbar theme={imageTheme} />
          <Flex
            align='center'
            justify='space-evenly'
            className='flex-auto'
            vertical
          >
            {body}
            <p>
              Made by{' '}
              <a href='https://faisal-fawad.github.io' target='_blank'>
                Faisal
              </a>
              ,{' '}
              <a href='https://nathanprobert.ca' target='_blank'>
                Nate
              </a>
              , and{' '}
              <a href='https://linkedin.com/in/zach-legesse ' target='_blank'>
                Zach
              </a>
            </p>
          </Flex>
        </Flex>
      </ConfigProvider>
    </div>
  );
}

export default App;
