import { useState } from 'react'
import './App.css'
import { PhotoQueueProps } from './interfaces/PhotoQueueProps'
import { testImages } from './testData'
import Navbar from './navigation/Navbar';
import { ConfigProvider, theme, Modal } from 'antd';

const PhotoQueue = ({ images }: PhotoQueueProps): JSX.Element => {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [scoreText, setScoreText] = useState('');


  const makeChoice = (choseGenerated: boolean) => {

    const correctChoice = (choseGenerated == images[index].generated)

    if (correctChoice) {
      setScore(score + 1);
      setScoreText(scoreText + "🟩")
    } else {
      setScoreText(scoreText + "🟥");
    }

    if (index < images.length - 1) {
      setIndex(index + 1);
    } else {
      setIsModalOpen(true);
    }

  };

  let answers = images.map((image) => {
    let generatedText;
    if (image.generated) {
      generatedText = "AI"
    } else {
      generatedText = "Real"
    }
    return <div><img className="rounded-lg" src={image.url} /><p>{generatedText}</p></div>
  }
  );


  return (
    <div className='w-10/12 h-full'>
      <div className='flex justify-center max'>
        <img className='w-auto mb-2 rounded-lg h-full' src={images[index].url}>
        </img>
      </div>
      <div className='flex flex-row gap-2'>
        <button className='w-full mb-2 text-body' onClick={() => { makeChoice(false) }}>
          Real
        </button>
        <button className='w-full mb-2 text-body' onClick={() => { makeChoice(true) }}>
          AI
        </button>
      </div>
      <Modal title="Well Played!" open={isModalOpen} width={'80vw'} footer={[
        <button onClick={() => navigator.clipboard.writeText("Imaginate " + scoreText)}>
          Share
        </button>
      ]}
        onCancel={() => setIsModalOpen(false)}
      > <div className="text-center grid gap-6 grid-cols-1">
          <p>You got {score} out of {images.length} correct!</p>
          <div className="flex gap-4">{answers}</div>
          <p>{scoreText}</p>
        </div>
      </Modal >

    </div>
  )
}



function App() {

  const { darkAlgorithm } = theme;

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}>

        <Navbar />
        <div className='page-content self-center my-auto'>
          <PhotoQueue images={testImages} />
        </div>
      </ConfigProvider>
    </>
  )
}

export default App
