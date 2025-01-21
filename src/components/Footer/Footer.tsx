import { Divider, Flex } from "antd";
import posthog from "posthog-js";

const GameFooter = () => {
  return (
    <Flex className="text-center m-8" align="center" justify="center" vertical>
      <Divider />
      <p>
        Made by{" "}
        <a
          href="https://faisal-fawad.github.io"
          onClick={() =>
            posthog.capture("faisal_link_click")}
          target="_blank"
        >
          Faisal
        </a>
        ,{" "}
        <a
          href="https://nathanprobert.ca"
          onClick={() =>
            posthog.capture("nate_link_click")}
          target="_blank"
        >
          Nate
        </a>
        , and{" "}
        <a
          href="https://zachlegesse.ca"
          onClick={() =>
            posthog.capture("zach_link_click")}
          target="_blank"
        >
          Zach
        </a>
      </p>
      <a
        className="text-slate-600 underline"
        href="https://pexels.com"
        target="_blank"
      >
        Pexels.com
      </a>
    </Flex>
  );
};

export default GameFooter;
