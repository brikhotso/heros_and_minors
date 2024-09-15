import React, { useState, useEffect } from 'react';
import styles from './HiddenObjectGame.module.css';

const HiddenObjectGame = () => {
  const objects = [
    { id: 'hiddenObject1', src: 'https://i.imgur.com/6hK4wJk.png', position: { left: '600px', top: '200px' } },
    { id: 'hiddenObject2', src: 'https://i.imgur.com/iabtXYR.jpg', position: { left: '160px', top: '470px' } },
    { id: 'hiddenObject3', src: 'https://i.imgur.com/3HI1e96.jpg', position: { left: '610px', top: '460px' } },
    { id: 'hiddenObject4', src: 'https://i.imgur.com/fq9B7Ro.png', position: { left: '440px', top: '350px' } },
    { id: 'hiddenObject5', src: 'https://i.imgur.com/BS1Y5pO.jpg', position: { left: '70px', top: '250px' } },
    { id: 'hiddenObject6', src: 'https://i.imgur.com/v2p1bPG.jpg', position: { left: '750px', top: '380px' } }
  ];

  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (currentObjectIndex >= objects.length) {
      setGameOver(true);
    }
  }, [currentObjectIndex, objects.length]);

  const handleObjectClick = (id) => {
    const targetId = objects[currentObjectIndex].id;
    if (id === targetId) {
      setCurrentObjectIndex(currentObjectIndex + 1);
    }
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameContainerInner}>
        <div className={styles.instructionContainer}>
          {!gameOver && (
            <>
              <p className={styles.instruction}>Find the object:</p>
              <img className={styles.targetImage} src={objects[currentObjectIndex]?.src} alt="Object to find" />
            </>
          )}
        </div>

        <img className={styles.gameBackground} src="https://i.imgur.com/dDB97ay.jpg" alt="Game Background" />

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

export default HiddenObjectGame;
