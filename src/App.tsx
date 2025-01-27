import "./App.css";
import { ConfigProvider, Flex, theme } from "antd";
import NavBar from "./components/NavBar/NavBar.tsx";
import GameView from "./components/GameView/GameView.tsx";
import { usePhotos } from "./hooks/photos.hook.tsx";
import GameFooter from "./components/Footer/Footer.tsx";

function App() {
  const { darkAlgorithm } = theme;
  const [_photos, photoTheme] = usePhotos();

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
          <NavBar theme={photoTheme} />
          <Flex
            align="center"
            justify="center"
            className="h-full w-full flex-auto"
            vertical
          >
            <GameView />
          </Flex>
        </Flex>
        <GameFooter />
      </ConfigProvider>
    </div>
  );
}

export default App;
