// src/components/useGameLogic.js
import { useState, useEffect } from 'react';

const useGameLogic = (levels) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (currentObjectIndex >= levels[currentLevelIndex].objects.length) {
      if (currentLevelIndex >= levels.length - 1) {
        setGameOver(true);
      } else {
        setCurrentLevelIndex(currentLevelIndex + 1);
        setCurrentObjectIndex(0);
      }
    }
  }, [currentObjectIndex, currentLevelIndex, levels]);

  const handleObjectClick = (id) => {
    const targetId = levels[currentLevelIndex].objects[currentObjectIndex].id;
    if (id === targetId) {
      setCurrentObjectIndex(currentObjectIndex + 1);
    }
  };

  return { currentLevelIndex, currentObjectIndex, gameOver, handleObjectClick };
};

export default useGameLogic;
