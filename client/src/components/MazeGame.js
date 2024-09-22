import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './MazeGame.module.css'; // Import the CSS module
import { Link } from 'react-router-dom';

const MazeGame = () => {
    const canvasRef = useRef(null);
    const [difficulty, setDifficulty] = useState('easy');
    const [currentMazeIndex, setCurrentMazeIndex] = useState(0);
    const tileSize = 40;
    const [player, setPlayer] = useState({ x: 1, y: 1 });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [touchStart, setTouchStart] = useState(null);

    // Define maze configurations for different difficulty levels
    const mazeConfigs = {
        easy: [
            {
                maze: [
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 1, 1],
                    [1, 0, 1, 0, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1, 0, 0, 1],
                    [1, 1, 1, 0, 1, 0, 0, 1],
                    [1, 0, 0, 0, 0, 1, 0, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 }, // Starting point
                end: { x: 5, y: 5 } // Ending point
            },
            {
                maze: [
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 1],
                    [1, 0, 1, 0, 0, 0, 1, 1],
                    [1, 0, 0, 1, 1, 0, 1, 1],
                    [1, 1, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 0, 0, 0, 1, 1],
                    [1, 0, 1, 1, 1, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 }, // Starting point
                end: { x: 6, y: 6 } // Ending point
            }
        ],
        medium: [
            {
                maze: [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
                    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 }, // Starting point
                end: { x: 7, y: 7 } // Updated endpoint
            },
            {
                maze: [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 }, // Starting point
                end: { x: 7, y: 2 } // Updated endpoint
            }
        ],
        hard: [
            {
                maze: [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1],
                    [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1],
                    [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 }, // Starting point
                end: { x: 10, y: 8 } // Updated endpoint
            },
            {
                maze: [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
                    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1],
                    [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1],
                    [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 }, // Starting point
                end: { x: 10, y: 1 } // Updated endpoint
            }
        ]
    };

    const wallImage = new Image();
    wallImage.src = '/images/mazewall.png';

    const playerImage = new Image();
    playerImage.src = 'https://i.imgur.com/FcH1IrO.png';

    const endpointImage = new Image();
    endpointImage.src = 'https://i.imgur.com/fq9B7Ro.png';

    useEffect(() => {
        const handleImageLoad = () => {
            if (wallImage.complete && playerImage.complete && endpointImage.complete) {
                setImagesLoaded(true);
            }
        };

        wallImage.onload = handleImageLoad;
        playerImage.onload = handleImageLoad;
        endpointImage.onload = handleImageLoad;

        return () => {
            wallImage.onload = null;
            playerImage.onload = null;
            endpointImage.onload = null;
        };
    }, [wallImage, playerImage, endpointImage, setImagesLoaded]);

    const drawMaze = useCallback(() => {
        if (!imagesLoaded) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const maze = mazeConfigs[difficulty][currentMazeIndex]?.maze;

        if (!maze) {
            console.error('Maze configuration is not available.');
            return;
        }

        const mazeWidth = maze[0].length * tileSize;
        const mazeHeight = maze.length * tileSize;
        const offsetX = (canvas.width - mazeWidth) / 2;
        const offsetY = (canvas.height - mazeHeight) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        maze.forEach((row, y) => {
            row.forEach((tile, x) => {
                const drawX = offsetX + x * tileSize;
                const drawY = offsetY + y * tileSize;

                if (tile === 1) {
                    ctx.drawImage(wallImage, drawX, drawY, tileSize, tileSize);
                } else {
                    ctx.fillStyle = 'brown';
                    ctx.fillRect(drawX, drawY, tileSize, tileSize);
                }
            });
        });

        const end = mazeConfigs[difficulty][currentMazeIndex]?.end;
        if (end) {
            drawEndpoint(offsetX + end.x * tileSize, offsetY + end.y * tileSize);
        }

        drawPlayer(offsetX + player.x * tileSize, offsetY + player.y * tileSize);
    }, [difficulty, currentMazeIndex, player, imagesLoaded, wallImage]);

    const drawPlayer = (x, y) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(playerImage, x, y, tileSize, tileSize);
    };

    const drawEndpoint = (x, y) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(endpointImage, x, y, tileSize, tileSize);
    };

    useEffect(() => {
        drawMaze();
    }, [difficulty, currentMazeIndex, player, imagesLoaded, drawMaze]);

    const handleRestart = () => {
        const start = mazeConfigs[difficulty][currentMazeIndex].start;
        setPlayer({ x: start.x, y: start.y });
    };

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
        setCurrentMazeIndex(0);
        handleRestart();
    };

    const handleKeyDown = useCallback((event) => {
        const maze = mazeConfigs[difficulty][currentMazeIndex].maze;
        let newX = player.x;
        let newY = player.y;

        switch (event.key) {
            case 'ArrowUp':
                newY = player.y - 1;
                break;
            case 'ArrowDown':
                newY = player.y + 1;
                break;
            case 'ArrowLeft':
                newX = player.x - 1;
                break;
            case 'ArrowRight':
                newX = player.x + 1;
                break;
            default:
                return; // Do nothing for other keys
        }

        // Check if the new position is valid
        if (maze[newY] && maze[newY][newX] === 0) {
            setPlayer({ x: newX, y: newY });
        }

        // Check if player reached the endpoint
        const end = mazeConfigs[difficulty][currentMazeIndex].end;
        if (newX === end.x && newY === end.y) {
            if (currentMazeIndex < mazeConfigs[difficulty].length - 1) {
                setModalMessage('You reached the endpoint! Loading next level...');
                setShowModal(true);
                setTimeout(() => {
                    setCurrentMazeIndex(currentMazeIndex + 1);
                    setShowModal(false);
                    handleRestart();
                }, 2000);
            } else {
                setModalMessage('You completed all levels in this difficulty!');
                setShowModal(true);
                setTimeout(() => {
                    setCurrentMazeIndex(0);
                    setShowModal(false);
                    handleRestart();
                }, 2000);
            }
        }
    }, [difficulty, currentMazeIndex, player]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    // Touch event handlers
    const handleTouchStart = useCallback((event) => {
	event.preventDefault();
	const touch = event.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
    }, []);

    const handleTouchMove = useCallback((event) => {
	event.preventDefault();
	if (!touchStart) return;

        const touch = event.touches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                handleKeyDown({ key: 'ArrowRight' });
            } else {
                handleKeyDown({ key: 'ArrowLeft' });
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                handleKeyDown({ key: 'ArrowDown' });
            } else {
                handleKeyDown({ key: 'ArrowUp' });
            }
        }

        setTouchStart(null);
    }, [touchStart, handleKeyDown]);

    const handleTouchEnd = useCallback((event) => {
	event.preventDefault();
        setTouchStart(null);
    }, []);

    useEffect(() => {
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return (
        <div id="mazeContainer" className={styles.mazeContainer}>
            <Link to="/dashboard" className={styles.backButton}>Back to Dashboard</Link>
            <div id="mazeControls" className={styles.mazeControls}>
                <select id="difficulty" value={difficulty} onChange={handleDifficultyChange} className={styles.difficulty}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <button id="restartBtn" onClick={handleRestart} className={styles.restartBtn}>Restart</button>
            </div>
            <canvas ref={canvasRef} width={550} height={490} className={styles.mazeCanvas}></canvas>
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>{modalMessage}</p>
                        <button className={styles.modalButton} onClick={() => setShowModal(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MazeGame;
