import { Flex } from "antd";
import { Image } from "@local-types/Image.types";
import loadingGif from "@assets/loading.gif";

type GamePhotosProps = {
  photo: Image | undefined;
  feedbackOverlay: React.ReactNode | undefined;
};

const GamePhotoView = ({ photo, feedbackOverlay }: GamePhotosProps) => {
  return (
    <Flex
      className="w-full h-full relative min-w-0 min-h-0"
      justify="center"
      align="center"
      style={{
        backgroundColor: undefined,
      }}
    >
      <div className="flex-1 max-w-full max-h-full aspect-square rounded-xl overflow-hidden relative">
        {photo
          ? (
            <>
              <img
                className=""
                src={`data:image/png;base64,${photo.data}`}
              />
              <div className="opacity-75 absolute w-full h-full z-10 top-0">
                {feedbackOverlay}
              </div>
            </>
          )
          : (
            <div className="w-full h-full bg-zinc-900 relative">
              <Flex
                align="center"
                justify="center"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                vertical
              >
                <img width="192px" src={loadingGif} />
                <p className="text-center mt-4">Loading images...</p>
              </Flex>
            </div>
          )}
      </div>
    </Flex>
  );
};

export default GamePhotoView;
