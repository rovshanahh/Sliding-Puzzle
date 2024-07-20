import React, { useState, useEffect } from "react";
import "./styles.css";

const SlidingPuzzle = () => {
  const [board, setBoard] = useState([]);
  const [size, setSize] = useState(3); // Default size is 3x3
  const [musicOn, setMusicOn] = useState(true);
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [currentMusic, setCurrentMusic] = useState("music1"); // Default music
  const [gameOver, setGameOver] = useState(false); // Flag to track game completion

  useEffect(() => {
    initializeBoard();
  }, [size]);

  useEffect(() => {
    if (musicOn) {
      playBackgroundMusic(currentMusic);
    } else {
      pauseBackgroundMusic(currentMusic);
    }
  }, [musicOn, currentMusic]);

  const initializeBoard = () => {
    const newBoard = [];
    for (let i = 0; i < size * size - 2; i++) {
      newBoard.push(i + 1);
    }
    newBoard.push(null, null); // Two empty spaces
    setBoard(shuffle(newBoard));
    setGameOver(false); // Reset game over flag
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffleBoard = () => {
    setBoard(shuffle([...board]));
    setGameOver(false); // Reset game over flag
  };

  const playBackgroundMusic = (musicId) => {
    const audioElement = document.getElementById(musicId);
    if (audioElement) {
      audioElement.loop = true; // Loop the background music
      audioElement.play();
    }
  };

  const pauseBackgroundMusic = (musicId) => {
    const audioElement = document.getElementById(musicId);
    if (audioElement) {
      audioElement.pause();
    }
  };

  const handleMusicChange = (e) => {
    pauseBackgroundMusic(currentMusic);
    setCurrentMusic(e.target.value);
    if (musicOn) {
      playBackgroundMusic(e.target.value);
    }
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  const handleFontSizeChange = (newFontSize) => {
    setFontSize(newFontSize);
  };

  const toggleMusic = () => {
    setMusicOn(!musicOn);
  };

  const handleTileClick = (index) => {
    const newBoard = [...board];
    const emptyIndices = newBoard
      .map((val, idx) => (val === null ? idx : -1))
      .filter((idx) => idx !== -1);

    for (const emptyIndex of emptyIndices) {
      const row = Math.floor(index / size);
      const col = index % size;
      const emptyRow = Math.floor(emptyIndex / size);
      const emptyCol = emptyIndex % size;

      if (
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)
      ) {
        [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
        setBoard(newBoard);
        return;
      }
    }
  };

  const checkGameOver = () => {
    if (board.every((tile, index) => tile === index + 1 || tile === null && index === board.length - 1)) {
      setGameOver(true);
      console.log("Game Over!", board, gameOver);
    } else {
      setGameOver(false);
      console.log("Not Game Over", board, gameOver);
    }
  };

  return (
    <div className="container">
      <h1>Sliding Puzzle</h1>
      <button onClick={shuffleBoard}>Restart</button>
      <button onClick={toggleMusic}>{musicOn ? "Turn off" : "Turn on"} Music</button>
      <select onChange={handleMusicChange}>
        <option value="music1">Clown</option>
        <option value="music2">Flowers</option>
        <option value="music3">Happy Piano</option>
      </select>
      <select onChange={(e) => handleSizeChange(parseInt(e.target.value))}>
        <option value={3}>3x3</option>
        <option value={4}>4x4</option>
        {/* Add more options for larger sizes if needed */}
      </select>
      <input
        type="range"
        min={12}
        max={24}
        value={fontSize}
        onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
      />
      <div className="board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {board.map((tile, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className={tile === null ? "empty" : ""}
            style={{
              fontSize: `${fontSize}px`,
            }}
          >
            {tile !== null ? tile : ""}
          </div>
        ))}
      </div>
      {gameOver && <p className="game-over">Game Over!</p>}
    </div>
  );
};

export default SlidingPuzzle;