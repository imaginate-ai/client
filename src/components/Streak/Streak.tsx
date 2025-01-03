import { Flex } from "antd";
import { FireOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { calculateDayFromDate, currentDay } from "../../services/Day.service";
import { useGameOverContext } from "../../providers/gameState.provider";

const StreakWidget = () => {
  const [streak, playedToday] = UseStreak();
  return (
    <Flex>
      {playedToday ? "🔥" : <FireOutlined className="mr-1" />}
      <p>{streak}</p>
    </Flex>
  );
};

const UseStreak = () => {
  const [streak, setStreak] = useState(0);
  const [playedToday, setPlayedToday] = useState(false);
  const [isGameOver] = useGameOverContext();
  useEffect(() => {
    if (isGameOver) {
      setStreak(streak + 1);
      localStorage.setItem("streak", String(streak + 1));
      setPlayedToday(true);
    }
  }, [isGameOver]);
  useEffect(() => {
    const savedStreak = Number(localStorage.getItem("streak"));
    setStreak(savedStreak);
    const [today, dayLastPlayed] = getDayInformation();
    const dayBeforeYesterday = today - 2;
    if (
      today === dayLastPlayed
    ) {
      setPlayedToday(true);
    } else if (dayBeforeYesterday >= dayLastPlayed) {
      localStorage.setItem("streak", String(0));
    }
  }, []);
  return [streak, playedToday];
};

const getDayInformation = (): [today: number, dayLastPlayed: number] => {
  const lastPlayedTimestamp = localStorage.getItem("day_last_played");
  const dayLastPlayed = lastPlayedTimestamp
    ? calculateDayFromDate(
      new Date(Number(lastPlayedTimestamp)),
    )
    : 0;
  return [currentDay(), dayLastPlayed];
};

export default StreakWidget;
