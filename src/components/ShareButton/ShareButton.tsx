import { Button } from 'antd';
import { useRef } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import posthog from 'posthog-js';

type shareButtonProps = {
  scoreText: string | undefined;
};

const ShareButton = ({ scoreText }: shareButtonProps) => {
  const shareButton = useRef<HTMLButtonElement>(null);

  const share = async () => {
    const isMobile = () => {
      const regex =
        /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return regex.test(navigator.userAgent);
    };
    if (shareButton.current && scoreText) {
      try {
        if (isMobile()) {
          const shareData = {
            title: 'Imaginate',
            text: scoreText,
            url: 'https://playimaginate.com',
          };
          await navigator.share(shareData);
          shareButton.current.innerHTML = '🎉 Score shared!';
        } else {
          await navigator.clipboard.writeText(scoreText);
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
