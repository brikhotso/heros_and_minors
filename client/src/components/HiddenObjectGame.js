// src/components/HiddenObjectGame.js
import React from 'react';
import styles from './HiddenObjectGame.module.css';
import { Link } from 'react-router-dom';
import levels from './levels';
import useGameLogic from './useGameLogic';

const HiddenObjectGame = () => {
  const { currentLevelIndex, currentObjectIndex, gameOver, handleObjectClick } = useGameLogic(levels);
  const currentLevel = levels[currentLevelIndex];
  const objects = currentLevel.objects;

  return (
    <div className={styles.gameContainer}>
      <Link to="/dashboard" className={styles.backButton}>🏠</Link>
      <div className={styles.gameContainerInner}>
        <div className={styles.instructionContainer}>
          {!gameOver && (
            <>
              <p className={styles.instruction}>Find the object:</p>
              <img className={styles.targetImage} src={objects[currentObjectIndex]?.src} alt="Object to find" />
            </>
          )}
        </div>

        <img className={styles.gameBackground} src={currentLevel.background} alt="Game Background" />

        {objects.map((obj, index) => (
          <img
            key={obj.id}
            className={styles.hiddenObject}
            src={obj.src}
            style={{
              display: index < currentObjectIndex ? 'none' : 'block', 
              ...obj.position
            }}
            onClick={() => handleObjectClick(obj.id)}
            alt={`Object ${index + 1}`}
          />
        ))}

        {gameOver && (
          <div className={styles.gameOverMessage}>Congratulations! You have found all the objects!</div>
        )}
      </div>
    </div>
  );
};

export default React.memo(HiddenObjectGame);

