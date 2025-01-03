import { createContext } from 'react';

const StreakContext = createContext(0);

const StreakProvider = ({ children }) => {
  const [streak, setStreak] = useState(0);
  return (<StreakContext.Provider value={{streak, setStreak}})
};
