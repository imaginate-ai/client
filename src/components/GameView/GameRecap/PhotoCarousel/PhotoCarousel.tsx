import { Choice } from "../../../../types/Image.types";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { animated, useTransition } from "@react-spring/web";
import PhotoSelector from "./PhotoSelector";
import { Flex } from "antd";

type PhotoCarouselProps = {
  choices: Choice[];
};

const PhotoCarousel = ({ choices }: PhotoCarouselProps) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [animationOffset, setAnimationOffset] = useState(20);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const transitions = useTransition(photoIndex, {
    from: {
      opacity: 0,
      transform: `translateX(${animationOffset}px)`,
    },
    enter: { opacity: 1, transform: `translateX(0px)` },
    leave: { opacity: 0, transform: `translateX(${-1 * animationOffset}px)` },
    config: {
      duration: 200,
      easing: (t) => Math.pow(t - 1, 3) + 1,
    },
    keys: [photoIndex],
    exitBeforeEnter: true,
  });

  const onSelectNewPhotoIndex = (newIndex: number) => {
    setIsButtonClicked(true);
    setAnimationOffset((newIndex - photoIndex) * 20);
    setPhotoIndex(newIndex);
  };

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isButtonClicked) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (choices.length > 0) {
      intervalRef.current = setInterval(() => {
        setPhotoIndex((prevIndex) => (prevIndex + 1) % choices.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isButtonClicked, choices]);

  const photos = choices.map(({ isCorrect: correct, image }) => {
    const generatedText = image.real ? "real" : "AI";
    const feedbackIconClasses = "text-6xl absolute bottom-6 right-6 z-10";
    const feedbackIcon = correct
      ? <CheckOutlined className={feedbackIconClasses + " text-green-600"} />
      : <CloseOutlined className={feedbackIconClasses + " text-red-600"} />;
    return (
      <Flex
        justify="center"
        align="center"
        vertical
        className="w-full h-full"
        key={image.url}
      >
        <div
          style={{ maxHeight: "40svh" }}
          className="relative flex-auto aspect-square m-4 rounded-lg rounded-lg overflow-hidden"
        >
          <img
            className=" object-contain w-full h-full"
            src={`data:image/png;base64,${image.data}`}
          />
          {feedbackIcon}
        </div>
        <p className="text-2xl">This photo is {generatedText}</p>
      </Flex>
    );
  });

  return (
    <Flex justify="center" align="center" className="w-full h-full" vertical>
      {transitions((style, item) => {
        return (
          <animated.div
            className={"w-full h-full"}
            style={style}
          >
            {photos[item]}
          </animated.div>
        );
      })}
      <div className="max-w-lg mt-4">
        <PhotoSelector
          choices={choices}
          clickHandler={onSelectNewPhotoIndex}
          selectedIndex={photoIndex}
        />
      </div>
    </Flex>
  );
};

export default PhotoCarousel;
