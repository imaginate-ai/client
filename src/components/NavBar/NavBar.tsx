import { Divider, Flex } from "antd";
import logo from "../../assets/imaginate-logo.png";
import mobileLogo from "../../assets/imaginate-beaker.png";
import "./NavBar.css";
import StreakWidget from "../Streak/Streak";
import ThemeWidget from "../Theme/Theme";

type NavBarProps = {
  theme: string | undefined;
};

const NavBar = ({ theme }: NavBarProps) => {
  return (
    <div className="w-full px-4 pt-4">
      <Flex align="center" justify="space-between" wrap>
        {window.innerWidth < 480
          ? <img className="h-10" src={mobileLogo} />
          : <img className="h-10" src={logo} />}
        <Flex align="flex-end" justify="space-between" gap="16px">
          {theme ? <ThemeWidget theme={theme} /> : null}
          <StreakWidget />
        </Flex>
      </Flex>
      <Divider />
    </div>
  );
};

export default NavBar;
