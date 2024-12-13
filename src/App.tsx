import { ReactElement, useEffect, useRef, useState } from "react";
import "./App.css";
import Navbar from "./navigation/Navbar";
import { Alert, ConfigProvider, Divider, Flex, theme } from "antd";

import posthog from "posthog-js";
import Cookies from "universal-cookie";
import { PhotoQueue } from "./photoQueue/photoQueue.tsx";
import { getImages } from "./services/imageBackend.ts";
import { Image } from "./photoQueue/interfaces/ImageInterface.ts";

const cookies = new Cookies();

function App() {
  const { darkAlgorithm } = theme;
  const [showApp, setShowApp] = useState(true);
  const savedScoreString = useRef<ReactElement>();
  const [images, setImages] = useState<Image[]>([]);
  const [imageTheme, setImageTheme] = useState("");

  useEffect(() => {
    getImages().then((response: Image[]) => {
      if (response) {
        setImages(response);
        setImageTheme(response[0].theme);
      }
    });
  }, []);

  const splitNewlinesToParagraphTags = (input: string) => {
    return input.split("\n").map((text) => <p key={text}>{text}</p>);
  };

  useEffect(() => {
    const dayLastPlayed = new Date(cookies.get("day_last_played"));
    const completeScoreText: string = cookies.get("last_complete_score_text");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
      dayLastPlayed.toDateString() === today.toDateString() &&
      completeScoreText
    ) {
      setShowApp(false);
      savedScoreString.current = (
        <div>{splitNewlinesToParagraphTags(completeScoreText)}</div>
      );
    }
  }, []);

  const dailyGameReminder = (
    <div className="text-center">
      <p className="font-semibold mb-2">You already played today!</p>
      <p className="font-semibold mb-2">See you again tomorrow :)</p>
      {savedScoreString.current}
    </div>
  );

  return (
    <div className="h-full max-h-svh">
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <Flex
          style={{ width: "100vw", maxWidth: "1024px" }}
          align="center"
          justify="space-between"
          className="h-full w-full "
          vertical
        >
          <Navbar theme={imageTheme} />
          <Alert
            message="WE ARE BEING IMPERSONATED ON TWITTER"
            description="Twitter user @imaginate_ai is using our name and branding to support a crypto scam. Do not invest."
            type="error"
            showIcon
            closable
          />

          <Flex
            align="center"
            justify="space-evenly"
            className="flex-auto w-full"
            vertical
          >
            {showApp ? <PhotoQueue images={images} /> : dailyGameReminder}
          </Flex>
          <Flex
            className="text-center m-8"
            align="center"
            justify="center"
          >
            <p>
              Follow us on{" "}
              <a
                href="https://bsky.app/profile/playimaginate.bsky.social"
                onClick={() => posthog.capture("bluesky_link_click")}
              >
                bluesky
              </a>
            </p>
            <Divider type="vertical" />
            <p>
              Made by{" "}
              <a
                href="https://faisal-fawad.github.io"
                onClick={() => posthog.capture("faisal_link_click")}
                target="_blank"
              >
                Faisal
              </a>
              ,{" "}
              <a
                href="https://nathanprobert.ca"
                onClick={() => posthog.capture("nate_link_click")}
                target="_blank"
              >
                Nate
              </a>
              , and{" "}
              <a
                href="https://zachlegesse.ca"
                onClick={() => posthog.capture("zach_link_click")}
                target="_blank"
              >
                Zach
              </a>
            </p>
            <Divider type="vertical" />
            <a
              className="text-slate-600 underline"
              href="https://pexels.com"
              target="_blank"
            >
              Pexels.com
            </a>
          </Flex>
        </Flex>
      </ConfigProvider>
    </div>
  );
}

export default App;
