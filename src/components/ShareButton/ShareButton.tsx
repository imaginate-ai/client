import { Button } from 'antd';
import { useRef } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import posthog from 'posthog-js';

interface shareButtonProps {
  scoreText: string | undefined;
}

const ShareButton = ({ scoreText }: shareButtonProps) => {
  const shareButton = useRef<HTMLButtonElement>(null);

  const share = () => {
    if (shareButton.current) {
      if (scoreText) {
        navigator.clipboard.writeText(scoreText);
        shareButton.current.innerHTML = '🎉 Score copied!';
        posthog.capture('score_copied');
      } else {
        shareButton.current.textContent = 'Something went wrong :(';
      }
    }
  };

  const button = (
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
  );

  return <>{scoreText ? button : null}</>;
};

export default ShareButton;
