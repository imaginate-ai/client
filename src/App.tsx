import { useState, JSX, useRef } from 'react';
import './App.css';
import {
  PhotoQueueProps,
  PhotoQueueButtonProps,
} from './interfaces/PhotoQueueProps';
import { testImages } from './testData';
import Navbar from './navigation/Navbar';
import { ConfigProvider, theme, Modal, Button } from 'antd';

const PhotoQueueButtons = ({
  makeChoice,
  disabled,
}: PhotoQueueButtonProps): JSX.Element => {
  const AiButton = useRef<HTMLElement>(null);
  const RealButton = useRef<HTMLElement>(null);
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
      <div className='flex flex-row gap-2 h-16'>
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
  const [scoreText, setScoreText] = useState('');
  const [disableButtons, setDisableButtons] = useState(false);
  const shareButton = useRef<HTMLElement>(null);

  const makeChoice = (choseGenerated: boolean, choiceCallBack: Function) => {
    const isCorrectChoice = choseGenerated == images[index].generated;

    if (isCorrectChoice) {
      setScore(score + 1);
      setScoreText(scoreText + '🟩');
    } else {
      setScoreText(scoreText + '🟥');
    }

    setTimeout(() => {
      if (index < images.length - 1) {
        setIndex(index + 1);
      } else {
        setIsModalOpen(true);
        setDisableButtons(true);
      }
      choiceCallBack();
    }, 750);

    return isCorrectChoice;
  };

  let answers = images.map((image) => {
    let generatedText;
    if (image.generated) {
      generatedText = 'AI';
    } else {
      generatedText = 'Real';
    }
    return (
      <div>
        <img className='rounded-lg' key={image.url} src={image.url} />
        <p>{generatedText}</p>
      </div>
    );
  });

  const shareButtonCopy = () => {
    navigator.clipboard.writeText('Imaginate ' + scoreText);
    shareButton.current?.setAttribute('loading', '1000');
    setInterval(() => {
      shareButton.current?.setAttribute('disabled', 'true');
      if (shareButton.current?.textContent) {
        shareButton.current.textContent = 'Copied to clipboard!';
      }
    }, 1000);
  };

  return (
    <div className='w-10/12 h-full'>
      <div className='flex justify-center'>
        <img
          className='w-auto mb-2 rounded-lg h-full'
          src={images[index].url}
        ></img>
      </div>
      <PhotoQueueButtons
        makeChoice={makeChoice}
        disabled={disableButtons}
      ></PhotoQueueButtons>
      <Modal
        title='Well Played!'
        open={isModalOpen}
        width={'80vw'}
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
        {' '}
        <div className='text-center grid gap-6 grid-cols-1'>
          <p>
            You got {score} out of {images.length} correct!
          </p>
          <div className='flex gap-4'>{answers}</div>
          <p>{scoreText}</p>
        </div>
      </Modal>
    </div>
  );
};

function App() {
  const { darkAlgorithm } = theme;

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
