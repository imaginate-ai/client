import { useState, JSX, useRef, ReactElement } from 'react';
import './App.css';
import {
  PhotoQueueProps,
  PhotoQueueButtonProps,
} from './interfaces/PhotoQueueProps.ts';
import { testImages } from './testData.ts';
import Navbar from './navigation/Navbar';
import { ConfigProvider, theme, Modal, Button, Carousel } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
const PhotoQueueButtons = ({
  makeChoice,
  disabled,
}: PhotoQueueButtonProps): JSX.Element => {
  const AiButton = useRef<HTMLButtonElement>(null);
  const RealButton = useRef<HTMLButtonElement>(null);
  const [oldButtonBackgroundColor, setOldButtonBackgroundColor] = useState('');

  const clickHandler = (target: HTMLElement) => {
    let choseGenerated = false;
    setOldButtonBackgroundColor(target.style.backgroundColor);

    if (AiButton?.current && RealButton?.current) {
      buttonsDisabled(true);
      if (target.textContent === 'A.I.') {
        choseGenerated = true;
      }
      const isCorrectChoice = makeChoice(choseGenerated, choiceCallBack);
      if (
        (choseGenerated && !isCorrectChoice) ||
        (!choseGenerated && isCorrectChoice)
      ) {
        AiButton.current.style.backgroundColor = 'red';
        RealButton.current.style.backgroundColor = 'green';
      } else {
        AiButton.current.style.backgroundColor = 'green';
        RealButton.current.style.backgroundColor = 'red';
      }
    }
  };

  const choiceCallBack = () => {
    if (AiButton?.current && RealButton?.current) {
      buttonsDisabled(false);
      AiButton.current.style.backgroundColor = oldButtonBackgroundColor;
      RealButton.current.style.backgroundColor = oldButtonBackgroundColor;
    }
  };

  const buttonsDisabled = (value: boolean) => {
    console.log(value);
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
    <>
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
    </>
  );
};

const PhotoQueue = ({ images }: PhotoQueueProps): JSX.Element => {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [choiceKeeper, setChoiceKeeper] = useState<Array<boolean>>([]);
  const [disableButtons, setDisableButtons] = useState(false);
  const shareButton = useRef<HTMLButtonElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [feedbackOverlay, setFeedbackOverlay] = useState<ReactElement>();

  const makeChoice = (choseGenerated: boolean, choiceCallBack: Function) => {
    const isCorrectChoice = choseGenerated == images[index].generated;

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
      }
      setFeedbackOverlay(undefined);
      choiceCallBack();
    }, 750);

    return isCorrectChoice;
  };

  const scoreText = 'Imaginate ' + score + ' / ' + images.length + '\n';
  const emojiScoreText = choiceKeeper
    .map((correctChoice) => (correctChoice ? '🟩' : '🟥'))
    .join('');

  const answers = images.map((image, index) => {
    const generatedText = image.generated ? 'AI' : 'Real';
    const userChoseCorrectly = choiceKeeper[index];
    const feedbackIcon = userChoseCorrectly ? (
      <CheckOutlined className='text-6xl text-green-600 absolute bottom-6 right-6 z-10' />
    ) : (
      <CloseOutlined className='text-6xl text-red-600 absolute bottom-6 right-6 z-10' />
    );

    return (
      <div className='p-8'>
        <div className='flex justify-center '>
          <div className='relative p-4'>
            <img
              className={
                'rounded-lg border-solid border-2 z-0 ' +
                (userChoseCorrectly ? 'border-green-600' : 'border-red-600')
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
    navigator.clipboard.writeText(scoreText + '\n' + emojiScoreText);
    shareButton.current?.setAttribute('disabled', 'true');
    if (shareButton.current?.textContent) {
      shareButton.current.textContent = 'Score coppied to clipboard!';
    }
  };

  return (
    <div className='w-10/12 h-full'>
      <div
        className='flex justify-center relative rounded-lg overflow-hidden mb-8'
        style={{ backgroundColor: undefined }}
      >
        <img ref={image} className='w-auto h-full' src={images[index].url} />
        <div className='opacity-75 absolute w-full h-full'>
          {feedbackOverlay}
        </div>
      </div>
      <PhotoQueueButtons
        makeChoice={makeChoice}
        disabled={disableButtons}
      ></PhotoQueueButtons>
      <h1 className='text-body text-center mt-4'>
        {index + ' / ' + images.length}
      </h1>
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
            Share
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
  );
};

function App() {
  const { darkAlgorithm } = theme;

  return (
    <div className='h-full'>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <Navbar />
        <div className='flex justify-center'>
          <PhotoQueue images={testImages} />
        </div>
      </ConfigProvider>
    </div>
  );
}

export default App;
