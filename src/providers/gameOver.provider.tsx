import { createContext, useContext, useState } from 'react';

type GameOverContextType = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
];

export const GameOverContext = createContext<GameOverContextType>(
  [] as unknown as GameOverContextType,
);

export const GameOverProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const useStateValue = useState(false);
  return (
    <GameOverContext.Provider value={useStateValue}>
      {children}
    </GameOverContext.Provider>
  );
};

export const useGameOverContext = (): GameOverContextType =>
  useContext<GameOverContextType>(GameOverContext);
