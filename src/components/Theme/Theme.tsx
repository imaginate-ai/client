import { Flex, Tooltip } from "antd";
import { StarOutlined } from "@ant-design/icons";

const ThemeWidget = ({ theme }: { theme: string }) => {
  return (
    <Tooltip title="Daily Theme">
      <Flex>
        <StarOutlined className="mr-1" />
        <p>{theme}</p>
      </Flex>
    </Tooltip>
  );
};

export default ThemeWidget;
