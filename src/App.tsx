import { FC, useState } from 'react'
import './App.css'
import { PhotoQueueProps } from './interfaces/PhotoQueueProps'
import { testImages } from './testData'
import Navbar from './navigation/Navbar';

const PhotoQueue = ({ images }: PhotoQueueProps): JSX.Element => {
  const [index, setIndex] = useState(0);

  const makeChoice = (choseGenerated: boolean) => {

    const correctChoice = (choseGenerated == images[index].generated)

    if (correctChoice) {
      console.log("Correct!")
      //increase score
    }

    if (index < images.length - 1) {
      setIndex(index + 1)
    } else {
      //handle game over
    }

  };

  return (
    <div className='w-10/12 h-full mt-10'>
      <div className='flex justify-center max-h-1/2'>
        <img className='w-auto mb-2 rounded-lg h-full' src={images[index].url} />
      </div>
      <div className='block h-1/3'>
        <button className='w-full mb-2' onClick={() => { makeChoice(false) }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <button className='w-full mb-2' onClick={() => { makeChoice(true) }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>
      </div>
    </div>
  )
}


function App() {

  return (
    <div className='w-screen h-screen'>
      <Navbar />
      <div className='page-content flex justify-center'>
        <PhotoQueue images={testImages} />
      </div>


    </div>
  )
}

export default App
